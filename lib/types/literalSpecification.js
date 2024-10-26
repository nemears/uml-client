import { TypeInfo } from './element.js';
import ValueSpecification from './valueSpecification.js';
import { LITERAL_SPECIFICATION_ID } from '../modelIds.js';

export default class LiteralSpecification extends ValueSpecification {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(LITERAL_SPECIFICATION_ID, 'LiteralSpecification');
        this.literalSpecificationTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.valueSpecificationTypeInfo);
    }
}
