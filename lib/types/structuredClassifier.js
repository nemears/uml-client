import { TypeInfo } from './element.js';
import Classifier from "./classifier.js";
import UmlSet from "../set.js";
import { 
    STRUCTURED_CLASSIFIER_ID, 
    STRUCTURED_CLASSIFIER_OWNED_ATTRIBUTES_ID, 
    STRUCTURED_CLASSIFIER_PARTS_ID, 
    STRUCTURED_CLASSIFIER_ROLES_ID 
} from '../modelIds.js';

export default class StructuredClassifier extends Classifier {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(STRUCTURED_CLASSIFIER_ID, 'StructuredClassifier');
        this.structuredClassifierTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.classifierTypeInfo);
        this.ownedAttributes = new UmlSet(this, STRUCTURED_CLASSIFIER_OWNED_ATTRIBUTES_ID, 'ownedAttributes');
        this.ownedAttributes.readonly = true;
        this.ownedAttributes.subsets(this.attributes);
        this.ownedAttributes.subsets(this.ownedMembers);
        this.parts = new UmlSet(this, STRUCTURED_CLASSIFIER_PARTS_ID, 'parts'); // TODO add with policy and composition
        this.roles = new UmlSet(this, STRUCTURED_CLASSIFIER_ROLES_ID, 'roles');
    }
}
