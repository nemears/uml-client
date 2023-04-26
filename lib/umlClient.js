var WebSocket = require('websocket').w3cwebsocket;
import parse from './parse.js';
import {randomID} from './element.js';
import { server } from 'websocket';
const EventEmitter = require('events');
const yaml = require('js-yaml');

export default class UmlWebClient {

    graph = {};
    #head = undefined;
    eventEmitter = new EventEmitter();
    initialized = false;
    nextMessagePromise = Promise.resolve();
    promiseFulfilled = true;

    /**
     * 
     * @param {
     *   address : the address of the api endpoint you are connecting to
     *   server : required field for name of the server
     *   
     * } options, 
     */
    constructor(options) {
        this.initializationPromise = new Promise((res, rej) => {
            const address = options.address ? options.address : 'wss://openuml.com/api/';
            this.client = new WebSocket(address, '');
            this.id = randomID();
            this.server = options.server;
            if (this.server === undefined) {
                throw Error('Must specify a server to connect to. If you don\'t have one create one by supplying a server name with the option server: servername');
            }
            let me = this;
            this.client.onerror = function(e) {
                console.error("error communicating to uml-user-services, " + e.name + e.message);
                rej('client encountered error starting up ${e.name}: ${e.message}');
            };
            this.client.onopen = function() {
                // console.log('client ' + me.id + ' opened connection with websocket server');
                me.client.send(JSON.stringify({
                    id: me.id,
                    persistent: false,
                    server: me.server,
                }));
                me.client.onmessage = function(msg) {
                    if (msg.data === me.id) {
                        me.initialized = true;
                        // console.log("client " + me.id + " opened connection to uml-user-service");
                        res('fulfilled');
                    } else {
                        rej('wrong id');
                    }
                };
            };
            this.client.onclose = function(e) {
                console.error("connection to uml-user-service closed");
                rej("server connection not established code: " + e.code + ", reason: " + e.reason);
            };
        });
        this.client.onclose = function() {
            console.error("connection to uml-user-service closed");
        }
        this.client.onerror = function() {
            console.error("error communicating to uml-user-services");
        };
        this.eventEmitter.on('newRequest', async (request) => {
            if (!this.initialized) {
                console.log('awaiting initialization for client ' + this.id);
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
                        // console.error('could not handle request type');
                        res('');
                    }
                });
                this.client.send(request.data);
                // console.log('sent message for client(' + this.id + '): ' + request.data);
                await requestPromise;
                resolveNextMessage();
                this.promiseFulfilled = true;
            });
        });
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

    async get(id) {
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
        // console.log('made put request');
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
        this.client.close();
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
    async save() {
        if (!this.initialized) {
            await this.initializationPromise;
        }
        let ret = new Promise(res => {
            this.client.onmessage = function(msg) {
                // just return raw string from server
                res(msg.data);
            }
        });
        this.client.send(JSON.stringify({
            save: '.'
        }));
        return ret;
    }
}