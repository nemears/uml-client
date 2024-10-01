import InstanceSpecification from './instanceSpecification.js'
import Singleton from "../singleton";
import { TypeInfo } from './element.js';
import { ENUMERATION_LITERAL_ID, ENUMERATION_LITERAL_ENUMERATION_ID, ENUMERATION_OWNED_LITERALS_ID } from '../modelIds.js';

export default class EnumerationLiteral extends InstanceSpecification {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(ENUMERATION_LITERAL_ID, 'EnumerationLiteral');
        this.enumerationLiteralTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.instanceSpecificationTypeInfo);
        this.typeInfo.create = () => new EnumerationLiteral(manager);
        this.enumeration = new Singleton(this, ENUMERATION_LITERAL_ENUMERATION_ID, 'enumeration');
        // this.classifier = new Singleton(this);
        this.enumeration.subsets(this.namespace);
        this.enumeration.opposite = ENUMERATION_OWNED_LITERALS_ID;
        // this.classifier.opposite = 'enumerationLiteral';
    }
}
