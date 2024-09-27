import { TypeInfo } from './element';
import ValueSpecification from './valueSpecification';

export default class LiteralSpecification extends ValueSpecification {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo('LiteralSpecification');
        this.literalSpecificationTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.valueSpecificationTypeInfo);
    }
}
