import Classifier from "./classifier.js";
import UmlSet from "../set.js";
import { TypeInfo } from "./element.js";
import { DATATYPE_ID, DATATYPE_OWNED_ATTRIBUTES_ID, PROPERTY_DATATYPE_ID } from '../modelIds.js';

export default class DataType extends Classifier {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(DATATYPE_ID, "DataType");
        this.dataTypeTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.classifierTypeInfo);
        this.typeInfo.create = () => new DataType(manager);
        this.ownedAttributes = new UmlSet(this, DATATYPE_OWNED_ATTRIBUTES_ID, "ownedAttributes");
        // this.ownedOperations = new UmlSet(this);
        this.ownedAttributes.subsets(this.attributes);
        this.ownedAttributes.subsets(this.ownedMembers);
        // this.ownedOperations.subsets(this.features);
        //this.ownedOperations.subsets(this.redefinableElements);
        // this.ownedOperations.subsets(this.ownedMembers);
        this.ownedAttributes.opposite = PROPERTY_DATATYPE_ID;
        // this.ownedOperations.opposite = 'dataType';
    }
}
