import assert from 'assert';
import UmlManager from '../lib/manager';
import parse from '../lib/parse';

describe('Association Tests', () => {
    describe('parse association tests', () => {
        it('parseExtensionTest', async () => {
            const manager = new UmlManager();
            const data = {
                Extension: {
                    id: '3zEOSFAHbYoHtgDM7WQN5nsJkIbP',
                    metaClass: 'class'
                }
            }
            const extension = await manager.parse(data);
            assert.equal(extension.id, '3zEOSFAHbYoHtgDM7WQN5nsJkIbP');
            assert.equal(extension.metaClass, 'class');
        });
        it('deleteAssociationTest', async () => {
            const manager = new UmlManager();
            const association = manager.create('Association');
            const memberEnd = manager.create('Property');
            const ownedEnd = manager.create('Property');
            const association2 = manager.create('Association');
            const navigableOwnedEnd = manager.create('Property');
            await manager.delete(association);
            assert.equal(memberEnd.association.has(), false);
            assert.equal(ownedEnd.owningAssociation.has(), false);

            await association2.memberEnds.add(memberEnd);
            await association2.navigableOwnedEnds.add(navigableOwnedEnd);
            await manager.delete(association2);
            assert.equal(memberEnd.association.has(), false);
            assert.equal(navigableOwnedEnd.owningAssociation.has(), false);
        });
    });
});
