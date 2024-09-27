const assert = require('assert');
import UmlClient from '../lib/umlClient.js';
import { STRING_ID, generate } from '../lib/generate.js';
import { randomID } from '../lib/types/element.js';

const serverAdress = 'ws://localhost:1672';
/*
describe('uml-generate tests', () => {
    it('generate simple class with singleton', async () => {
        const client = new UmlClient({
            address: serverAdress,
            project: randomID(),
        });
        await client.initialization;
        const clazz = client.post('Class');
        const property = client.post('Property');
        const upper = client.post('LiteralInt');
        const lower = client.post('LiteralInt');
        upper.value = 1;
        lower.value = 0;
        property.lowerValue.set(lower);
        property.upperValue.set(upper);
        property.name = 'foo';
        clazz.ownedAttributes.add(property);
        clazz.name = 'FooClass';
        const FooClass = await generate(clazz, client);
        const instance = new FooClass();
        assert(instance.modelID === clazz.id);
        assert(instance.foo);
        assert(instance.foo.has() === false);
    });
    it ('generate simple class with set', async () => {
        const client = new UmlClient({
            address: serverAdress,
            project: randomID(),
        });
        await client.initialization;
        const clazz = client.post('Class');
        const property = client.post('Property');
        const upper = client.post('LiteralUnlimitedNatural');
        const lower = client.post('LiteralInt');
        upper.value = '*';
        lower.value = 0;
        property.upperValue.set(upper);
        property.lowerValue.set(lower);
        clazz.ownedAttributes.add(property);
        property.name = 'bar';
        clazz.name = 'BarClass';
        const BarClass = await generate(clazz, client);
        const instance = new BarClass();
        assert(instance.modelID === clazz.id);
        assert(instance.bar);
        assert(instance.bar.size() === 0);
    });
    it('generate simple class with string property', async () => {
        const client = new UmlClient({
            address: serverAdress,
            project: randomID(),
        });
        await client.initialization;
        const clazz = client.post('Class');
        const property = client.post('Property');
        const upper = client.post('LiteralUnlimitedNatural');
        const lower = client.post('LiteralInt');
        const defaultValue = client.post('LiteralString');
        upper.value = 1;
        lower.value = 0;
        defaultValue.value = 'hello tests!';
        property.lowerValue.set(lower);
        property.upperValue.set(upper);
        property.name = 'stringExample';
        property.type.set('string_L&R5eAEq6f3LUNtUmzHzT');
        property.defaultValue.set(defaultValue);
        clazz.ownedAttributes.add(property);
        clazz.name = 'StringClass';
        const StringClass = await generate(clazz, client);
        const instance = new StringClass();
        assert(instance.stringExample);
        assert(instance.stringExample === 'hello tests!');
    });
    it('generate class with general', async () => {
        const client = new UmlClient({
            address: serverAdress,
            project: randomID(),
        });
        await client.initialization;
        const clazz = client.post('Class');
        const general = client.post('Class');
        const generalization = client.post('Generalization');
        const property = client.post('Property');
        const upper = client.post('LiteralUnlimitedNatural');
        const lower = client.post('LiteralInt');
        const defaultValue = client.post('LiteralReal');
        const generalProperty = client.post('Property');
        const generalUpper = client.post('LiteralUnlimitedNatural');
        const generalLower = client.post('LiteralInt');
        upper.value = 1;
        lower.value = 0;
        defaultValue.value = 3.14;
        property.lowerValue.set(lower);
        property.upperValue.set(upper);
        property.name = 'specificProperty';
        property.type.set('real_aZG&w6yl61bXVWutgeyScN9');
        property.defaultValue.set(defaultValue);
        clazz.ownedAttributes.add(property);
        clazz.name = 'SpecificClass'; 

        generalUpper.value = '*';
        generalLower.value = 0;
        generalProperty.lowerValue.set(generalLower);
        generalProperty.upperValue.set(generalUpper);
        generalProperty.name = 'generalProperty';
        general.ownedAttributes.add(generalProperty);
        generalization.general.set(general);
        general.name = 'GeneralClass'
        clazz.generalizations.add(generalization);

        const SpecificClass = await generate(clazz, client);
        const instance = new SpecificClass();
        assert(instance.specificProperty === 3.14);
        assert(instance.generalProperty);
        assert(instance.generalProperty.size() === 0);
    });
    it('generate simple package with class', async () => {
       const client = new UmlClient({
            address: serverAdress,
            project: randomID(),
        });
        await client.initialization;
        const clazz = client.post('Class');
        const pkg = client.post('Package');
        clazz.name = 'Foo';
        pkg.name = 'Bar';
        pkg.packagedElements.add(clazz);
        const Bar = await generate(pkg, client);
        assert(Bar.Foo);
        const instance = new Bar.Foo();
        assert(instance.modelID === clazz.id);
        const manager = new Bar.BarManager(await client.head());
        const trackedInstance = manager.post('Foo');
        assert(trackedInstance);
    });
    it('manager post and put class with string property', async () => {
       const client = new UmlClient({
            address: serverAdress,
            project: randomID(),
        });
        await client.initialization;
        const clazz = client.post('Class');
        const property = client.post('Property');
        const defaultValue = client.post('LiteralString');
        const upperValue = client.post('LiteralInt');
        const lowerValue = client.post('LiteralInt');
        const pkg = client.post('Package');
        const head = await client.head();
        const api = client.post('Package');
        property.name = 'blob';
        upperValue.value = 1;
        lowerValue.value = 0;
        defaultValue.value = 'cat';
        property.type.set(STRING_ID);
        property.defaultValue.set(defaultValue);
        property.upperValue.set(upperValue);
        property.lowerValue.set(lowerValue);
        clazz.name = 'Foo';
        clazz.ownedAttributes.add(property);
        pkg.name = 'Bar'; 
        pkg.packagedElements.add(clazz);
        api.name = 'api';
        head.packagedElements.add(api, pkg);
        const Bar = await generate(pkg, client);
        const manager = new Bar.BarManager(api);
        const barInst = manager.post('Foo');
        assert(barInst.blob === 'cat');
        console.log('putting Foo');
        await manager.put(barInst);
        console.log('put Foo');
        assert(api.ownedElements.size() === 1);
        let instance = await api.ownedElements.front();
        assert(instance.elementType() === 'InstanceSpecification');
        assert(instance.slots.size() === 1);
        let slot = await instance.slots.front();
        assert(slot.values.size() === 1);
        let value  = await slot.values.front();
        assert.ok(value.is('LiteralString'));
        assert.equal(value.value, 'cat');
        console.log('putting Foo');
        await manager.put(barInst);
        assert(slot.values.size() === 1);
        value = await slot.values.front();
        assert(value.value === 'cat');
        barInst.blob = 'fox';
        await manager.put(barInst);
        assert(api.ownedElements.size() === 1);
        instance = await api.ownedElements.front();
        assert.equal(instance.elementType(), 'InstanceSpecification');
        assert(instance.slots.size() === 1);
        slot = await instance.slots.front();
        assert(slot.values.size() === 1);
        value = await slot.values.front();
        assert(value.value === 'fox');
    });
    const getUmlModuleAndManager = async (client) => {
        const model = await client.head();
        const uml = await model.packagedElements.front();
        assert(uml.name === 'UML');
        const api = client.post('Package');
        model.packagedElements.add(api);
        console.log('generating...');
        const module = await generate(uml, client);
        return {
            module: module,
            manager: new module.UMLManager(api)
        };
    };
    describe('Stereotype Tests', () => {
        it('Stereotype subsets packagedElement', async () => {
            const client = new UmlClient({
                address: serverAdress,
                project: randomID(),
            });
            await client.initialization;
            
            const foo = client.post('Class');
            const stereotype = client.post('Stereotype');
            const property = client.post('Property');
            const extension = client.post('Extension');
            const extensionEnd = client.post('ExtensionEnd');
            const profile = client.post('Profile');
            const head = await client.head();
            const umlPackage = await head.packagedElements.front();
            umlPackage.packagedElements.add(profile);
            profile.name = 'TestProfile';
            profile.packagedElements.add(stereotype, foo);
            extension.ownedEnd.set(extensionEnd);
            extension.metaClass = 'Package';
            profile.packagedElements.add(extension)
            stereotype.name = 'Test';
            stereotype.ownedAttributes.add(property);
            property.name = 'foos'
            property.subsettedProperties.add('F628ncQKADxo6FLtAlDOdlJfewLy');
            foo.name = 'Foo';
            property.type.set(foo);
            profile.ownedStereotypes.add(stereotype);
            profile.packagedElements.add(foo);
            
            const uml = await getUmlModuleAndManager(client);
            const manager = uml.manager;
            const packageToStereotype = client.post('Package');
            const testEl = await manager.apply(packageToStereotype, 'TestProfile.Test');
            assert.ok(testEl);
            const fooInst = manager.post('TestProfile.Foo');
            assert.ok(fooInst);
            testEl.foos.add(fooInst);
            assert.ok(testEl.foos.contains(fooInst));
            assert.ok(testEl.packagedElements.contains(fooInst));
        });
    });
    it('Delete generated element', async () => {
        const client = new UmlClient({
            address: serverAdress,
            project: randomID(),
        });
        await client.initialization;

        const uml = await getUmlModuleAndManager(client);
        const manager = uml.manager;

        const shape1 = manager.post('UML DI.UMLShape');
        const shape2 = manager.post('UML DI.UMLShape');
        console.log('shape 1 ' + shape1.id);
        console.log('shape 2 ' + shape2.id);
        await shape1.ownedElement.add(shape2);
        assert.equal((await shape1.ownedElement.front()).id, shape2.id);
        console.log('deleting shape 2 (ownedElement)')
        await manager.delete(shape2);
        assert.equal(shape1.ownedElement.size(), 0);
    });
    it('generate redefined element', async () => {
        const client = new UmlClient({
            address: serverAdress,
            project: randomID(),
        });
        await client.initialization;
        
        const parentPackage = client.post('Package');
        const ogClass = client.post('Class');
        const ogProperty = client.post('Property');
        const ogGeneralization = client.post('Generalization');
        const redefinedClass = client.post('Class');
        const redefinedProperty = client.post('Property');
        parentPackage.name = 'root';
        ogClass.name = 'og';
        ogProperty.name = 'prop';
        await ogClass.ownedAttributes.add(ogProperty);
        await ogClass.generalizations.add(ogGeneralization);
        await ogGeneralization.general.set(redefinedClass);
        redefinedClass.name = 're';
        redefinedProperty.name = 'prop';
        await redefinedProperty.redefinedProperties.add(ogProperty);
        await redefinedClass.ownedAttributes.add(redefinedProperty);
        parentPackage.packagedElements.add(ogClass);
        parentPackage.packagedElements.add(redefinedClass);

        const module = await generate(parentPackage, client);

        const apiPackage = client.post('Package');
        const manager = new module.rootManager(apiPackage);
        const redefinedApiEl = manager.post('re');
        assert.ok(redefinedApiEl.sets.has(ogProperty.id));
        assert.ok(redefinedApiEl.sets.has(redefinedProperty.id));
    });
});
*/
