import UmlManager from './manager.js';
import { cleanupReferences, randomID } from "./types/element.js";
import { restoreReference } from "./set.js";
import yaml from 'js-yaml';
import { generate as generate_new_manager } from './generate.js'

const defaultAdress = 'wss://uml.cafe/api/';
const defaultGroup = 'sessions'
const defaultUser = '0';

class ClientInfo {
    selectedElements = new Set();
    color = '';
    user = '';
    constructor(color, user) {
        if (color) {
            this.color = color;
            this.user = user;
        }
    }
}

export default class AbstractUmlClient extends UmlManager {
    
    _head = undefined;
    // _graph = new Map();
    _requestQueue = []
    initialized = false;
    otherClients = new Map();
    address = defaultAdress;
    project = randomID();
    group = defaultGroup;
    user = defaultUser;
    _password = ''; // idk feels weird to store it in object like this
    createProject = true
    color = '';
    
    // signature is (newElement, oldElement);
    updateHandlers = [];
    onClient = (event) => {
        console.warn('client of id ' + event.id + ' connectected to server. Override UmlWebClient.onClient to keep track of new clients, or to disable this warning message.');
    }
    onDropClient = (id) => {
        console.warn('client of id ' + id + ' dropped from server. Override UmlWebClient.onClient to keep track of clients dropping, or to disable this warning message.');
    }
    onSelect = (event) => {
        console.warn('client of id ' + event.client + ' selected element ' + event.id + '. Override UmlWebClient.onSelect to keep track of selectedElements, or to disable this warning message.');
    }
    onDeselect = (event) => {
        console.warn('client of id ' + event.client + ' deselected element ' + event.id + '. Override UmlWebClient.onDeselect to keep track of selectedElements, or to disable this warning message.');
    }

    constructor(wsInterface, options) {
        super();
        this._wsInterface = wsInterface;
        this.login(options);
    }

