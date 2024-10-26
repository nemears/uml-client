import DataType from "./dataType.js";
import { TypeInfo } from "./element.js";
import { PRIMITIVE_TYPE_ID } from '../modelIds.js';

export default class PrimitiveType extends DataType {

    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(PRIMITIVE_TYPE_ID, "PrimitiveType");
        this.primitiveTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.dataTypeTypeInfo);
        this.typeInfo.create = () => new PrimitiveType(manager);
    }
}
