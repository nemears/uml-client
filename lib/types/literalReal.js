import { TypeInfo } from "./element";
import LiteralSpecification from './literalSpecification';
import { LITERAL_REAL_ID } from '../modelIds';

export default class LiteralReal extends LiteralSpecification {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(LITERAL_REAL_ID, 'LiteralReal');
        this.literalRealTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.literalSpecificationTypeInfo);
        this.typeInfo.create = () => new LiteralReal(manager);
        const me = this;
        this.typeInfo.specialData.set('value', {
            getData() {
                return me.value;
            },
            setData(val) {
                me.value = val;
            }
        });
        this.value = undefined;
    }
}
