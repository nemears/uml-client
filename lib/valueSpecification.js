import PackageableElement from "./packageableElement";
import { assignTypedElementSets } from "./typedElement";

export default class ValueSpecification extends PackageableElement {
    constructor(manager) {
        super(manager);
        assignTypedElementSets(this);
    }
}

export function isSubClassOfClassValueSpecification(elementType) {
    return elementType === 'valueSpecification' || elementType === 'VALUE_SPECIFICATION';
}