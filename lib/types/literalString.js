import { TypeInfo } from "./element";
import LiteralSpecification from './literalSpecification';
import { LITERAL_STRING_ID } from '../modelIds';

export default class LiteralString extends LiteralSpecification {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(LITERAL_STRING_ID, 'LiteralString');
        this.literalStringTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.literalSpecificationTypeInfo);
        this.typeInfo.create = () => new LiteralString(manager);
        const me = this;
        this.typeInfo.specialData.set('value', {
            getData() {
                return me.value;
            },
            setData(val) {
                me.value = val;
            }
        });
        this.value = '';
    }
}
