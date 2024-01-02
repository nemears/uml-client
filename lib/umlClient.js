var WebSocket = require('websocket').w3cwebsocket;
import parse from './parse.js';
import {randomID} from './element.js';
const EventEmitter = require('events');
const yaml = require('js-yaml');
import { ElementReference } from './set.js';

class ClientInfo {
    selectedElements = new Set();
}

export default class UmlWebClient {

    graph = {};
    #head = undefined;
    eventEmitter = new EventEmitter();
    initialized = false;
    nextMessagePromise = Promise.resolve();
    promiseFulfilled = true;
    otherClients = new Map();
    onUpdate = (element, oldElement) => {};
    onSelect = (client, element) => {};
    onDeselect = (client, element) => {};
    onClient = (client) => {};
    onClose = () => {};
    heartBeatMessages = undefined;
    options = undefined;

    /**
     * 
     * @param {
     *   address : the address of the api endpoint you are connecting to
     *   server : required field for name of the server
     *   user : the user logged in or '0' if no user
     *   password: the password for the user
     *   
     * } options, 
     */
    constructor(options) {
        this.login(options.user, options.password, options);
    }

    async post(type, options) {
        if (!this.initialized) {
            await this.initializationPromise;
        }
        let id = randomID();
        if (options && options['id']) {
            id = options['id'];
        }
        const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        this.eventEmitter.emit('newRequest', {
            type: 'POST',
            data: JSON.stringify({
                post: camelToSnakeCase(type).toUpperCase(),
                id: id
            })
        });
        let json = {};
        json[type] = {
            id: id
        }
        let ret = parse(json);
        this.graph[id] = ret;
        ret.manager = this;
        return ret;
    }

    async getFromServer(id) {
        if (id === undefined) {
            // console.error('bad id for get request!');
            throw new Error('bad id for get request!');
        }
        if (!this.initialized) {
            await this.initializationPromise;
        }
        this.eventEmitter.emit('newRequest', {
            type: 'GET',
            data: JSON.stringify({
                                    get: id
                                }),
            id: id
        });
        return await new Promise((res) => {
            const errorResponse = () => {
                console.error('could not get element of id ' + id + ' from server');
                res(undefined);
            };
            this.eventEmitter.once('GET:' + id, () => {
                this.eventEmitter.removeListener('ERROR:' + id, errorResponse);
                res(this.graph[id]);
            });
            this.eventEmitter.once('ERROR:' + id, errorResponse);
        });
    }

    getLocal(id) {
        return this.graph[id];
    }

    async get(id) {
        let ret = this.getLocal(id);
        if (ret) {
            return ret;
        }
        return await this.getFromServer(id);
    }

