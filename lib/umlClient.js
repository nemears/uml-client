var WebSocket = require('websocket').w3cwebsocket;
import { cleanupReferences, randomID } from "./element";
import parse from "./parse";
import { restoreReference } from "./set";
const yaml = require('js-yaml');

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

export default class UmlWebClient {
    
    _head = undefined;
    _graph = new Map();
    _requestQueue = []
    client = undefined;
    initialized = false;
    otherClients = new Map();
    id = randomID();
    address = defaultAdress;
    project = randomID();
    group = defaultGroup;
    user = defaultUser;
    _password = ''; // idk feels weird to store it in object like this
    create = true
    color = '';
    // signature is (newElement, oldElement);
    onUpdate = () => {
        console.warn('override UmlWebclient.onUpdate for updates from server!');
    }
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

    constructor(options) {
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
            me.create = true;

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
                me.create = false;
            }
            if (options.password) {
                me._password = options.password;
            }

            // connect to websocket server
            me.client = new WebSocket(me.address, '');
            me.client.onopen = async () => {
                me.client.send(JSON.stringify({
                    id: me.id,
                    create: me.create,
                    server: '/' + me.group + '/' + me.project,
                    user: me.user,
                    password: me._password,
                }));
                me.client.onmessage = (msg)  => {
                    const msgObj = JSON.parse(msg.data);
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
                            me.client.send(JSON.stringify({heartbeat: me.id}));
                        }, 180000);

