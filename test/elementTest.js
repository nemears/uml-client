import Element from '../lib/types/element.js';
import assert from 'assert';
import Namespace from '../lib/types/namespace.js';
import Package from '../lib/types/package.js';
import Class from '../lib/types/class.js';
import Comment from '../lib/types/comment.js';
import PrimitiveType from '../lib/types/primitiveType.js';
import Property from '../lib/types/property.js';
import LiteralInteger from '../lib/types/literalInteger.js';
import UmlManager from '../lib/manager.js';

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
      assert.ok(nmspc.ownedMembers.contains(otherNmspc));
      assert.ok(nmspc.members.contains(otherNmspc));
      assert.ok(nmspc.ownedElements.contains(otherNmspc));
      
    });
  });
  describe("#packagedElements", function() {
    it('should add and remove from packagedElement set', async function() {
      let pckg = new Package();
      let otherPckg = new Package();
      await pckg.packagedElements.add(otherPckg);
      assert.ok(pckg.packagedElements.contains(otherPckg));
      assert.ok(pckg.ownedMembers.contains(otherPckg));
      assert.ok(pckg.members.contains(otherPckg));
      assert.ok(pckg.ownedElements.contains(otherPckg));
      assert.equal(otherPckg.owningPackage.id(), pckg.id);
      assert.equal(otherPckg.namespace.id(), pckg.id);
      assert.equal(otherPckg.owner.id(), pckg.id);
      let secondPckg = new Package();
      await pckg.packagedElements.add(secondPckg);
      assert.ok(pckg.packagedElements.contains(secondPckg));
      assert.ok(pckg.ownedMembers.contains(secondPckg));
      assert.ok(pckg.members.contains(secondPckg));
      assert.ok(pckg.ownedElements.contains(secondPckg));
      assert.equal(secondPckg.owningPackage.id(), pckg.id);
      assert.equal(secondPckg.namespace.id(), pckg.id);
      assert.equal(secondPckg.owner.id(), pckg.id);
      await pckg.packagedElements.remove(otherPckg);
      assert.ok(pckg.packagedElements.contains(secondPckg));
      assert.ok(pckg.ownedMembers.contains(secondPckg));
      assert.ok(pckg.members.contains(secondPckg));
      assert.ok(pckg.ownedElements.contains(secondPckg));
      assert.equal(secondPckg.owningPackage.id(), pckg.id);
      assert.equal(secondPckg.namespace.id(), pckg.id);
      assert.equal(secondPckg.owner.id(), pckg.id);
      await pckg.packagedElements.remove(secondPckg);
      assert.equal(pckg.packagedElements.size(), 0);
    });
  });
  describe('isSubClassOf', () => {
    it('isSubClassOfPackageTest', () => {
      const manager = new UmlManager();
      let pckg = manager.create('Package');
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
        let literalInt = new LiteralInteger();
        assert.ok(literalInt.is('LiteralInteger'));
        assert.ok(literalInt.is('LiteralSpecification'));
        assert.ok(literalInt.is('ValueSpecification'));
        assert.ok(literalInt.is('TypedElement'));
        assert.ok(literalInt.is('PackageableElement'));
        assert.ok(literalInt.is('NamedElement'));
        assert.ok(literalInt.is('Element'));
    });
  });
});
