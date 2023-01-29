var WebSocket = require('websocket').w3cwebsocket;

export default class UmlWebClient {
    constructor() {
        this.initializationPromise = new Promise(res => {
            this.client = new WebSocket('ws://localhost:1672/', '');//'uml-websocket');
            this.id = randomID();
            let me = this;
            this.client.onerror = function() {
                console.error("error communicating to uml-user-services");
                return;
            };
            this.client.onopen = function() {
                
                me.client.send(JSON.stringify({
                    id: me.id,
                    server: "session-" + me.id // TODO have this be customizable
                }));
                me.client.onmessage = function(msg) {
                    if (msg.data === me.id) {
                        console.log("connection to uml-user-service opened");
                    } else {
                        return;
                    }
                    res();
                };
            };
            this.client.onclose = function() {
                console.log("connection to uml-user-service closed");
            };
        });
    }

    randomID() {
        var ret  =  "";
        const base64chars = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
                            ,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
                            ,'0','1','2','3','4','5','6','7','8','9','_','&'];
        for (let i = 0; i < 28; i++) {
            ret += base64chars[Math.floor(Math.random() * 64)];
        }
        return ret;
    }

    async get(id) {
        await this.initializationPromise;
        if (this.client.readyState !== this.client.OPEN) {
            console.error("uml-user-service connection is closed");
            return Promise.resolve({});
        }
        let ret = new Promise(res => {
            this.client.onmessage = function(msg) {
                // TODO check format
                res(JSON.parse(msg.data));
            };
        });
        this.client.send(JSON.stringify({
            get: id
        }));
        return ret;
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