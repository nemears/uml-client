import { TypeInfo } from './element';
import ValueSpecification from './valueSpecification';
import { LITERAL_SPECIFICATION_ID } from '../modelIds';

export default class LiteralSpecification extends ValueSpecification {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(LITERAL_SPECIFICATION_ID, 'LiteralSpecification');
        this.literalSpecificationTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.valueSpecificationTypeInfo);
    }
}
