import { TypeInfo } from "./element";
import PackageableElement from "./packageableElement";

export default class Type extends PackageableElement {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo("Type");
        this.typeTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.packageableElementTypeInfo);
    }
}
