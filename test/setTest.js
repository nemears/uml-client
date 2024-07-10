import UmlManager from "../lib/manager";
import assert from 'assert';

describe('SetTest', () => {
    describe('AsynchronousIterate', () => {
        it('iterate through array', async () => {
            const manager = new UmlManager();
            let pckg = manager.create('Package');
            let class1 = manager.create('Class');
            let class2 = manager.create('Class');
            let class3 = manager.create('Class');
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
        it('iterate through multi set array', async () => {
            const manager = new UmlManager();
            const assoc = manager.create('Association');
            const ownedEnd = manager.create('Property');
            const memberEnd = manager.create('Property');
            ownedEnd.name = 'ownedEnd';
            memberEnd.name = 'memberEnd';
            await assoc.ownedEnds.add(ownedEnd);
            await assoc.memberEnds.add(memberEnd);
            const endsToVisit = new Set([memberEnd, ownedEnd]);
            for await (const end of assoc.memberEnds) {
                assert.ok(assoc.memberEnds.contains(end));
                assert.ok(endsToVisit.has(end));
                endsToVisit.delete(end);
                console.log(end.name);
            }
            assert.equal(endsToVisit.size, 0);
        });
    })
    describe('Ids iterate', () => {
        it('iterate through ids', () => {
            const manager = new UmlManager();
            let pckg = manager.create('Package');
            let class1 = manager.create('Class');
            let class2 = manager.create('Class');
            let class3 = manager.create('Class');
            pckg.packagedElements.add(class1);
            pckg.packagedElements.add(class2);
            pckg.packagedElements.add(class3);
            let i = 0;
            for (let id of pckg.packagedElements.ids()) {
                switch (i) {
                    case 0: assert.equal(id, class1.id); break;
                    case 1: assert.equal(id, class2.id); break;
                    case 3: assert.equal(id, class3.id); break;
                }
                i++;
            }
        });
//        it('redefineTest' , async () => {
//            const manager = new UmlManager();
//            const el = {
//                sets : {},
//                manager: manager
//            };
//            el.setA = new Set();
//            el.setB = new Set();
//            console.log(el.setB);
//            el.setB.redefines(el.setA);
//            const pkg = manager.create('package');
//            el.setA.add(pkg);
//            assert(el.setB.contains(pkg));
//        });
    });
    describe('singletonTests', () => {
        it('oppositeOverride', async () => {
            const manager = new UmlManager();
            let pckg1 = manager.create('Package');
            let pckg2 = manager.create('Package');
            let clazz = manager.create('Class');
            await pckg1.packagedElements.add(clazz);
            assert(pckg1.packagedElements.contains(clazz));
            assert.equal(pckg1.packagedElements.size(), 1);
            assert.equal(clazz.owningPackage.id(), pckg1.id);
            assert.equal(pckg2.packagedElements.size(), 0);
            await pckg2.packagedElements.add(clazz);
            assert(pckg2.packagedElements.contains(clazz));
            assert.equal(pckg2.packagedElements.size(), 1);
            assert.equal(clazz.owningPackage.id(), pckg2.id);
            assert.equal(pckg1.packagedElements.size(), 0);
        });
    });
});
