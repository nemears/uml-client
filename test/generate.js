import assert from 'assert';
import UmlClient from '../lib/umlClient.js';
import { REAL_ID, STRING_ID, generate } from '../lib/generate.js';
import { randomID } from '../lib/types/element.js';

const serverAdress = 'ws://localhost:1672';
describe('uml-generate tests', () => {
    it('generate simple class with singleton', async () => {
        const client = new UmlClient({
            address: serverAdress,
            project: randomID(),
        });
        await client.initialization;
        const clazz = await client.post('Class');
        const property = await client.post('Property');
        const upper = await client.post('LiteralInteger');
        const lower = await client.post('LiteralInteger');
        upper.value = 1;
        lower.value = 0;
        await property.lowerValue.set(lower);
        await property.upperValue.set(upper);
        property.name = 'foo';
        await clazz.ownedAttributes.add(property);
        clazz.name = 'FooClass';
        const foo_manager = await client.generate(clazz);
        const instance = await foo_manager.post('FooClass');
        assert(instance.typeInfo.id === clazz.id);
        assert(instance.foo);
        assert(instance.foo.has() === false);
    });
    it ('generate simple class with set', async () => {
        const client = new UmlClient({
            address: serverAdress,
            project: randomID(),
        });
        await client.initialization;
        const clazz = await client.post('Class');
        const property = await client.post('Property');
        const upper = await client.post('LiteralUnlimitedNatural');
        const lower = await client.post('LiteralInteger');
        upper.value = '*';
        lower.value = 0;
        await property.upperValue.set(upper);
        await property.lowerValue.set(lower);
        await clazz.ownedAttributes.add(property);
        property.name = 'bar';
        clazz.name = 'BarClass';
        const barManager = await client.generate(clazz, client);
        const instance = await barManager.post('BarClass');
        assert(instance.typeInfo.id === clazz.id);
        assert(instance.bar);
        assert(instance.bar.size() === 0);
    });
    it('generate simple class with string property', async () => {
        const client = new UmlClient({
            address: serverAdress,
            project: randomID(),
        });
        await client.initialization;
        const clazz = await client.post('Class');
        const property = await client.post('Property');
        const upper = await client.post('LiteralUnlimitedNatural');
        const lower = await client.post('LiteralInteger');
        const defaultValue = await client.post('LiteralString');
        upper.value = 1;
        lower.value = 0;
        defaultValue.value = 'hello tests!';
        await property.lowerValue.set(lower);
        await property.upperValue.set(upper);
        property.name = 'stringExample';
        await property.type.set(STRING_ID);
        await property.defaultValue.set(defaultValue);
        await clazz.ownedAttributes.add(property);
        clazz.name = 'StringClass';
        const stringManager = await client.generate(clazz, client);
        const instance = await stringManager.post('StringClass');
        assert(instance.stringExample);
        assert(instance.stringExample === 'hello tests!');
    });
    it('generate class with general', async () => {
        const client = new UmlClient({
            address: serverAdress,
            project: randomID(),
        });
        await client.initialization;
        const clazz = await client.post('Class');
        const general = await client.post('Class');
        const generalization = await client.post('Generalization');
        const property = await client.post('Property');
        const upper = await client.post('LiteralUnlimitedNatural');
        const lower = await client.post('LiteralInteger');
        const defaultValue = await client.post('LiteralReal');
        const generalProperty = await client.post('Property');
        const generalUpper = await client.post('LiteralUnlimitedNatural');
        const generalLower = await client.post('LiteralInteger');
        upper.value = 1;
        lower.value = 0;
        defaultValue.value = 3.14;
        await property.lowerValue.set(lower);
        await property.upperValue.set(upper);
        property.name = 'specificProperty';
        await property.type.set(REAL_ID);
        await property.defaultValue.set(defaultValue);
        await clazz.ownedAttributes.add(property);
        clazz.name = 'SpecificClass'; 

        generalUpper.value = '*';
        generalLower.value = 0;
        await generalProperty.lowerValue.set(generalLower);
        await generalProperty.upperValue.set(generalUpper);
        generalProperty.name = 'generalProperty';
        await general.ownedAttributes.add(generalProperty);
        await generalization.general.set(general);
        general.name = 'GeneralClass'
        await clazz.generalizations.add(generalization);

        const generalManager = await client.generate(clazz);
        const instance = await generalManager.post('SpecificClass');
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
        const clazz = await client.post('Class');
        const pkg = await client.post('Package');
        clazz.name = 'Foo';
        pkg.name = 'Bar';
        await pkg.packagedElements.add(clazz);
        const mm = await client.generate(pkg);
        const trackedInstance = await mm.post('Foo');
        assert(trackedInstance);
    });
    it('manager post and put class with string property', async () => {
       const client = new UmlClient({
            address: serverAdress,
            project: randomID(),
        });
        await client.initialization;
        const clazz = await client.post('Class');
        const property = await client.post('Property');
        const defaultValue = await client.post('LiteralString');
        const upperValue = await client.post('LiteralInteger');
        const lowerValue = await client.post('LiteralInteger');
        const pkg = await client.post('Package');
        const head = await client.head();
        const api = await client.post('Package');
        property.name = 'blob';
        upperValue.value = 1;
        lowerValue.value = 0;
        defaultValue.value = 'cat';
        await property.type.set(STRING_ID);
        await property.defaultValue.set(defaultValue);
        await property.upperValue.set(upperValue);
        await property.lowerValue.set(lowerValue);
        clazz.name = 'Foo';
        await clazz.ownedAttributes.add(property);
        pkg.name = 'Bar'; 
        await pkg.packagedElements.add(clazz);
        const manager = await client.generate(pkg);
        const barInst = await manager.post('Foo');
        assert(barInst.blob === 'cat');
        console.log('putting Foo');
        await manager.put(barInst);
        console.log('put Foo');
        console.log('putting Foo');
        await manager.put(barInst);
        barInst.blob = 'fox';
        await manager.put(barInst);
        const barInstFromServer = await manager.get(barInst.id);
        assert(barInstFromServer.blob === 'fox');
    });
    describe('Stereotype Tests', () => {
        it('Stereotype subsets packagedElement', async () => {
            const client = new UmlClient({
                address: serverAdress,
                project: randomID(),
            });
            await client.initialization;
            
            const foo = await client.post('Class');
            const stereotype = await client.post('Stereotype');
            const property = await client.post('Property');
            const extension = await client.post('Extension');
            const extensionEnd = await client.post('ExtensionEnd');
            const profile = await client.post('Profile');
            const head = await client.head();
            const umlPackage = await head.packagedElements.front();
            await umlPackage.packagedElements.add(profile);
            profile.name = 'TestProfile';
            await profile.packagedElements.add(stereotype, foo);
            await extension.ownedEnd.set(extensionEnd);
            extension.metaClass = 'Package';
            await profile.packagedElements.add(extension)
            stereotype.name = 'Test';
            await stereotype.ownedAttributes.add(property);
            property.name = 'foos'
            await property.subsettedProperties.add('F628ncQKADxo6FLtAlDOdlJfewLy');
            foo.name = 'Foo';
            await property.type.set(foo);
            // await profile.packagedElements.add(stereotype);
            await profile.packagedElements.add(foo);
            
            const manager = await client.generate(umlPackage);
            const packageToStereotype = await client.post('Package');
            const testEl = await manager.apply(packageToStereotype, stereotype.id);
            assert.ok(testEl);
            const fooInst = await manager.post(foo.id);
            assert.ok(fooInst);
            testEl.foos.add(fooInst);
            assert.ok(testEl.foos.contains(fooInst));
            assert.ok(testEl.packagedElements.contains(fooInst));
        });
    });
    it('Delete generated element', async () => {
        const UML_DI_ID = 'eG2Xwx-vouEkDctJcAiaCXLu8G5H';
        const UML_DI_UML_SHAPE_ID = 'KYV0Pg5b5r4KJ6qCA3_RAU2bWI4g';
        const client = new UmlClient({
            address: serverAdress,
            project: randomID(),
        });
        await client.initialization;

        // const uml = await getUmlModuleAndManager(client);
        const manager = await client.generate(await client.get(UML_DI_ID));

        const shape1 = await manager.post(UML_DI_UML_SHAPE_ID);
        const shape2 = await manager.post(UML_DI_UML_SHAPE_ID);
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
        
        const parentPackage = await client.post('Package');
        const ogClass = await client.post('Class');
        const ogProperty = await client.post('Property');
        const ogGeneralization = await client.post('Generalization');
        const redefinedClass = await client.post('Class');
        const redefinedProperty = await client.post('Property');
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
        await parentPackage.packagedElements.add(ogClass);
        await parentPackage.packagedElements.add(redefinedClass);

        const manager = await client.generate(parentPackage);
        const redefinedApiEl = await manager.post('re');
        assert.ok(redefinedApiEl.typeInfo.sets.has(ogProperty.id));
        assert.ok(redefinedApiEl.typeInfo.sets.has(redefinedProperty.id));
    });
});
