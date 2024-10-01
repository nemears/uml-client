import assert from 'assert';
import UmlManager from '../lib/manager';

describe('PackageTests', () => {
    it('basic stereotype profile test', async () => {
        const manager = new UmlManager();
        const stereotype = manager.create('Stereotype');
        const profile = manager.create('Profile');
        const pkg = manager.create('Package');
        stereotype.name = 'Stereotype';
        profile.name = 'Profile';
        pkg.name = 'Package';
        await profile.ownedStereotypes.add(stereotype);
        assert.equal(stereotype.profile.id(), profile.id);
        assert.equal(stereotype.owningPackage.id(), profile.id);
        assert.equal(stereotype.namespace.id(), profile.id);
        assert.equal(stereotype.owner.id(), profile.id);
        assert.ok(profile.ownedStereotypes.contains(stereotype));
        assert.ok(profile.packagedElements.contains(stereotype));
        assert.ok(profile.ownedMembers.contains(stereotype));
        assert.ok(profile.members.contains(stereotype));
        assert.ok(profile.ownedElements.contains(stereotype));
        await profile.ownedStereotypes.remove(stereotype);
        await profile.packagedElements.add(pkg);
        await pkg.ownedStereotypes.add(stereotype);
        assert.equal(stereotype.profile.id(), profile.id);
        await pkg.ownedStereotypes.remove(stereotype);
        assert.ok(!stereotype.profile.has());
        
        // TODO more complex testing of policies
    });
    describe('parsingTests', () => {
        it('parsePackageTest', async () => {
            const data = {
                owningPackage: 't4ZBDDjRiqoD&sVyDe7Q0isJ8aYm',
                Package: {
                    id: 'gLIIofvw6P3saxFtrk3z2KkEHzBR',
                    name: 'blahaj',
                    packagedElements: [
                        '3KIU4oA0taLKU7ilMjGhTgZ&Zk4A',
                        'VHBQT06I7yXBTabcFapea4_h4Y66'
                    ]
                }
            }
            const manager = new UmlManager();
            const packageEl = await manager.parse(data);
            assert.equal(packageEl.id, 'gLIIofvw6P3saxFtrk3z2KkEHzBR')
            assert.equal(packageEl.name, 'blahaj');
            for (let id of packageEl.packagedElements.ids()) {
                assert.ok(id === '3KIU4oA0taLKU7ilMjGhTgZ&Zk4A' || id === 'VHBQT06I7yXBTabcFapea4_h4Y66');
            }
            const owningPackageData = {
                Package: {
                    id: 't4ZBDDjRiqoD&sVyDe7Q0isJ8aYm',
                    packagedElements: [
                        'gLIIofvw6P3saxFtrk3z2KkEHzBR'
                    ]
                }
            }
            const owningPackage = await manager.parse(owningPackageData);
            const owningPackageFromPackage = await packageEl.owningPackage.get();
            assert.ok(owningPackageFromPackage !== null && owningPackageFromPackage !== undefined);
            assert.equal(owningPackage.id, owningPackageFromPackage.id);
        });
    });
    describe('emittingTests', () => {
        it('emitPackageTest', () => {
            const manager = new UmlManager();
            const packageEl = manager.create('Package');
            const child1 = manager.create('Package');
            const child2 = manager.create('Package');
            const owningPackage = manager.create('Package');
            packageEl.packagedElements.add(child1);
            packageEl.packagedElements.add(child2);
            packageEl.owningPackage.set(owningPackage);
            packageEl.name = 'blahaj';
            const emit = packageEl.emit();
            assert.equal(JSON.stringify(emit), JSON.stringify({
                Package: {
                    id: packageEl.id,
                    name: 'blahaj',
                    packagedElements: [
                        child1.id,
                        child2.id
                    ]
                },
                owningPackage: owningPackage.id
            }));
        });
    });
});
