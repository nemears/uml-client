import websocketPackage from 'websocket';
const { client } = websocketPackage;
import AbstractUmlClient from './abstractUmlClient.js';

class NodeClientInterface {
    constructor() {
        this.client = new client();
    }
    connect(name, protocols) {
        this.client.connect(name, protocols);
    }
    onOpen(f) {
        this.open = true;
        const me = this;
        this.client.on('connect', (connection) => {
            me.connection = connection;
            f();
        });
    }
    onFirstMessage(f) {
        this.connection.on('message', (msg) => {
            f(msg.utf8Data);
        });
    }
    onMessage(f) {
        this.connection.on('message', (msg) => {
            f(msg.utf8Data);
        });
    }
    send(data) {
        this.connection.sendUTF(data);
    }
    onError(f) {
        this.connection.on('error', (error) => {
            f(error.toString());
        });
    }
    onClose(f) {
        this.connection.on('close', f);
    }
    isConnected() {
        return this.open;
    }
    close() {
        this.connection.close();
    }
}

export default class UmlNodeClient extends AbstractUmlClient {
    constructor(options) {
        super(new NodeClientInterface(), options);
    }
}
