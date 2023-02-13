import UmlManager from "../lib/manager";
import assert from 'assert';

describe('SetTest', () => {
    describe('AsynchronousIterate', () => {
        it('iterate through array', async () => {
            const manager = new UmlManager();
            let pckg = manager.create('package');
            let class1 = manager.create('class');
            let class2 = manager.create('class');
            let class3 = manager.create('class');
            pckg.packagedElements.add(class1);
            pckg.packagedElements.add(class2);
            pckg.packagedElements.add(class3);
            let i = 0;
            for await (let el of pckg.packagedElements) {
                switch (i) {
                    case 0: assert.equal(el.id, class1.id); break;
                    case 1: assert.equal(el.id, class2.id); break;
                    case 3: assert.equal(el.id, class3.id); break;
                }
                i++;
            }
        });
    })
});