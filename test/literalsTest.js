import assert from 'assert';
import UmlManager from "../lib/manager";
import parse from "../lib/parse";

describe('Literals test', () => {
    describe('Parsing tests', () => {
        it('parseLiteralIntTest', async () => {
            const manager = new UmlManager();
            const literalIntData = {
                owningPackage: 'KtGdtwTqJxkvydq04BBYm2UHTxSx',
                LiteralInt: {
                    id: 'yjo4P9202s2J4Sy8xqq4CrYqkqMt',
                    name: 'little int',
                    value: 1
                }
            };
            const literalInt = await manager.parse(literalIntData);
            assert.equal(literalInt.id, 'yjo4P9202s2J4Sy8xqq4CrYqkqMt');
            assert.equal(literalInt.name, 'little int');
            assert.equal(literalInt.value, 1);
            assert.equal(literalInt.owningPackage.id(), 'KtGdtwTqJxkvydq04BBYm2UHTxSx');
        });
        it('parseLiteralStringTest', async () => {
            const manager = new UmlManager();
            const literalStringData = {
                owningPackage: 'KtGdtwTqJxkvydq04BBYm2UHTxSx',
                LiteralString: {
                    id: 'yjo4P9202s2J4Sy8xqq4CrYqkqMt',
                    name: 'little int',
                    value: 1
                }
            };
            const literalString = await manager.parse(literalStringData);
            assert.equal(literalString.id, 'yjo4P9202s2J4Sy8xqq4CrYqkqMt');
            assert.equal(literalString.name, 'little int');
            assert.equal(literalString.value, 1);
            assert.equal(literalString.owningPackage.id(), 'KtGdtwTqJxkvydq04BBYm2UHTxSx');
        });
    });
    describe('emiting tests', () => {
        it('emit literal ints and multiplicity', async () => {
            const manager = new UmlManager();
            const pckg = manager.create('Package');
            const literalString = manager.create('LiteralString');
            const literalInt = manager.create('LiteralInt');
            const literalIntUp = manager.create('LiteralInt');
            const property = manager.create('Property');
            const dataType = manager.create('DataType');
            literalString.name = 'literal string test';
            literalString.value = 'the value of the literal string';
            await dataType.ownedAttributes.add(property);
            await property.lowerValue.set(literalInt);
            await property.upperValue.set(literalIntUp);
            literalInt.value = 0;
            literalIntUp.value = 10;
            literalInt.name = 'lower';
            const literalStringEmit = literalString.emit();
            assert.equal(JSON.stringify(literalStringEmit), JSON.stringify({
                LiteralString: {
                    id: literalString.id,
                    name: 'literal string test',
                    value: 'the value of the literal string'
                },
                owningPackage: pckg.id
            }));
            const propertyEmit = property.emit();
            assert.equal(JSON.stringify(propertyEmit), JSON.stringify({
                Property: {
                    id: property.id,
                    lowerValue: literalInt.id,
                    upperValue: literalIntUp.id
                },
                dataType: dataType.id
            }));
            const literalIntEmit = literalInt.emit();
            assert.equal(JSON.stringify(literalIntEmit), JSON.stringify({
                LiteralInt: {
                    id: literalInt.id,
                    name: 'lower',
                    value: 0
                },
                owner: property.id
            }));
            const literalIntUpEmit = literalIntUp.emit();
            assert.equal(JSON.stringify(literalIntUpEmit), JSON.stringify({
                LiteralInt: {
                    id: literalIntUp.id,
                    value: 10
                },
                owner: property.id
            }));
        });
    });
});
