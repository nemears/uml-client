import { TypeInfo } from "./element";
import PackageableElement from "./packageableElement";
import { assignTypedElementSets } from "./typedElement";

export default class ValueSpecification extends PackageableElement {
    constructor(manager) {
        super(manager);
        assignTypedElementSets(this);
        this.typeInfo = new TypeInfo('ValueSpecification');
        this.valueSpecificationTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.packageableElementTypeInfo);
        this.typeInfo.setBase(this.typedElementTypeInfo);
    }
}
