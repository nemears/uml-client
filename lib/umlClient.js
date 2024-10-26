var WebSocket = require('websocket').w3cwebsocket;
import AbstractUmlClient from './abstractUmlClient.js';

class WebClientInterface {
    connect(name, protocol) {
        this.client = new WebSocket(name, protocol);
    }
    onOpen(f) {
        this.client.onopen = f;
    }
    onFirstMessage(f) {
        this.client.onmessage = (msg) => {
            f(msg.data);
        };
    }
    onMessage(f) {
        this.client.onmessage = (msg) => {
            f(msg.data);
        };
    }
    send(data) {
        this.client.send(data);
    }
    onError(f) {
        this.client.onerror = f;
    }
    onClose(f) {
        this.client.onclose = f;
    }
    isConnected() {
        this.client.readyState !== this.client.OPEN        
    }
    close() {
        this.client.close();
    }
}

export default class UmlWebClient extends AbstractUmlClient {

    constructor(options) {
        super(new WebClientInterface(), options);
    }
}
