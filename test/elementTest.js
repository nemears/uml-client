import Element from '../lib/element.js';
import assert from 'assert';

describe('ElementTest', function () {
  describe('#ownedElement()', function () {
    it('should be able to access element after added', function () {
        let el = new Element();
        let otherEl = new Element();
        el.ownedElements.add(otherEl);
        assert.equal(el.ownedElements.data[0].id, otherEl.id);
    });
  });
});
