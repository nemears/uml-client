import { TypeInfo } from "./element";
import PackageableElement from "./packageableElement";
import { assignTypedElementSets } from "./typedElement";
import { VALUE_SPECIFICATION_ID } from '../modelIds';

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
