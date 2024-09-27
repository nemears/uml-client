import DataType from "./dataType";
import { TypeInfo } from "./element";

export default class PrimitiveType extends DataType {

    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo("PrimitiveType");
        this.primitiveTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.dataTypeTypeInfo);
        this.typeInfo.create = () => new PrimitiveType(manager);
    }
}
