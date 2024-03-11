import TypedElement from "./typedElement";
import assignMultiplicityElementSets from "./multiplicityElement";
import { assignFeatureSets } from "./feature";

export default class StructuralFeature extends TypedElement {
    constructor(manager) {
        super(manager);
        assignMultiplicityElementSets(this);
        assignFeatureSets(this);
        this.isReadOnly = false;
    }

}

export function isSubClassOfStructuralFeature(elementType) {
    return elementType === 'structuralFeature' || elementType === 'STRUCTURAL_FEATURE';
}

//emit function and parse in parse.js the isReadOnly
export function emitStructuralFeature(data, alias, structuralFeature) {
    if (structuralFeature.isReadOnly !== undefined) {
        data[alias].isReadOnly = structuralFeature.isReadOnly;
    }
}