    /**
     * 
     * @param {*} options usually an object of the form
     * {
     *      address: the address of the websocket server
     *      project: the project name we are accessing
     *      group: the group that holds the project
     *      user: the username that is desired to be logged in with
     *      password: the password for the user
     * }
     */
    login(options) {
        if (this.initialized) {
            throw Error('Must close client before logging in again!bee');
        }
        const me = this; 
        this.initialization = new Promise((resolveInitialization, rejectInitialization) => {
            // restore defaults
            me.address = defaultAdress;
            me.project = randomID();
            me.group = defaultGroup;
            me.user = defaultUser;
            me.createProject = true;

            // take user input
            if (options.address) {
                me.address = options.address;
            }
            if (options.group) {
                me.group = options.group;
            }
            if (options.user) {
                me.user = options.user;
            }
            if (options.project) {
                me.project = options.project;
            }
            if (options.create === false) {
                me.createProject = false;
            }
            if (options.password) {
                me._password = options.password;
            }

            // connect to websocket server
            me._wsInterface.connect(me.address, '');
            // me.client = new me._websocketConstructor(me.address, '');
            // me.client.onopen = 
            me._wsInterface.onOpen(async () => {
                //me.client.send
                me._wsInterface.send(JSON.stringify({
                    id: me.id,
                    create: me.createProject,
                    server: me.group + '/' + me.project,
                    user: me.user,
                    password: me._password,
                }));
                // me.client.onmessage = 
                me._wsInterface.onFirstMessage((msg)  => {
                    const msgObj = JSON.parse(msg);
                    if (msgObj.client === me.id) {
                        me.initialized = true;
                        me.readonly = !msgObj.edit;
                        for (const otherClient of msgObj.otherClients) {
                            const clientInfo = new ClientInfo(otherClient.color, otherClient.user);
                            for (const selectedElement of otherClient.selected_elements) {
                                clientInfo.selectedElements.add(selectedElement);
                            }
                            me.otherClients.set(otherClient.id, clientInfo);
                        }
                        me.color = msgObj.color;

                        // send heartbeat so client doesn't disconnect
                        me.heartBeatMessages = setInterval(() => {
                            me._wsInterface.send(JSON.stringify({heartbeat: me.id}));
                        }, 180000);

                        // handle messages from server
                        // me.client.onmessage = 
                        me._wsInterface.onMessage((msg) => {
                            let msgData;
                            try {
                                msgData = JSON.parse(msg);
                            } catch (_) {
                                // assume it is response to last request
                                me._requestQueue.shift()(msg);
                                return;
                            }
                            if (msgData.put || msgData.PUT) {
                                // update of element from server
                                const putData = msgData.put ? msgData.put : msgData.PUT;
                                const doLater = async () => {
                                    const elData = putData.element;
                                    let parseData = await this.parseAndUpdate(elData);
                                    for (const updateHandler of me.updateHandlers) {
                                        updateHandler(parseData.newElement, parseData.oldElement);
                                    }
                                };
                                doLater();
                            } else if (msgData.delete || msgData.DELETE) {
                                const deleteData = msgData.delete ? msgData.delete : msgData.DELETE;
                                const oldElement = me._graph.get(deleteData);
                                if (oldElement) {
                                    for (const updateHandler of me.updateHandlers) {
                                        updateHandler(undefined, oldElement);
                                    }
                                    const deleteDoLater = async () => {
                                        await oldElement.deleteData();
                                        await cleanupReferences(oldElement)
                                        me._graph.delete(deleteData);
                                    };
                                    deleteDoLater();
                                }
                            } else if (msgData.client) {
                                const clientID = msgData.client.id;
                                me.otherClients.set(clientID, new ClientInfo(msgData.client.color, msgData.client.user));
                                me.onClient(msgData.client);
                            } else if (msgData.disconnect) {
                                me.otherClients.delete(msgData.disconnect);
                                me.onDropClient(msgData.disconnect);
                            } else if (msgData.select) {
                                const selectData = msgData.select;
                                const clientInfo = me.otherClients.get(selectData.client);
                                clientInfo.selectedElements.add(selectData.id);
                                me.onSelect(selectData);
                            } else if (msgData.deselect) {
                                const deselectData = msgData.deselect;
                                const clientInfo = me.otherClients.get(deselectData.client);
                                clientInfo.selectedElements.delete(deselectData.id);
                                me.onDeselect(deselectData);
                            } else if (msgData.error || msgData.ERROR) {
                                const error = msgData.error ? msgData.error : msgData.ERROR;
                                // TODO add onError handler
                                // just throwing error for now
                                if (error.message) {
                                    throw Error(error.message);
                                } else {
                                    throw Error(error);
                                }
                            } else {
                                // assume it is response to last request
                                me._requestQueue.shift()(msgData);
                            }
                        });


                        // process server info
                        const process_managers = new Promise(async (resolve_managers) => {
                            if (!msgObj.server_info) {
                                resolve_managers();
                            }
                            for (const manager_info of msgObj.server_info) {
                                const meta_manager_id = manager_info.id;
                                const uml_root = await me.getGetPromise(manager_info.uml_root);
                                const meta_manager  = await generate_new_manager(uml_root, me);
                                meta_manager.id = meta_manager_id;
                                me._meta_managers.set(meta_manager_id, meta_manager);
                            }
                            resolve_managers();
                        });


                        // resolve promise
                        process_managers.then(() => {
                            resolveInitialization('fulfilled');
                        });
                    } else {
                        rejectInitialization(msg);
                    }
                });
                me._wsInterface.onError((err) => {
                    clearInterval(me.heartBeatMessages);
                    rejectInitialization(err);
                });
            });
        });
        return this.initialization;
    }

    signUp(user, password) {
        const self = this;
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        return new Promise((res, rej) => {
            const sendSignupRequest = async () => {
                this._wsInterface.send(JSON.stringify({
                    signUp: {
                        user: user,
                        password: password,
                    }
                }));
            }
            sendSignupRequest();
            this._requestQueue.push((msgData) => {
                if (msgData.success) {
                    const doLater = async () => {
                        await self.close();
                        self.login({
                            address: self.address,
                            group: self.group,
                            project: self.project,
                            user: user,
                            password: password,
                        });
                        res();
                    };
                    doLater();
                } else {
                    rej(new Error('could not register new user!'))
                }
            });
        });
    }

