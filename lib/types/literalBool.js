import { TypeInfo } from "./element";
import LiteralSpecification from './literalSpecification';
import { LITERAL_BOOL_ID } from '../modelIds';

export default class LiteralBool extends LiteralSpecification {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(LITERAL_BOOL_ID, "LiteralBool");
        this.literalBoolTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.literalSpecificationTypeInfo);
        this.typeInfo.create = () => new LiteralBool(manager);
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
