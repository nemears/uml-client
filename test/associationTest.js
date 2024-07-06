import assert from 'assert';
import UmlManager from '../lib/manager';
import parse from '../lib/parse';

describe('Association Tests', () => {
    describe('parse association tests', () => {
        it('parseExtensionTest', () => {
            const manager = new UmlManager();
            const data = {
                extension: {
                    id: '3zEOSFAHbYoHtgDM7WQN5nsJkIbP',
                    metaClass: 'class'
                }
            }
            const extension = parse(data);
            manager.add(extension);
            assert.equal(extension.id, '3zEOSFAHbYoHtgDM7WQN5nsJkIbP');
            assert.equal(extension.metaClass, 'class');
        });
        it('deleteAssociationTest', async () => {
            const manager = new UmlManager();
            const association = manager.create('association');
            const memberEnd = manager.create('property');
            const ownedEnd = manager.create('property');
            const association2 = manager.create('association');
            const navigableOwnedEnd = manager.create('property');

            await association.memberEnds.add(memberEnd);
            await association.ownedEnds.add(ownedEnd);
            await manager.deleteElement(association);
            assert.equal(memberEnd.association.has(), false);
            assert.equal(ownedEnd.owningAssociation.has(), false);

            association2.memberEnds.add(memberEnd);
            association2.navigableOwnedEnds.add(navigableOwnedEnd);
            await manager.deleteElement(association2);
            assert.equal(memberEnd.association.has(), false);
            assert.equal(navigableOwnedEnd.owningAssociation.has(), false);
        });
    });
});
