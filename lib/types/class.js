import { TypeInfo } from './element';
import UmlSet from '../set';
import EncapsulatedClassifier from './encapsulatedClassifier';
import { CLASS_OWNED_ATTRIBUTES_ID, PROPERTY_CLASS_ID } from '../modelIds';

export default class Class extends EncapsulatedClassifier {
    constructor(manager) {
        super(manager);
        this.classTypeInfo = new TypeInfo('Class');
        this.typeInfo = this.classTypeInfo;
        this.typeInfo.setBase(this.encapsulatedClassifierTypeInfo);
        this.classOwnedAttributes = new UmlSet(this, CLASS_OWNED_ATTRIBUTES_ID, 'ownedAttributes');
        this.classOwnedAttributes.redefines(this.ownedAttributes);
        this.classOwnedAttributes.opposite = PROPERTY_CLASS_ID;
    }
}
