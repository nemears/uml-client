import { TypeInfo } from "./element.js";
import LiteralSpecification from './literalSpecification.js';
import { LITERAL_INT_ID } from '../modelIds.js';

export default class LiteralInteger extends LiteralSpecification {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(LITERAL_INT_ID, 'LiteralInteger');
        this.literalIntTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.literalSpecificationTypeInfo);
        this.typeInfo.create = () => new LiteralInteger(manager);
        const me = this;
        this.typeInfo.specialData.set('value', {
            getData() {
                return me.value.toString();
            },
            setData(val) {
                if (typeof val === 'string') {
                    me.value = parseInt(val);
                } else {
                    me.value = val;
                }
            },
            type: 'number'
        });
        this.value = 0;
    }
}
