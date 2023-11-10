import assert from 'assert';
import UmlManager from '../lib/manager';
import parse from '../lib/parse';

describe('PackageTests', () => {
    describe('parsingTests', () => {
        it('parsePackageTest', async () => {
            const data = {
                owningPackage: 't4ZBDDjRiqoD&sVyDe7Q0isJ8aYm',
                package: {
                    id: 'gLIIofvw6P3saxFtrk3z2KkEHzBR',
                    name: 'blahaj',
                    packagedElements: [
                        '3KIU4oA0taLKU7ilMjGhTgZ&Zk4A',
                        'VHBQT06I7yXBTabcFapea4_h4Y66'
                    ]
                }
            }
            const manager = new UmlManager();
            const packageEl = parse(data);
            manager.add(packageEl);
            assert.equal(packageEl.id, 'gLIIofvw6P3saxFtrk3z2KkEHzBR')
            assert.equal(packageEl.name, 'blahaj');
            for (let id of packageEl.packagedElements.ids()) {
                assert.ok(id === '3KIU4oA0taLKU7ilMjGhTgZ&Zk4A' || id === 'VHBQT06I7yXBTabcFapea4_h4Y66');
            }
            const owningPackageData = {
                package: {
                    id: 't4ZBDDjRiqoD&sVyDe7Q0isJ8aYm',
                    packagedElements: [
                        'gLIIofvw6P3saxFtrk3z2KkEHzBR'
                    ]
                }
            }
            const owningPackage = parse(owningPackageData);
            manager.add(owningPackage);
            const owningPackageFromPackage = await packageEl.owningPackage.get();
            assert.ok(owningPackageFromPackage !== null && owningPackageFromPackage !== undefined);
            assert.equal(owningPackage.id, owningPackageFromPackage.id);
        });
    });
    describe('emittingTests', () => {
        it('emitPackageTest', () => {
            const manager = new UmlManager();
            const packageEl = manager.create('package');
            const child1 = manager.create('package');
            const child2 = manager.create('package');
            const owningPackage = manager.create('package');
            packageEl.packagedElements.add(child1);
            packageEl.packagedElements.add(child2);
            packageEl.owningPackage.set(owningPackage);
            packageEl.name = 'blahaj';
            const emit = packageEl.emit();
            assert.equal(JSON.stringify(emit), JSON.stringify({
                package: {
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
