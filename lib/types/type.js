import { TypeInfo } from "./element.js";
import PackageableElement from "./packageableElement.js";
import { TYPE_ID } from '../modelIds.js';

export default class Type extends PackageableElement {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(TYPE_ID, "Type");
        this.typeTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.packageableElementTypeInfo);
    }
}
