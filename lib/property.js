import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import Singleton from "./singleton";
import { cleanupReferences, emitEl, isSubClassOfElement, nullID } from "./element";
import { emitTypedElement, isSubClassOfTypedElement } from "./typedElement";
import { emitMultiplicityElement, isSubClassOfMultiplicityElement } from "./multiplicityElement";
import StructuralFeature, {isSubClassOfStructuralFeature} from "./structuralFeature";
import { isSubClassOfFeature } from "./feature";
import { isSubClassOfRedefinableElement } from "./redefinableElement";

export default class Property extends StructuralFeature {
    constructor(manager) {
        super(manager);
        this.clazz = new Singleton(this);
        this.clazz.subsets(this.featuringClassifier);
        this.clazz.subsets(this.namespace);
        this.clazz.opposite = 'ownedAttributes';
        this.dataType = new Singleton(this);
        this.dataType.subsets(this.featuringClassifier);
        this.dataType.subsets(this.namespace);
        this.dataType.opposite = 'ownedAttributes';
        this.association = new Singleton(this);
        this.association.opposite = 'memberEnds';
        this.owningAssociation = new Singleton(this);
        this.owningAssociation.subsets(this.association);
        this.owningAssociation.subsets(this.namespace);
        this.owningAssociation.subsets(this.featuringClassifier);
        this.owningAssociation.opposite = 'ownedEnds';
        this.defaultValue = new Singleton(this);
        this.defaultValue.subsets(this.ownedElements);
        this.sets['class'] = this.clazz;
        this.sets['dataType'] = this.dataType;
        this.sets['association'] = this.association;
        this.sets['owningAssociation'] = this.owningAssociation;
        this.sets['defaultValue'] = this.defaultValue;

        this.aggregation = 'none';
    }

    elementType() {
        return 'property';
    }

    isSubClassOf(elementType) {
        //fix once it extends structuralFeature
        let ret = isSubClassOfProperty(elementType);
        if (!ret) {
            ret = isSubClassOfMultiplicityElement(elementType);
        }
        if (!ret) {
            ret = isSubClassOfStructuralFeature(elementType);
        }
        if (!ret) {
            ret = isSubClassOfTypedElement(elementType);
        }
        if (!ret) {
            ret = isSubClassOfNamedElement(elementType);
        }
        if (!ret) {
            ret = isSubClassOfElement(elementType);
        }
        if (!ret) {
            ret = isSubClassOfFeature(elementType);
        }
        if (!ret) {
            ret = isSubClassOfRedefinableElement(elementType);
        }

        return ret;
    }

    emit() {
        let ret = {
            property: {}
        };
        emitEl(ret, 'property', this);
        emitNamedEl(ret, 'property', this);
        emitTypedElement(ret, 'property', this);
        emitMultiplicityElement(ret, 'property', this);
        emitProperty(ret, 'property', this);
        return ret;
    }

    async deleteData() {
        if (this.clazz.has()) {
            this.clazz.set(undefined);
        }
        await cleanupReferences(this);
    }
}

export function isSubClassOfProperty(elementType) {
    return elementType === 'property' || elementType === 'PROPERTY';
}

export function emitProperty(data, alias, property) {
    if (property.clazz.id() !== nullID()) {
        data.class = property.clazz.id();
    } else if (property.dataType.id() !== nullID()) {
        data.dataType = property.dataType.id();
    } else if (property.owningAssociation.id() !== nullID()) {
        data.owningAssociation = property.owningAssociation.id();
    }

    if (property.aggregation !== 'none') {
        data[alias].aggregation = property.aggregation;
    }

    if (property.owningAssociation.id() === nullID() && property.association.id() !== nullID()) {
        data[alias].association = property.association.id();
    }

    if (property.defaultValue.id() !== nullID()) {
        data[alias].defaultValue = property.defaultValue.id();
    }
}
