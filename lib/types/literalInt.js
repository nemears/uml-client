import { TypeInfo } from "./element";
import LiteralSpecification from './literalSpecification';

export default class LiteralInt extends LiteralSpecification {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo('LiteralInt');
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
            }
        });
        this.value = 0;
    }
}