    getProjectConfig() {
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        return new Promise((res, rej) => {
            this._wsInterface.send(JSON.stringify({
                getConfig: '/' + this.group + '/' + this.project
            }));
            this._requestQueue.push((msgData) => {
                if (msgData.project) {
                    res(msgData);
                } else {
                    rej(msgData);
                }
            });
        });
    }

    /*
    takes an object akin to the following, all fields are optional
        {
            project: {
                visibility: 'public', // can also be 'readonly' and 'private'
                edit: {
                    add: ['test'],
                    remove: ['user']
                },
                view: {
                    add: ['user'],
                    remove: ['test']
                }
            }
        }
    */
    updateProjectConfig(projectConfig) {
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        return new Promise((res, rej) => {
            // TODO check that the object matches field
            this._wsInterface.send(JSON.stringify(projectConfig));
            this._requestQueue.push((msg) => {
                if (msg.success == 0) {
                    res();
                } else {
                    rej(msg);
                }
            });
        });
    }

    async receiveDefaultResponse() {
        await new Promise((resolve, reject) => {
            this._requestQueue.push(async (data) => {
                if (data.status && data.status === 'success') {
                    resolve();
                }
                reject();
            });
        });
    }

    /**
     * creates an element, registering it with the server
     * @param {*} type string
     * @param {*} options id can be supplied with id
     * @returns a newly created UML element of type type
     */
    async post(type, options) {
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        let id = randomID();
        if (options && options.id) {
            id = options.id;
        } else {
            options = {
                id: id
            };
        }
        this._wsInterface.send(JSON.stringify({
            post: type,
            id: id
        }));
        await this.receiveDefaultResponse(); 
        return this.create(type, options);
    }
    
    /**
     * sends an element to the server to be communicated with other clients
     * @param {*} el 
     */
    async put(el) {
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        this._wsInterface.send(JSON.stringify({
            put: {
                id: el.id,
                element: el.emit(),
            }
        }));
        await this.receiveDefaultResponse(); 
    }

    getLocal(id) {
        return this._graph.get(id);
    }

    getGetPromise(id) {
        return new Promise((resolveGetRequest) => {
            // send request for element to server
            this._wsInterface.send(JSON.stringify({
                get: id
            }));
            this._requestQueue.push(async (data) => {
                try {
                let elFromServer = await this.parse(data);
                if (elFromServer === undefined) {
                    resolveGetRequest(undefined);
                } else {
                    this._graph.set(elFromServer.id, elFromServer);
                    if (id === '') {
                        this._head = elFromServer;
                    }
                    resolveGetRequest(elFromServer);
                }
                }
                catch (exception) {
                    console.warn('error resolving get request for element with id ' + id);
                    resolveGetRequest(undefined);
                }
            });
        });
    }

    getFromServer(id) {
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        return this.getGetPromise(id);
    }
    
    async get(id) {
        const localResult = this.getLocal(id);
        if (localResult) {
            // it was available locally
            return localResult;
        } else {
            return await this.getFromServer(id);
        }
    }

    head() {
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        return new Promise((resolveHead, rejectHead) => {
            this._wsInterface.send(JSON.stringify({
                get: ''
            }));
            this._requestQueue.push(async (data) => {
                let elFromServer = await this.parse(data);
                if (elFromServer === undefined) {
                    rejectHead('bad data!');
                } else {
                    this._graph.set(elFromServer.id, elFromServer);
                    this._head = elFromServer;
                    resolveHead(elFromServer);
                }
            });
        });
    }

    async delete(el) {
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        if (this._wsInterface.isConnected() /*this.client.readyState !== this.client.OPEN*/) {
            console.error("uml-user-service connection is closed");
            return;
        }
        await super.delete(el);
        this._wsInterface.send(JSON.stringify({
            DELETE: el.id
        }));
    }

