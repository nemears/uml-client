import Element from '../lib/types/element.js';
import assert from 'assert';
import Namespace from '../lib/types/namespace.js';
import Package from '../lib/types/package.js';
import Class from '../lib/types/class.js';
import Comment from '../lib/types/comment.js';
import PrimitiveType from '../lib/types/primitiveType.js';
import Property from '../lib/types/property.js';
import LiteralInt from '../lib/types/literalInt.js';

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
      assert.ok(pckg.is('Package'));
      assert.ok(pckg.is('PackageableElement'));
      assert.ok(pckg.is('Namespace'));
      assert.ok(pckg.is('NamedElement'));
      assert.ok(pckg.is('Element'));
    });
    it('isSubClassOfClassTest', () => {
      let clazz = new Class();
      assert.ok(clazz.is('Class'));
      assert.ok(clazz.is('StructuredClassifier'));
      assert.ok(clazz.is('Classifier'));
      assert.ok(clazz.is('PackageableElement'));
      assert.ok(clazz.is('Namespace'));
      assert.ok(clazz.is('NamedElement'));
      assert.ok(clazz.is('Element'));
    });
    it('isSubClassOfPrimitiveTypeTest', () => {
      let primitiveType = new PrimitiveType();
      assert.ok(primitiveType.is('PrimitiveType'));
      assert.ok(primitiveType.is('DataType'));
      assert.ok(primitiveType.is('Classifier'));
      assert.ok(primitiveType.is('PackageableElement'));
      assert.ok(primitiveType.is('Namespace'));
      assert.ok(primitiveType.is('NamedElement'));
      assert.ok(primitiveType.is('Element'));
    });
    it('isSubClassOfPropertyTest', () => {
      let property = new Property();
      assert.ok(property.is('Property'));
      assert.ok(property.is('StructuralFeature'));
      assert.ok(property.is('TypedElement'));
      assert.ok(property.is('ConnectableElement'));
      assert.ok(property.elementTypes.has('MultiplicityElement'));
      assert.ok(property.is('MultiplicityElement'));
      assert.ok(property.is('Feature'));
      assert.ok(property.is('RedefinableElement'));
      assert.ok(property.is('NamedElement'));
      assert.ok(property.is('Element'));
    });
    it('isSubClassOfCommentTest', () => {
      let comment = new Comment();
      assert.ok(comment.is('Comment'));
      assert.ok(comment.is('Element'));
    });
    it('is LiteralInt Test', () => {
        let literalInt = new LiteralInt();
        assert.ok(literalInt.is('LiteralInt'));
        assert.ok(literalInt.is('LiteralSpecification'));
        assert.ok(literalInt.is('ValueSpecification'));
        assert.ok(literalInt.is('TypedElement'));
        assert.ok(literalInt.is('PackageableElement'));
        assert.ok(literalInt.is('NamedElement'));
        assert.ok(literalInt.is('Element'));
    });
  });
});
