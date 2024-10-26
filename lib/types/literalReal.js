import { TypeInfo } from "./element.js";
import LiteralSpecification from './literalSpecification.js';
import { LITERAL_REAL_ID } from '../modelIds.js';

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
                return me.value.toString();
            },
            setData(val) {
                if (typeof val === 'string') {
                    val = parseFloat(val);
                }
                me.value = val;
            }
        });
        this.value = undefined;
    }
}
