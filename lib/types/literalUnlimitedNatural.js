import { TypeInfo } from './element';
import LiteralSpecification from './literalSpecification';

export default class LiteralUnlimitedNatural extends LiteralSpecification {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo('LiteralUnlimitedNatural');
        this.literalUnlimitedNaturalTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.literalSpecificationTypeInfo);
        this.typeInfo.create = () => new LiteralUnlimitedNatural(manager);
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