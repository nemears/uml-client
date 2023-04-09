import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import Singleton from "./singleton";
import { emitEl, isSubClassOfElement, nullID } from "./element";
import TypedElement, { emitTypedElement, isSubClassOfTypedElement } from "./typedElement";
import assignMultiplicityElementSets, { emitMultiplicityElement, isSubClassOfMultiplicityElement } from "./multiplicityElement";

export default class Property extends TypedElement {
    constructor(manager) {
        super(manager);
        assignMultiplicityElementSets(this);
        this.featuringClassifier = new Singleton(this);
        this.featuringClassifier.opposite = 'features';
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
        this.sets['featuringClassifier'] = this.featuringClassifier;
        this.sets['class'] = this.clazz;
        this.sets['dataType'] = this.dataType;
        this.sets['association'] = this.association;
        this.sets['owningAssociation'] = this.owningAssociation;
    }

    elementType() {
        return 'property';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfProperty(elementType);
        if (!ret) {
            ret = isSubClassOfMultiplicityElement(elementType);
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
            this.clazz.set(null);
        }
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

    if (property.owningAssociation.id() === nullID() && property.association.id() !== nullID()) {
        data[alias].association = property.association.id();
    }
}