    async head() {
        if (!this.initialized) {
            await this.initializationPromise;
        }
        this.eventEmitter.emit('newRequest', {
            type: 'GET',
            data: JSON.stringify({
                                    get: ''
                                }),
            id: ''
        });
        return await new Promise((res) => {
            const errorResponse = () => {
                console.error('could not get head from server');
                res(undefined);
            };
            this.eventEmitter.once('GET:', () => {
                this.eventEmitter.removeListener('ERROR:', errorResponse);
                res(this.#head);
            });
            this.eventEmitter.once('ERROR:', errorResponse);
        });
    }

    async put(el) {
        if (!this.initialized) {
            await this.initializationPromise;
        }
        this.eventEmitter.emit('newRequest', {
            type: 'PUT',
            data: JSON.stringify({
                put: {
                    id: el.id,
                    element: el.emit(),
                }
            })
        });
    }

    async write(data) {
        if (!this.initialized) {
            await this.initializationPromise;
        }
        if (this.client.readyState !== this.client.OPEN) {
            console.error("uml-user-service connection is closed");
            return;
        }
        this.client.send(JSON.stringify(data));
    }

    async deleteElement(el) {
        if (!this.initialized) {
            await this.initializationPromise;
        }
        if (this.client.readyState !== this.client.OPEN) {
            console.error("uml-user-service connection is closed");
            return;
        }
        await el.deleteData();
        delete this.graph[el.id];
        this.client.send(JSON.stringify({
            DELETE: el.id
        }));
    }

    async close() {
        if (!this.initialized) {
            await this.initializationPromise;
        }
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

    async load(umlData) {
        if (!this.initialized) {
            await this.initializationPromise;
        }
        this.client.send(JSON.stringify({
            load : yaml.load(umlData)
        }));
    }

    // TODO change to events
    async dump() {
        if (!this.initialized) {
            await this.initializationPromise;
        }
        let ret = new Promise(res => {
            this.client.onmessage = function(msg) {
                // just return raw string from server
                res(msg.data.slice(0, msg.data.length - 1)); // bad character at end, look into source
            }
        });
        this.client.send(JSON.stringify({
            dump: '.'
        }));
        return ret;
    }

    save() {
        this.client.send(JSON.stringify({
            save: '.'
        }));
    }

    async reserve() {
        if (!this.initialized) {
            await this.initializationPromise;
        }
        this.client.send(JSON.stringify({
            reserve: 'myUniqueIdentifier: ' + this.server
        }));
    }

    select(el) {
        this.client.send(JSON.stringify({
            select: el.id
        }));
    }

    deselect(el) {
        this.client.send(JSON.stringify({
            deselect: el.id
        }));
    }

    signUp(user, password) {
        return new Promise(async (res, rej) => {
            this.client.send(JSON.stringify({
                signUp: {
                    user: user,
                    passwordHash: Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password)))).map(b => b.toString(16).padStart(2, '0')).join('')
                }
            }));
            this.client.onmessage = (msg) => {
                if (msg.data === 'success') {
                    this.client.close();
                    this.login(user, password, this.options);
                    res();
                } else {
                    rej(new Error('could not register new user!'))
                }
            };
        });
    }

    login(user, password, options) {
        let me = this;
        if (this.initialized) {
            this.client.close();
            this.initialized = false;
        }
        this.initializationPromise = new Promise((res, rej) => {
            const address = options && options.address ? options.address : this.options && this.options.address ? this.options.address : 'ws://localhost:1672';
            this.client = new WebSocket(address, '');
            this.id = randomID();
            this.server = options && options.server ? options.server : this.options && this.options.server ? this.options.server : undefined;
            if (this.server === undefined) {
                throw Error('Must specify a server to connect to. If you don\'t have one create one by supplying a server name with the option server: servername');
            }
            this.user = user === '0' ? this.options.user : user;
            const openConnection = async () => {
                let passwordHash = undefined;
                if (password && password !== '') {
                    passwordHash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password)))).map(b => b.toString(16).padStart(2, '0')).join('');
                }
                let optionsUser = user;
                let optionsPasswordHash = passwordHash;
                let optionsServer = me.server;
                if (!optionsUser && me.options) {
                    optionsUser = me.options.user;
                }
                if (optionsPasswordHash === undefined && me.options) {
                    optionsPasswordHash = me.options.passwordHash;
                }
                if (options !== undefined) {
                    me.options = options;
                } else {
                    me.options = {};
                }
                me.options.user = optionsUser;
                me.user = optionsUser;
                if (optionsPasswordHash) {
                    me.options.passwordHash = optionsPasswordHash;
                }
                me.options.server = optionsServer;
                me.options.address = address;
                me.client.send(JSON.stringify({
                    id: me.id,
                    create: me.options.create ? true : false,
                    server: me.server,
                    user: !me.options.user ? '0' : me.options.user,
                    passwordHash: me.options.passwordHash ? me.options.passwordHash : ''
                }));
                me.client.onmessage = function(msg) {
                    const msgObj = JSON.parse(msg.data);
                    if (msgObj.client === me.id) {
                        me.initialized = true;
                        me.readonly = !msgObj.edit;
                        for (const otherClientId of msgObj.otherClients) {
                            me.otherClients.set(otherClientId, new ClientInfo());
                        }

                        // send heartbeat so client doesn't disconnect
                        me.heartBeatMessages = setInterval(() => {
                            me.client.send(JSON.stringify({heartbeat: me.id}));
                        }, 180000);

                        // handle update from server
                        me.client.onmessage = me.handleMessage.bind(me);
                        // resolve promise
                        res('fulfilled');
                    } else {
                        rej(msg.data);
                    }
                };
            };

            if (this.client.readyState == WebSocket.OPEN) {
                openConnection();
            } else {
                this.client.onopen = function() {
                    openConnection();
                };
            }
            this.client.onerror = function(e) {
                console.error("error communicating to uml-user-services, " + e.name + e.message);
		        clearInterval(me.heartBeatMessages );
                rej('client encountered error starting up ${e.name}: ${e.message}');
            };
            this.client.onclose = function(e) {
                console.error("connection to uml-user-service closed");
		        clearInterval(me.heartBeatMessages);
                rej("server connection not established code: " + e.code + ", reason: " + e.reason);
            };
        });
        this.client.onclose = function() {
            if (me.heartBeatMessages !== undefined) {
                clearInterval(me.heartBeatMessages);
            }
            console.error("connection to uml-user-service closed");
        }
        this.client.onerror = function() {
	        clearInterval(me.heartBeatMessages);	
            console.error("error communicating to uml-user-services");
        };
        this.eventEmitter.on('newRequest', async (request) => {
            if (!this.initialized) {
                await this.initializationPromise;
            }
            if (this.client.readyState !== this.client.OPEN) {
                console.error('connection closed');
                return;
            }
            while (!this.promiseFulfilled) {
                await this.nextMessagePromise;
            }
            this.promiseFulfilled = false;
            this.nextMessagePromise = new Promise(async resolveNextMessage => {
                const requestPromise = new Promise((res) => {
                    if (request.type === 'GET') {
                        this.client.onmessage = (msg) => {
                            const msgData = JSON.parse(msg.data);
                            if (msgData.put || msgData.PUT) {
                                this.handleMessage(msg);
                                return;
                            }
                            this.client.onmessage = this.handleMessage.bind(this);
                            let elFromServer = parse(JSON.parse(msg.data));
                            if (elFromServer === undefined) {
                                this.eventEmitter.emit('ERROR:' + request.id);
                            } else {
                                this.graph[elFromServer.id] = elFromServer;
                                if (request.id === '') {
                                    this.#head = elFromServer;
                                }
                                elFromServer.manager = this;
                                this.eventEmitter.emit('GET:' + request.id);
                            }
                            res();
                        };
                    } else {
                        res('');
                    }
                });
                this.client.send(request.data);
                await requestPromise;
                resolveNextMessage();
                this.promiseFulfilled = true;
            });
        });
        return this.initializationPromise;
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
        return new Promise(async (res, rej) => {
            // TODO check that the object matches field
            this.client.send(JSON.stringify(projectConfig));
            this.client.onmessage = (msg) => {
                this.client.onmessage = this.handleMessage;
                const response = JSON.parse(msg.data);
                if (response.success == 0) {
                    res();
                } else {
                    rej(response);
                }
            }
        });
    }

    getProjectConfig() {
        return new Promise(async (res, rej) => {
            this.client.send(JSON.stringify({
                getConfig: this.server
            }));
            this.client.onmessage = (msg) => {
                this.client.onmessage = this.handleMessage;
                const response = JSON.parse(msg.data);
                if (response.project) {
                    res(response);
                } else {
                    rej(response);
                }
            }
        });
    }

    handleMessage(message) {
        let data = JSON.parse(message.data);
        if (data['put'] || data['PUT']) {
            const putData = data['put'] ? data.put : data.PUT;
            const elData = putData.element;
            const elID = putData.id;
            const oldElement = this.graph[elID];
            let elFromServer = parse(elData);
            this.graph[elFromServer.id] = elFromServer;
            elFromServer.manager = this;

            // references
            if (oldElement) {
                oldElement.references.forEach((referenceEl, referenceID) => {
                    if (!referenceEl) {
                        console.warn('undefined reference being restored');
                        return;
                    }
                    // TODO check if referenceEl is undefined, could be case maybe in future?
                    for (let setEntry of Object.entries(referenceEl.sets)) {
                        if (setEntry[1].contains(elID)) {
                            setEntry[1].data.find((setReference) => setReference.id === elID).el = elFromServer;
                        }
                    }
                    referenceEl.references.set(elID, elFromServer);
                    elFromServer.references.set(referenceID, referenceEl);
                });
            }
            
            this.onUpdate(elFromServer, oldElement);
        } else if (data['delete'] || data['DELETE']) {
            const deleteData = data['delete'] ? data['delete'] : data.DELETE;
            const oldElement = this.graph[deleteData];
            if (oldElement) {
                delete this.graph[deleteData];
                this.onUpdate(undefined, oldElement);
                oldElement.deleteData(); // async
            }
        } else if (data['client']) {
            const clientID = data['client'];
            this.otherClients.set(clientID, new ClientInfo());
            this.onClient(clientID)
        } else if (data['disconnect']) {
            // other client left, remove from tracking
            this.otherClients.delete(data.disconnect);
        } else if (data['select']) {
            const selectData = data['select'];
            this.otherClients.get(selectData['client']).selectedElements.add(selectData['id']);
            this.onSelect(selectData.client, selectData.id)
        } else if (data['deselect']) {
            const deselectData = data['deselect'];
            this.otherClients.get(deselectData['client']).selectedElements.delete(deselectData['id']);
            this.onDeselect(deselectData.client, deselectData.id);
        }
    }
}
