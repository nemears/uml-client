import { TypeInfo } from "./element";
import LiteralSpecification from './literalSpecification';
import { LITERAL_NULL_ID } from '../modelIds';

export default class LiteralNull extends LiteralSpecification {

    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(LITERAL_NULL_ID, 'LiteralNull');
        this.literalNullTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.literalSpecificationTypeInfo);
        this.create = () => new LiteralNull(manager);
    }
}
