import UmlWebClient from "../lib/umlClient";
import { randomID } from '../lib/types/element';
import assert from 'assert';

let serverAddress = 'wss://uml.cafe/api/';
let sessionName = randomID();

describe('UmlClient2Test', () => {
    it('putTest', async () => {
        const client1 = new UmlWebClient({
            address: serverAddress,
            project: sessionName,
        });
        const client2 = new UmlWebClient({
            address: serverAddress,
            project: sessionName,
        });
        
        await Promise.allSettled([client1.initialization, client2.initialization]);
        
        const numElements = 100;
        const elQueue = [];
        for (let i = 0; i < numElements; i++) {
            elQueue.push(client1.post('package'));
        }

        for (let i = 0; i < numElements; i++) {
            client1.put(elQueue[i]);
        }

        // test queue conditions
        let count = 0;
        const endingPromise = new Promise( (res) => {
            client2.onUpdate = (newElement) => {
                assert.equal(newElement.id, elQueue.shift().id);
                count++;
                if (count === numElements) {
                    res()
                }
            }
        });
        await endingPromise;
        client1.close();
        client2.close();
    });

    it('putTest2', async () => {
        const client1 = new UmlWebClient({
            address: serverAddress,
            project: sessionName,
        });
        const client2 = new UmlWebClient({
            address: serverAddress,
            project: sessionName,
        });
        
        await Promise.allSettled([client1.initialization, client2.initialization]);

        const createClasses = async (owner) => {
            for (let i = 0; i < 4; i++) {
                const clazz = client1.post('class');
                elQueue.push(clazz);
                clazz.owningPackage.set(owner);
                client1.put(clazz);
                await client1.head();
            }
        };
        
        const numElements = 4;
        const elQueue = [];

        const createEls = async () => {
            for (let i = 0; i < numElements; i++) {
                const pkg = client1.post('package');
                await createClasses(pkg);
                elQueue.push(pkg);
                client1.put(pkg);
            }
        };

        // test queue conditions
        let count = 0;
        const endingPromise = new Promise( (res) => {
            client2.onUpdate = (newElement) => {
                // console.log('testing ' + newElement.id + ' should be equal to ' + elQueue[0].id);
                assert.equal(newElement.id, elQueue.shift().id);
                count++;
                if (count === 4 * numElements) {
                    res()
                }
            }
        });
        await Promise.allSettled([endingPromise, createEls()]);
        client1.close();
        client2.close();
    });
});
