import { TypeInfo } from "./element";
import LiteralSpecification from './literalSpecification';
import { LITERAL_INT_ID } from '../modelIds';

export default class LiteralInt extends LiteralSpecification {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(LITERAL_INT_ID, 'LiteralInt');
        this.literalIntTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.literalSpecificationTypeInfo);
        this.typeInfo.create = () => new LiteralInt(manager);
        const me = this;
        this.typeInfo.specialData.set('value', {
            getData() {
                return me.value;
            },
            setData(val) {
                me.value = val;
            },
            type: 'number'
        });
        this.value = 0;
    }
}
