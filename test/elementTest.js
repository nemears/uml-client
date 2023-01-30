import Element from '../lib/element.js';
import assert from 'assert';
import Namespace from '../lib/namespace.js';
import Package from '../lib/package.js';

describe('ElementTest', function () {
  describe('#ownedElement', function () {
    it('should be able to access element after added', function () {
        let el = new Element();
        let otherEl = new Element();
        el.ownedElements.add(otherEl);
        assert.equal(el.ownedElements.data[0].id, otherEl.id);
    });
  });
  describe('#ownedMembers', function() {
    it('should set opposite and subsets when adding element', function() {
      let nmspc = new Namespace();
      let otherNmspc = new Namespace();
      nmspc.ownedMembers.add(otherNmspc);
      assert.equal(nmspc.ownedMembers.data[0].id, otherNmspc.id);
      assert.equal(nmspc.members.data[0].id, otherNmspc.id);
      assert.equal(nmspc.ownedElements.data[0].id, otherNmspc.id);
      
    });
  });
  describe("#packagedElements", function() {
    it('should add and remove from packagedElement set', function() {
      let pckg = new Package();
      let otherPckg = new Package();
      pckg.packagedElements.add(otherPckg);
      assert.equal(pckg.packagedElements.data[0].id, otherPckg.id);
      assert.equal(pckg.ownedMembers.data[0].id, otherPckg.id);
      assert.equal(pckg.members.data[0].id, otherPckg.id);
      assert.equal(pckg.ownedElements.data[0].id, otherPckg.id);
      assert.equal(otherPckg.owningPackage.val.id, pckg.id);
      assert.equal(otherPckg.namespace.val.id, pckg.id);
      assert.equal(otherPckg.owner.val.id, pckg.id);
      let secondPckg = new Package();
      pckg.packagedElements.add(secondPckg);
      assert.equal(pckg.packagedElements.data[1].id, secondPckg.id);
      assert.equal(pckg.ownedMembers.data[1].id, secondPckg.id);
      assert.equal(pckg.members.data[1].id, secondPckg.id);
      assert.equal(pckg.ownedElements.data[1].id, secondPckg.id);
      assert.equal(secondPckg.owningPackage.val.id, pckg.id);
      assert.equal(secondPckg.namespace.val.id, pckg.id);
      assert.equal(secondPckg.owner.val.id, pckg.id);
      pckg.packagedElements.remove(otherPckg);
      assert.equal(pckg.packagedElements.data[0].id, secondPckg.id);
      assert.equal(pckg.ownedMembers.data[0].id, secondPckg.id);
      assert.equal(pckg.members.data[0].id, secondPckg.id);
      assert.equal(pckg.ownedElements.data[0].id, secondPckg.id);
      assert.equal(secondPckg.owningPackage.val.id, pckg.id);
      assert.equal(secondPckg.namespace.val.id, pckg.id);
      assert.equal(secondPckg.owner.val.id, pckg.id);
      pckg.packagedElements.remove(secondPckg);
      assert.equal(pckg.packagedElements.data.length, 0);
    });
  });
});
