import PackageableElement from "./packageableElement";
import { assignTypedElementSets } from "./typedElement";

export default class ValueSpecification extends PackageableElement {
    constructor() {
        super();
        assignTypedElementSets(this);
    }
}

export function isSubClassOfClassValueSpecification(elementType) {
    return elementType === 'valueSpecification' || elementType === 'VALUE_SPECIFICATION';
}