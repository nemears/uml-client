var WebSocket = require('websocket').w3cwebsocket;
import parse from './parse.js';
import {randomID} from './element.js';
const EventEmitter = require('events');
const yaml = require('js-yaml');

export default class UmlWebClient {

    graph = {};
    #head = undefined;
    eventEmitter = new EventEmitter();
    initialized = false;

    constructor(serverName) {
        this.initializationPromise = new Promise((res, rej) => {
            this.client = new WebSocket('ws://localhost:1672/', '');//'uml-websocket');
            this.id = randomID();
            let me = this;
            this.client.onerror = function(e) {
                console.error("error communicating to uml-user-services, " + e.name + e.message);
                rej('client encountered error starting up ${e.name}: ${e.message}');
            };
            this.client.onopen = function() {
                console.log('client ' + me.id + ' opened connection with websocket server');
                me.client.send(JSON.stringify({
                    id: me.id,
                    server: serverName,
                    persistent: false,
                }));
                me.client.onmessage = function(msg) {
                    if (msg.data === me.id) {
                        me.initialized = true;
                        console.log("client " + me.id + " opened connection to uml-user-service");
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
            console.log('sent message for client(' + this.id + '): ' + request.data);
            await requestPromise;
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
        this.eventEmitter.emit('newRequest', {
            type: 'POST',
            data: JSON.stringify({
                post: type.toUpperCase(),
                id: id
            })
        });
        let json = {};
        json[type.toLowerCase()] = {
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
            this.eventEmitter.once('GET:' + id, () => {
                res(this.graph[id]);
            });
            this.eventEmitter.once('ERROR:' + id, () => {
                console.error('could not get element of id ' + id + ' from server');
                res(undefined);
            });
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
            this.eventEmitter.once('GET:', () => {
                res(this.#head);
            });
            this.eventEmitter.once('ERROR:', () => {
                console.error('could not get head from server');
                res(undefined);
            });
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
        console.log('made put request');
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