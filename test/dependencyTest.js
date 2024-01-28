import assert from 'assert';
import UmlManager from '../lib/manager';
import parse from '../lib/parse';
import { nullID } from '../lib/element';

describe('DependencyTests', () => {
    it('parseDependencyTest', async () => {
        const manager = new UmlManager();
        const data = {
            dependency: {
                id: 'T1J0hAryQORw9sMaNfgUwVDor7ID',
                supplier: ['T1J0hAryQORw9sMaNfgUwVDor7eS'],
                client: ['T1J0hAryQORw9sMaNfgUwVDor7eC']
            }
        }
        const supplierData = {
            class: {
                id: 'T1J0hAryQORw9sMaNfgUwVDor7eS'
            }
        }
        const clientData = {
            class: {
                id: 'T1J0hAryQORw9sMaNfgUwVDor7eC',
                clientDependencies: ['T1J0hAryQORw9sMaNfgUwVDor7ID']
            }
        }

        const dependency = parse(data);
        const clazz = parse(supplierData);
        const clazzToo = parse(clientData);
        manager.add(dependency);
        manager.add(clazz);
        manager.add(clazzToo);
        assert.equal(dependency.supplier.ids().front(), 'T1J0hAryQORw9sMaNfgUwVDor7eS');
        assert.equal(dependency.client.ids().front(), 'T1J0hAryQORw9sMaNfgUwVDor7eC');
        assert.equal(dependency.id, clazzToo.clientDependencies.ids().front());
    });
    it('emitDependencyTest', () => {
        const manager = new UmlManager();
        const dependency = manager.create('dependency');
        const clazz = manager.create('class');
        const clazzToo = manager.create('class');
        dependency.supplier.add(clazz);
        dependency.client.add(clazzToo);
        const dependencyEmit = dependency.emit();
        assert.equal(JSON.stringify(dependencyEmit), JSON.stringify({
            dependency: {
                id: dependency.id,
                clients: [clazzToo.id],
                suppliers: [clazz.id]
            }
        }));        
    });
    it('deleteDependencyTest', async () => {
        const manager = new UmlManager();
        const dependency = manager.create('dependency');
        const clazz = manager.create('class');
        const clazzToo = manager.create('class');
        dependency.supplier.add(clazz);
        dependency.client.add(clazzToo);
        assert.equal(await clazzToo.clientDependencies.front(), dependency);
        await manager.deleteElement(dependency);
        assert.equal(dependency.clientDependencies.size(), 0);
    });
})