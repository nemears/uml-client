import { TypeInfo } from "./element.js";
import LiteralSpecification from './literalSpecification.js';
import { LITERAL_BOOL_ID } from '../modelIds.js';

export default class LiteralBoolean extends LiteralSpecification {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(LITERAL_BOOL_ID, "LiteralBoolean");
        this.literalBoolTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.literalSpecificationTypeInfo);
        this.typeInfo.create = () => new LiteralBoolean(manager);
        const me = this;
        this.typeInfo.specialData.set('value', {
            getData() {
                if (me.value) {
                    return 'true';
                } else {
                    return 'false';
                }
            },
            setData(val) {
                if (typeof val === 'string') {
                    if (val === 'true') {
                        me.value = true;
                    } else if (val === 'false') {
                        me.value = false;
                    }
                } else {
                    me.value = val;
                }
            },
            type: 'bool'
        });
        this.value = 0;
    }
}