                        // handle messages from server
                        me.client.onmessage = (msg) => {
                            let msgData;
                            try {
                                msgData = JSON.parse(msg.data);
                            } catch (_) {
                                // assume it is response to last request
                                me._requestQueue.shift()(msg.data);
                                return;
                            }
                            const msgData = JSON.parse(msg.data);
                            if (msgData.put || msgData.PUT) {
                                // update of element from server
                                const putData = msgData.put ? msgData.put : msgData.PUT;
                                const elData = putData.element;
                                let parseData = this.parse(elData);
                                me.onUpdate(parseData.newElement, parseData.oldElement);
                            } else if (msgData.delete || msgData.DELETE) {
                                const deleteData = msgData.delete ? msgData.delete : msgData.DELETE;
                                const oldElement = me._graph.get(deleteData);
                                if (oldElement) {
                                    me._graph.delete(deleteData);
                                    me.onUpdate(undefined, oldElement);
                                    oldElement.deleteData(); // async
                                    const deleteDoLater = async () => {
                                        await oldElement.deleteData();
                                        await cleanupReferences(oldElement)
                                    };
                                    deleteDoLater
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
                            } else if (msgData.error) {
                                // TODO add onError handler
                                // just throwing error for now
                                throw Error(msgData.error.message);
                            } else {
                                // assume it is response to last request
                                me._requestQueue.shift()(msgData);
                            }
                        }

                        // resolve promise
                        resolveInitialization('fulfilled');
                    } else {
                        rejectInitialization(msg.data);
                    }
                };
            }
            me.client.onerror = (err) => {
                clearInterval(me.heartBeatMessages);
                rejectInitialization(err);
            }
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
                this.client.send(JSON.stringify({
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
            this.client.send(JSON.stringify({
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
            this.client.send(JSON.stringify(projectConfig));
            this._requestQueue.push((msg) => {
                this.client.onmessage = this.handleMessage;
                const response = JSON.parse(msg.data);
                if (response.success == 0) {
                    res();
                } else {
                    rej(response);
                }
            });
        });
    }

    /**
     * creates an element, registering it with the server
     * @param {*} type string
     * @param {*} options id can be supplied with id
     * @returns a newly created UML element of type type
     */
    post(type, options) {
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        let id = randomID();
        if (options && options.id) {
            id = options.id;
        }
        const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        this.client.send(JSON.stringify({
            post: camelToSnakeCase(type).toUpperCase(),
            id: id
        }));
        const json = {};
        json[type] = {
            id: id
        }
        const ret = parse(json);
        this._graph.set(id, ret);
        ret.manager = this;
        return ret;
    }

    /**
     * sends an element to the server to be communicated with other clients
     * @param {*} el 
     */
    put(el) {
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        this.client.send(JSON.stringify({
            put: {
                id: el.id,
                element: el.emit(),
            }
        }));
    }

    getLocal(id) {
        return this._graph.get(id);
    }

    getFromServer(id) {
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        return new Promise((resolveGetRequest) => {
            // send request for element to server
            this.client.send(JSON.stringify({
                get: id
            }));
            this._requestQueue.push(async (data) => {
                let elFromServer = parse(data);
                if (elFromServer === undefined) {
                    resolveGetRequest(undefined);
                } else {
                    this._graph.set(elFromServer.id, elFromServer);
                    if (id === '') {
                        this._head = elFromServer;
                    }
                    elFromServer.manager = this;
                    resolveGetRequest(elFromServer);
                }
            });
        });
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
            this.client.send(JSON.stringify({
                get: ''
            }));
            this._requestQueue.push(async (data) => {
                let elFromServer = parse(data);
                if (elFromServer === undefined) {
                    rejectHead('bad data!');
                } else {
                    this._graph.set(elFromServer.id, elFromServer);
                    this._head = elFromServer;
                    elFromServer.manager = this;
                    resolveHead(elFromServer);
                }
            });
        });
    }

    async deleteElement(el) {
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        if (this.client.readyState !== this.client.OPEN) {
            console.error("uml-user-service connection is closed");
            return;
        }
        await el.deleteData();
        await cleanupReferences(el)
        this._graph.delete(el.id);
        this.client.send(JSON.stringify({
            DELETE: el.id
        }));
    }

    select(el) {
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        if (typeof el === 'string') {
            this.client.send(JSON.stringify({
                select: el
            }));
        } else {
            this.client.send(JSON.stringify({
                select: el.id
            }));
        }
    }

    deselect(el) {
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        if (typeof el === 'string') {
            this.client.send(JSON.stringify({
                deselect: el
            }));
        } else {
            this.client.send(JSON.stringify({
                deselect: el.id
            }));
        }
    }

    load(umlData) {
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        this.client.send(JSON.stringify({
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
                res(data); // bad character at end, look into source
            });
        });
        this.client.send(JSON.stringify({
            dump: '.'
        }));
        return ret;
    }

    save() {
        if (!this.initialized) {
            throw new Error('Client is not initialized, await UmlWebClient.initialization before doing any operations!');
        }
        this.client.send(JSON.stringify({
            save: '.'
        }));
    }

    async close() {
        if (!this.initialized) {
            await this.initialization;
        }
        this.initialized = false;
        if (this.heartBeatMessages !== undefined) {
            clearInterval(this.heartBeatMessages);
        } 
        this.client.close();
        const closeHandler = async () => {
            this.client.onclose = () => {
                return true;
            };
        };
        await closeHandler();
    }

    parse(elData) {
        const newElement = parse(elData);
        const elID = newElement.id;
        const oldElement = this._graph.get(elID);
        this._graph.set(newElement.id, newElement);
        newElement.manager = this;

        // references
        if (oldElement) {
            oldElement.references.forEach((referenceEl, referenceID) => {
                if (!referenceEl) {
                    console.warn('undefined reference being restored');
                    return;
                }
                for (const setEntry of Object.entries(referenceEl.sets)) {
                    if (setEntry[1].data) {
                        // set
                        if (setEntry[1].contains(elID)) {
                            setEntry[1].data.find((setReference) => restoreReference(setReference, setEntry[1]));
                        }
                    } else if (setEntry[1].val) {
                        // singleton
                        if (setEntry[1].id() === elID) {
                            restoreReference(setEntry[1].val, setEntry[1]);
                        }
                    }
                }
                referenceEl.references.set(elID, newElement);
                newElement.references.set(referenceID, referenceEl);
            });
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
            this.client.send(JSON.stringify({
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
