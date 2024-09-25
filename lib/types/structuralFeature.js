import { TypeInfo } from './element';
import TypedElement from "./typedElement";
import assignMultiplicityElementSets from "./multiplicityElement";
import { assignFeatureSets } from "./feature";
import { assignRedefinableElementSets } from './redefinableElement';

export default class StructuralFeature extends TypedElement {
    constructor(manager) {
        super(manager);
        assignMultiplicityElementSets(this);
        assignRedefinableElementSets(this);
        assignFeatureSets(this);
        this.structuralFeatureTypeInfo = new TypeInfo('StructuralFeature');
        this.typeInfo = this.structuralFeatureTypeInfo;
        this.typeInfo.setBase(this.featureTypeInfo);
        this.typeInfo.setBase(this.typedElementTypeInfo);
        this.typeInfo.setBase(this.multiplicityElementTypeInfo);
        this.isReadOnly = false;
    }
}
