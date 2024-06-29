const assert = require('assert');
import UmlClient from '../lib/umlClient.js';
import { STRING_ID, generate } from '../lib/generate.js';
import { randomID } from '../lib/element.js';

describe('uml-generate tests', () => {
    it('generate simple class with singleton', async () => {
        const client = new UmlClient({
            address: 'wss://uml.cafe/api/',
            project: randomID(),
        });
        await client.initialization;
        const clazz = client.post('class');
        const property = client.post('property');
        const upper = client.post('literalInt');
        const lower = client.post('literalInt');
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
            address: 'wss://uml.cafe/api/',
            project: randomID(),
        });
        await client.initialization;
        const clazz = client.post('class');
        const property = client.post('property');
        const upper = client.post('literalUnlimitedNatural');
        const lower = client.post('literalInt');
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
            address: 'wss://uml.cafe/api/',
            project: randomID(),
        });
        await client.initialization;
        const clazz = client.post('class');
        const property = client.post('property');
        const upper = client.post('literalUnlimitedNatural');
        const lower = client.post('literalInt');
        const defaultValue = client.post('literalString');
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
            address: 'wss://uml.cafe/api/',
            project: randomID(),
        });
        await client.initialization;
        const clazz = client.post('class');
        const general = client.post('class');
        const generalization = client.post('generalization');
        const property = client.post('property');
        const upper = client.post('literalUnlimitedNatural');
        const lower = client.post('literalInt');
        const defaultValue = client.post('literalReal');
        const generalProperty = client.post('property');
        const generalUpper = client.post('literalUnlimitedNatural');
        const generalLower = client.post('literalInt');
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
            address: 'wss://uml.cafe/api/',
            project: randomID(),
        });
        await client.initialization;
        const clazz = client.post('class');
        const pkg = client.post('package');
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
            address: 'wss://uml.cafe/api/',
            project: randomID(),
        });
        await client.initialization;
        const clazz = client.post('class');
        const property = client.post('property');
        const defaultValue = client.post('literalString');
        const upperValue = client.post('literalInt');
        const lowerValue = client.post('literalInt');
        const pkg = client.post('package');
        const head = await client.head();
        const api = client.post('package');
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
        const wait1Sec = () => {
            return new Promise((res) => {
                setTimeout(async () => {
                   res(true); 
                }, 1000);
            }); 
        };
        await wait1Sec();
        assert(api.ownedElements.size() === 1);
        let instance = await api.ownedElements.front();
        assert(instance.elementType() === 'instanceSpecification');
        assert(instance.slots.size() === 1);
        let slot = await instance.slots.front();
        assert(slot.values.size() === 0);
        manager.put(barInst);
        await wait1Sec();
        assert(slot.values.size() === 1);
        let value = await slot.values.front();
        assert(value.value === 'cat');
        barInst.blob = 'fox';
        manager.put(barInst);
        await wait1Sec();
        assert(api.ownedElements.size() === 1);
        instance = await api.ownedElements.front();
        assert(instance.elementType() === 'instanceSpecification');
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
        const api = client.post('package');
        model.packagedElements.add(api);
        const module = await generate(uml, client);
        return {
            module: module,
            manager: new module.UMLManager(api)
        };
    };
    it('integration test (set up manager from UML folder in base project)', async () => {
        const client = new UmlClient({
            address: 'wss://uml.cafe/api/',
            project: randomID(),
        });
        await client.initialization; 

        const uml = await getUmlModuleAndManager(client); 
        const manager = uml.manager;
        const shape = manager.post('Diagram Interchange.Shape');
        assert(shape.bounds)
        assert(!shape.bounds.has());
    });
    describe('Stereotype Tests', () => {
        it('Stereotype subsets packagedElement', async () => {
            const client = new UmlClient({
                address: 'ws://localhost:1672',
                project: randomID(),
            });
            await client.initialization;
            
            const foo = client.post('class');
            const stereotype = client.post('stereotype');
            const property = client.post('property');
            const extension = client.post('extension');
            const extensionEnd = client.post('extensionEnd');
            const profile = client.post('profile');
            const head = await client.head();
            const umlPackage = await head.packagedElements.front();
            const packagedElements = //TODO aghgha
            umlPackage.packagedElements.add(profile);
            profile.name = 'TestProfile';
            profile.packagedElements.add(stereotype, foo);
            stereotype.name = 'Test';
            stereotype.ownedAttributes.add(property);
            property.name = 'foos'
            foo.name == 'Foo';
            
            
            // TODO 

            const uml = await getUmlModuleAndManager(client);
            const manager = uml.manager;
            
        });
    });
});
