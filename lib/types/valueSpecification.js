import PackageableElement, { deletePackageableElementData } from "./packageableElement";
import { assignTypedElementSets } from "./typedElement";

export default class ValueSpecification extends PackageableElement {
    constructor(manager) {
        super(manager);
        assignTypedElementSets(this);
        this.typeInfo, this.valueSpecificationTypeInfo = new TypeInfo('ValueSpecification');
        this.typeInfo.setBase(this.packageableElementTypeInfo);
        this.typeInfo.setBase(this.typedElementTypeInfo);
    }
}
