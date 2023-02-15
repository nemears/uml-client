var WebSocket = require('websocket').w3cwebsocket;
import parse from './parse.js';
import {randomID} from './element.js';
const yaml = require('js-yaml');

export default class UmlWebClient {

    graph = {};

    constructor() {
        this.initializationPromise = new Promise((res, rej) => {
            this.client = new WebSocket('ws://localhost:1672/', '');//'uml-websocket');
            this.id = randomID();
            let me = this;
            this.client.onerror = function(e) {
                console.error("error communicating to uml-user-services, " + e.name + e.message);
                // rej('client encountered error starting up ${e.name}: ${e.message}');
            };
            this.client.onopen = function() {
                
                me.client.send(JSON.stringify({
                    id: me.id,
                    server: "session-" + me.id // TODO have this be customizable
                }));
                me.client.onmessage = function(msg) {
                    if (msg.data === me.id) {
                        console.log("connection to uml-user-service opened");
                        res();
                    } else {
                        return;
                    }
                    me.client.onclose = function() {
                        console.log("connection to uml-user-service closed");
                    }
                    me.client.onerror = function() {
                        console.error("error communicating to uml-user-services");
                    };
                };
            };
            this.client.onclose = function(e) {
                console.log("connection to uml-user-service closed");
                rej("server connection not established code: " + e.code + ", reason: " + e.reason);
            };
        });
    }

    async post(type, options) {
        await this.initializationPromise;
        if (this.client.readyState !== this.client.OPEN) {
            console.error("uml-user-server connection is closed");
            return Promise.reject("uml-user-server connection is closed");
        }
        let id = randomID();
        if (options && options['id']) {
            id = options['id'];
        }
        this.client.send(JSON.stringify({
            post: type.toUpperCase(),
            id: id
        }));
        let json = {};
        json[type.toLowerCase()] = {
            id: id
        }
        let ret = parse(json);
        this.graph[id] = ret;
        ret.manager = this;
        return Promise.resolve(ret);
    }

    async get(id) {
        await this.initializationPromise;
        if (this.client.readyState !== this.client.OPEN) {
            console.error("uml-user-service connection is closed");
            return Promise.reject({});
        }
        let me = this;
        let ret = new Promise(res => {
            this.client.onmessage = function(msg) {
                let elFromServer = parse(JSON.parse(msg.data));
                if (elFromServer === undefined) {
                    res(undefined);
                } else {
                    me.graph[id] = elFromServer;
                    elFromServer.manager = me;
                    res(elFromServer);
                }
            }
        });
        this.client.send(JSON.stringify({
            get: id
        }));
        return ret;
    }

    getLocal(id) {
        return this.graph[id];
    }

    async head() {
        await this.initializationPromise;
        if (this.client.readyState !== this.client.OPEN) {
            console.error("uml-user-service connection is closed");
            return Promise.reject({});
        }
        let me = this;
        let ret = new Promise(res => {
            this.client.onmessage = function(msg) {
                let elFromServer = parse(JSON.parse(msg.data));
                me.graph[elFromServer.id] = elFromServer;
                elFromServer.manager = me;
                res(elFromServer);
            }
        });
        this.client.send(JSON.stringify({
            get: ""
        }));
        return ret;
    }

    async put(el) {
        await this.initializationPromise;
        if (this.client.readyState !== this.client.OPEN) {
            console.error("uml-user-service connection is closed");
            return;
        }
        this.client.send(JSON.stringify({
            put: {
                id: el.id,
                element: await el.emit(),
            }
        }));
    }

    async write(data) {
        await this.initializationPromise;
        if (this.client.readyState !== this.client.OPEN) {
            console.error("uml-user-service connection is closed");
            return;
        }
        this.client.send(JSON.stringify(data));
    }

    async deleteElement(el) {
        await this.initializationPromise;
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
        await this.initializationPromise;
        this.client.close();
    }

    async load(umlData) {
        await this.initializationPromise;
        this.client.send(JSON.stringify({
            load : yaml.load(umlData)
        }));
    }

    async save() {
        await this.initializationPromise;
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