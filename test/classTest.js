import assert from 'assert';
import UmlManager from '../lib/manager';
import parse from '../lib/parse';

describe('ClassTests', () => {
    describe('parsingTests', () => {
        it('basicParsingTest', async () => {
            const manager = new UmlManager();
            const data = {
                Class: {
                    id: 'T1J0hAryQORw9sMaNfgUwVDor7eS',
                    name: 'blahaj',
                    generalizations: [
                        'l3mdRJ0ChhLsbOXcs1XT3M5IwYKh'
                    ],
                    ownedAttributes: [
                        'RI5EBAFWoJncjrIkOhB_T1NIGM_R'
                    ]
                }
            }
            const propertyData = {
                class: 'T1J0hAryQORw9sMaNfgUwVDor7eS',
                Property: {
                    id: 'RI5EBAFWoJncjrIkOhB_T1NIGM_R',
                    name: 'tooth'
                }
            }
            const generalizationData = {
                specific: 'T1J0hAryQORw9sMaNfgUwVDor7eS',
                Generalization: {
                    id: 'l3mdRJ0ChhLsbOXcs1XT3M5IwYKh',
                    general: '95leUBpMz&jCviAoogr70m2Q7oV7'
                }
            }
            const clazz = await parse(data);
            manager.add(clazz);
            assert.equal(clazz.id, 'T1J0hAryQORw9sMaNfgUwVDor7eS');
            assert.equal(clazz.name, 'blahaj');
            for (let id of clazz.ownedAttributes.ids()) {
                assert.equal(id, 'RI5EBAFWoJncjrIkOhB_T1NIGM_R');
            }
            for (let id of clazz.generalizations.ids()) {
                assert.equal(id, 'l3mdRJ0ChhLsbOXcs1XT3M5IwYKh')
            }
            const property = await parse(propertyData);
            manager.add(property);
            assert.equal(property.id, 'RI5EBAFWoJncjrIkOhB_T1NIGM_R');
            assert.equal(property.name, 'tooth');
            const propertyClazz = await property.clazz.get();
            assert.equal(propertyClazz.id, clazz.id);
            const generalization = await parse(generalizationData);
            manager.add(generalization);
            assert.equal(generalization.id, 'l3mdRJ0ChhLsbOXcs1XT3M5IwYKh');
            const generalizationSpecific = await generalization.specific.get();
            assert.equal(generalizationSpecific.id, clazz.id);
        });
    });
    describe('emitting tests', () => {
        it('emitClassTest', () => {
            const manager = new UmlManager();
            const clazz = manager.create('Class');
            const property = manager.create('Property');
            const owningPackage = manager.create('Package');
            const generalization = manager.create('Generalization');
            const general = manager.create('Class');
            clazz.name = 'blahaj';
            clazz.ownedAttributes.add(property);
            clazz.owningPackage.set(owningPackage);
            clazz.generalizations.add(generalization);
            generalization.general.set(general);
            property.type.set(general);
            const clazzEmit = clazz.emit();
            assert.equal(JSON.stringify(clazzEmit), JSON.stringify({
                Class: {
                    id: clazz.id,
                    name: 'blahaj',
                    generalizations: [
                        generalization.id
                    ],
                    ownedAttributes: [
                        property.id
                    ]
                },
                owningPackage: owningPackage.id
            }));
            const propertyEmit = property.emit();
            assert.equal(JSON.stringify(propertyEmit), JSON.stringify({
                Property: {
                    id: property.id,
                    type: general.id
                },
                class: clazz.id
            }));
            const packageEmit = owningPackage.emit();
            assert.equal(JSON.stringify(packageEmit), JSON.stringify({
                Package: {
                    id: owningPackage.id,
                    packagedElements: [
                        clazz.id
                    ]
                }
            }));
            const generalizationEmit = generalization.emit();
            assert.equal(JSON.stringify(generalizationEmit), JSON.stringify({
                Generalization: {
                    id: generalization.id,
                    general: general.id
                },
                specific: clazz.id
            }));
        });
    });
    describe('basic tests', () => {
        it('add ownedAttribute test', async () => {
            const manager = new UmlManager();
            const clazz = manager.create('Class');
            const property = manager.create('Property');
            await clazz.ownedAttributes.add(property);
            assert.ok(clazz.ownedAttributes.contains(property));
            assert.equal(clazz.ownedAttributes.size(), 1);
            assert.ok(clazz.attributes.contains(property));
            assert.equal(clazz.attributes.size(), 1);
            assert.ok(clazz.features.contains(property));
            assert.equal(clazz.features.size(), 1);
            assert.ok(clazz.ownedMembers.contains(property));
            assert.equal(clazz.ownedMembers.size(), 1);
            assert.ok(clazz.members.contains(property));
            assert.equal(clazz.members.size(), 1);
            assert.ok(clazz.ownedElements.contains(property));
            assert.equal(clazz.ownedElements.size(), 1);
        });
    })
});
