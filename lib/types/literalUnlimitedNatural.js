import { TypeInfo } from './element.js';
import LiteralSpecification from './literalSpecification.js';
import { LITERAL_UNLIMITED_NATURAL_ID } from '../modelIds.js';

export default class LiteralUnlimitedNatural extends LiteralSpecification {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(LITERAL_UNLIMITED_NATURAL_ID, 'LiteralUnlimitedNatural');
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
            },
            type : 'unlimitedNatural'
        });
        this.value = 0;
    }
}
