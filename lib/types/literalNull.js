import { TypeInfo } from "./element.js";
import LiteralSpecification from './literalSpecification.js';
import { LITERAL_NULL_ID } from '../modelIds.js';

export default class LiteralNull extends LiteralSpecification {

    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(LITERAL_NULL_ID, 'LiteralNull');
        this.literalNullTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.literalSpecificationTypeInfo);
        this.create = () => new LiteralNull(manager);
    }
}
