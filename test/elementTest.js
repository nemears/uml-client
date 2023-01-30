import Element from '../lib/element.js';
import assert from 'assert';
import Namespace from '../lib/namespace.js';

describe('ElementTest', function () {
  describe('#ownedElement()', function () {
    it('should be able to access element after added', function () {
        let el = new Element();
        let otherEl = new Element();
        el.ownedElements.add(otherEl);
        assert.equal(el.ownedElements.data[0].id, otherEl.id);
    });
  });
  describe('#ownedMembers()', function() {
    it('should set opposite and subsets when adding element', function() {
      let nmspc = new Namespace();
      let otherNmspc = new Namespace();
      nmspc.ownedMembers.add(otherNmspc);
      assert.equal(nmspc.ownedMembers.data[0].id, otherNmspc.id);
      assert.equal(nmspc.members.data[0].id, otherNmspc.id);
      assert.equal(nmspc.ownedElements.data[0].id, otherNmspc.id);
      assert.equal(otherNmspc.namespace.val.id, nmspc.id);
      assert.equal(otherNmspc.owner.val.id, nmspc.id);
    });
  });
});
