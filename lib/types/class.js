import { TypeInfo } from './element.js';
import UmlSet from '../set.js';
import EncapsulatedClassifier from './encapsulatedClassifier.js';
import { 
    CLASS_ID,
    CLASS_OWNED_ATTRIBUTES_ID, 
    PROPERTY_CLASS_ID 
} from '../modelIds.js';

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
