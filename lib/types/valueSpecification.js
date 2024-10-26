import { TypeInfo } from "./element.js";
import PackageableElement from "./packageableElement.js";
import { assignTypedElementSets } from "./typedElement.js";
import { VALUE_SPECIFICATION_ID } from '../modelIds.js';

export default class ValueSpecification extends PackageableElement {
    constructor(manager) {
        super(manager);
        assignTypedElementSets(this);
        this.typeInfo = new TypeInfo(VALUE_SPECIFICATION_ID, 'ValueSpecification');
        this.valueSpecificationTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.packageableElementTypeInfo);
        this.typeInfo.setBase(this.typedElementTypeInfo);
    }
}