    async generate(el) {
        if (!this.initialized) {
            throw new Error('client is not initialized. await UmlWebClient.initializetion before doing any operations!');
        }
        let generated_manager = await generate_new_manager(el, this);
        this._wsInterface.send(JSON.stringify({
            generate: el.id
        }));
        let me = this;
        return await new Promise((resolve, reject) => {
            me._requestQueue.push(async (data) => {
                if (!data['manager']) {
                    reject('bad result from server, bad format!');
                }
                let manager_id = data['manager'];
                generated_manager.id = manager_id;
                me._meta_managers.set(manager_id, generated_manager);
                resolve(generated_manager);
            });
        });
    }

    select(el) {
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        if (typeof el === 'string') {
            this._wsInterface.send(JSON.stringify({
                select: el
            }));
        } else {
            this._wsInterface.send(JSON.stringify({
                select: el.id
            }));
        }
    }

    deselect(el) {
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        if (typeof el === 'string') {
            this._wsInterface.send(JSON.stringify({
                deselect: el
            }));
        } else {
            this._wsInterface.send(JSON.stringify({
                deselect: el.id
            }));
        }
    }

    load(umlData) {
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        this._wsInterface.send(JSON.stringify({
            load : yaml.load(umlData)
        }));
    }

    dump() {
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        let ret = new Promise(res => {
            this._requestQueue.push((data) => {
                // just return raw string from server
                res(data); // b awaitad character at end, look into source
            });
        });
        this._wsInterface.send(JSON.stringify({
            dump: '.'
        }));
        return ret;
    }

    async save() {
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        this._wsInterface.send(JSON.stringify({
            save: '.'
        }));
        await this.receiveDefaultResponse(); 
    }

    async close() {
        if (!this.initialized) {
            await this.initialization;
        }
        this.initialized = false;
        if (this.heartBeatMessages !== undefined) {
            clearInterval(this.heartBeatMessages);
        } 
        this._wsInterface.close();
        const closeHandler = async () => {
            this._wsInterface.onClose(() => {
                return true;
            });
        };
        await closeHandler();
    }

    async parseAndUpdate(elData) {
        const type = this.parseType(elData);
        const elID = elData[type.typeInfo.name].id;
        const oldElement = this._graph.get(elID);
        const newElement = await this.parse(elData);
        this._graph.set(newElement.id, newElement);

        // references
        if (oldElement) {
            restoreReferences(oldElement, newElement);
        }

        return {
            newElement: newElement,
            oldElement: oldElement,
        };
    }

    async userInfo() {
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        return new Promise((res, rej) => {
            this._wsInterface.send(JSON.stringify({
                userInfo : {}    
            }));
            this._requestQueue.push((msgData) => {
                if (!msgData.name || !msgData.recentProjects || !msgData.userProjects) {
                    rej(msgData);
                } else {
                    res(msgData);
                }
            });
        });        
    }
}

export function restoreReferences(oldElement, newElement) {
    const elID = oldElement.id;
    oldElement.references.forEach((referenceEl, referenceID) => {
        if (!referenceEl) {
            console.warn('undefined reference being restored');
            return;
        }
        const visited = new Set();
        const queue = [referenceEl.typeInfo];
        while (queue.length > 0) {
            const front = queue.shift();
            if (visited.has(front)) {
                continue;
            }
            visited.add(front);
            for (const setPair of front.sets) {
                const set = setPair[1];
                if (set.setType() === 'set') {
                    if (set.contains(elID)) {
                        for (const elementReference of set.data) {
                            if (elementReference.id === elID) {
                                restoreReference(elementReference, set);
                            }
                        }
                    }
                } else if (set.setType() === 'singleton') {
                    const elementReference = set.val;
                    if (elementReference && elementReference.id === elID) {
                        restoreReference(elementReference, set);
                    }
                }
            }
            for (const base of front.base) {
                queue.push(base);
            }
        }
        referenceEl.references.set(elID, newElement);
        newElement.references.set(referenceID, referenceEl);
    });
}
