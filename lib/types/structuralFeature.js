import TypedElement from "./typedElement";
import assignMultiplicityElementSets from "./multiplicityElement";
import { assignFeatureSets } from "./feature";
import { assignRedefinableElementSets } from './redefinableElement';

export default class StructuralFeature extends TypedElement {
    constructor(manager) {
        super(manager);
        assignMultiplicityElementSets(this);
        assignFeatureSets(this);
        assignRedefinableElementSets(this);
        this.isReadOnly = false;
        this.elementTypes.add('StructuralFeature');
    }
}

//emit function and parse in parse.js the isReadOnly
export function emitStructuralFeature(data, alias, structuralFeature) {
    if (structuralFeature.isReadOnly) {
        data[alias].isReadOnly = structuralFeature.isReadOnly;
    }
}
