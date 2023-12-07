import Element from '../lib/element.js';
import assert from 'assert';
import Namespace from '../lib/namespace.js';
import Package from '../lib/package.js';
import Class from '../lib/class.js';
import Comment from '../lib/comment.js';
import PrimitiveType from '../lib/primitiveType.js';
import Property from '../lib/property.js';

describe('ElementTest', function () {
  describe('#ownedElement', function () {
    it('should be able to access element after added', function () {
        let el = new Element(null);
        let otherEl = new Element(null);
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
  describe('isSubClassOf', () => {
    it('isSubClassOfPackageTest', () => {
      let pckg = new Package();
      assert.ok(pckg.isSubClassOf('package'));
      assert.ok(pckg.isSubClassOf('PACKAGE'));
      assert.ok(pckg.isSubClassOf('packageableElement'));
      assert.ok(pckg.isSubClassOf('PACKAGEABLE_ELEMENT'));
      assert.ok(pckg.isSubClassOf('namespace'));
      assert.ok(pckg.isSubClassOf('NAMESPACE'));
      assert.ok(pckg.isSubClassOf('namedElement'));
      assert.ok(pckg.isSubClassOf('NAMED_ELEMENT'));
      assert.ok(pckg.isSubClassOf('element'));
      assert.ok(pckg.isSubClassOf('ELEMENT'));
    });
    it('isSubClassOfClassTest', () => {
      let clazz = new Class();
      assert.ok(clazz.isSubClassOf('class'));
      assert.ok(clazz.isSubClassOf('CLASS'));
      assert.ok(clazz.isSubClassOf('structuredClassifier'));
      assert.ok(clazz.isSubClassOf('STRUCTURED_CLASSIFIER'));
      assert.ok(clazz.isSubClassOf('classifier'));
      assert.ok(clazz.isSubClassOf('CLASSIFIER'));
      assert.ok(clazz.isSubClassOf('packageableElement'));
      assert.ok(clazz.isSubClassOf('PACKAGEABLE_ELEMENT'));
      assert.ok(clazz.isSubClassOf('namespace'));
      assert.ok(clazz.isSubClassOf('NAMESPACE'));
      assert.ok(clazz.isSubClassOf('namedElement'));
      assert.ok(clazz.isSubClassOf('NAMED_ELEMENT'));
      assert.ok(clazz.isSubClassOf('element'));
      assert.ok(clazz.isSubClassOf('ELEMENT'));
    });
    it('isSubClassOfPrimitiveTypeTest', () => {
      let primitiveType = new PrimitiveType();
      assert.ok(primitiveType.isSubClassOf('primitiveType'));
      assert.ok(primitiveType.isSubClassOf('PRIMITIVE_TYPE'));
      assert.ok(primitiveType.isSubClassOf('classifier'));
      assert.ok(primitiveType.isSubClassOf('CLASSIFIER'));
      assert.ok(primitiveType.isSubClassOf('packageableElement'));
      assert.ok(primitiveType.isSubClassOf('PACKAGEABLE_ELEMENT'));
      assert.ok(primitiveType.isSubClassOf('namespace'));
      assert.ok(primitiveType.isSubClassOf('NAMESPACE'));
      assert.ok(primitiveType.isSubClassOf('namedElement'));
      assert.ok(primitiveType.isSubClassOf('NAMED_ELEMENT'));
      assert.ok(primitiveType.isSubClassOf('element'));
      assert.ok(primitiveType.isSubClassOf('ELEMENT'));
    });
    it('isSubClassOfPropertyTest', () => {
      let property = new Property();
      assert.ok(property.isSubClassOf('property'));
      assert.ok(property.isSubClassOf('PROPERTY'));
      assert.ok(property.isSubClassOf('namedElement'));
      assert.ok(property.isSubClassOf('NAMED_ELEMENT'));
      assert.ok(property.isSubClassOf('element'));
      assert.ok(property.isSubClassOf('ELEMENT'));
    });
    it('isSubClassOfCommentTest', () => {
      let comment = new Comment();
      assert.ok(comment.isSubClassOf('comment'));
      assert.ok(comment.isSubClassOf('COMMENT'));
      assert.ok(comment.isSubClassOf('element'));
      assert.ok(comment.isSubClassOf('ELEMENT'));
    });
  });
});
