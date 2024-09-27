import { TypeInfo } from "./element";
import LiteralSpecification from './literalSpecification';

export default class LiteralNull extends LiteralSpecification {

    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo('LiteralNull');
        this.literalNullTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.literalSpecificationTypeInfo);
        this.create = () => new LiteralNull(manager);
    }
}
