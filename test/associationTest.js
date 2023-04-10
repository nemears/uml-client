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
    })
});