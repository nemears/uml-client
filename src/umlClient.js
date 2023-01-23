import { Socket } from "net";
import { TextEncoder } from "util";

class UmlClient {
    client = new Socket();
    idPromise;

    constructor() {
        this.client.setEncoding('utf-8');
        const myID = randomID() + '\0';
        this.idPromise = new Promise((res) => {
            this.client.on('data', (data) => {
                if (data.toString('utf-8') === 'id\0') {
                    this.client.write(myID);
                } else if (data.toString('utf-8').substring(0, 28) === myID.substring(0, 28)) {
                    res('');
                }
            });
        });
        this.client.on('error', (e) => {
            console.log(e.message);
        });
        this.client.connect(8652, '127.0.0.1');
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

    nullID() {
        return 'AAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    }

    sendMessage(msgString) {
        var msgBytes = [
            (msgString.length + 1 & 0xFF000000) >>> 24,
            (msgString.length + 1 & 0x00FF0000) >>> 16,
            (msgString.length + 1 & 0x0000FF00) >>> 8,
            (msgString.length + 1 & 0x000000FF)
        ];
        const enc = new TextEncoder();
        enc.encode(msgString).forEach((number) => {
            msgBytes.push(number);
        });
        msgBytes.push(0);
        const msg = new Uint8Array(msgBytes);
        this.client.write(msg);
    }

    async head() {
        await this.idPromise;
        const msgString = JSON.stringify({get: ""});
        this.sendMessage(msgString);
        return new Promise((res) => {    
            const handleData = (data) => {
                res(clientBufferToJSON(data));
                this.client.removeListener('data', handleData);
            };
            this.client.on('data', handleData);
        });
    }

    async get(id) {
        await this.idPromise;
        const msgString = JSON.stringify({get: id});
        this.sendMessage(msgString);
        return new Promise((res) => {    
            const handleData = (data) => {
                res(clientBufferToJSON(data));
                this.client.removeListener('data', handleData);
            };
            this.client.on('data', handleData);
        });
    }

    async write(data) {
        await this.idPromise;
        const msgString = JSON.stringify(data);
        this.sendMessage(msgString);
    }
}