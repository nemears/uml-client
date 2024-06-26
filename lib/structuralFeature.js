import TypedElement from "./typedElement";
import assignMultiplicityElementSets from "./multiplicityElement";
import { assignFeatureSets } from "./feature";
import { assignRedefinableElementSets } from './redefinableElement';

export default class StructuralFeature extends TypedElement {
    constructor(manager) {
        super(manager);
        assignMultiplicityElementSets(this);
        assignFeatureSets(this);
        this.isReadOnly = false;
        assignRedefinableElementSets(this);
    }
}

export function isSubClassOfStructuralFeature(elementType) {
    return elementType === 'structuralFeature' || elementType === 'STRUCTURAL_FEATURE';
}

//emit function and parse in parse.js the isReadOnly
export function emitStructuralFeature(data, alias, structuralFeature) {
    if (structuralFeature.isReadOnly) {
        data[alias].isReadOnly = structuralFeature.isReadOnly;
    }
}
