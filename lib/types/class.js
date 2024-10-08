import { TypeInfo } from './element';
import UmlSet from '../set';
import EncapsulatedClassifier from './encapsulatedClassifier';
import { 
    CLASS_ID,
    CLASS_OWNED_ATTRIBUTES_ID, 
    PROPERTY_CLASS_ID 
} from '../modelIds';

export default class Class extends EncapsulatedClassifier {
    constructor(manager) {
        super(manager);
        this.classTypeInfo = new TypeInfo(CLASS_ID, 'Class');
        this.typeInfo = this.classTypeInfo;
        this.typeInfo.create = () => { return new Class(manager); }
        this.typeInfo.setBase(this.encapsulatedClassifierTypeInfo);
        this.classOwnedAttributes = new UmlSet(this, CLASS_OWNED_ATTRIBUTES_ID, 'ownedAttributes');
        this.classOwnedAttributes.redefines(this.ownedAttributes);
        this.classOwnedAttributes.opposite = PROPERTY_CLASS_ID;
    }
}
