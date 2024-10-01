import { TypeInfo } from "./element";
import PackageableElement from "./packageableElement";
import { TYPE_ID } from '../modelIds';

export default class Type extends PackageableElement {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(TYPE_ID, "Type");
        this.typeTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.packageableElementTypeInfo);
    }
}
