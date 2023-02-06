var WebSocket = require('websocket').w3cwebsocket;
import parse from './parse.js';
import {randomID} from './element.js'

export default class UmlWebClient {
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
        if (options['id']) {
            id = options['id'];
        }
        this.client.send(JSON.stringify({
            post: type.toUpperCase(),
            id: id
        }));
        let ret = {};
        ret[type.toLowerCase()] = {
            id: id
        }
        return Promise.resolve(parse(ret));
    }

    async get(id) {
        await this.initializationPromise;
        if (this.client.readyState !== this.client.OPEN) {
            console.error("uml-user-service connection is closed");
            return Promise.reject({});
        }
        let ret = new Promise(res => {
            this.client.onmessage = function(msg) {
                res(parse(JSON.parse(msg.data)));
            }
        });
        this.client.send(JSON.stringify({
            get: id
        }));
        return ret;
    }

    async head() {
        await this.initializationPromise;
        if (this.client.readyState !== this.client.OPEN) {
            console.error("uml-user-service connection is closed");
            return Promise.reject({});
        }
        let ret = new Promise(res => {
            this.client.onmessage = function(msg) {
                res(parse(JSON.parse(msg.data)));
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
                element: el.emit(),
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

    async close() {
        await this.initializationPromise;
        this.client.close();
    }
}