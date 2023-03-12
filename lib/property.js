import NamedElement, { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import Singleton from "./singleton";
import { emitEl, isSubClassOfElement, nullID } from "./element";

export default class Property extends NamedElement {
    constructor(manager) {
        super(manager);
        this.featuringClassifier = new Singleton(this);
        this.featuringClassifier.opposite = 'features';
        this.clazz = new Singleton(this);
        this.clazz.subsets(this.featuringClassifier);
        this.clazz.subsets(this.namespace);
        this.clazz.opposite = 'ownedAttributes';
        this.sets['featuringClassifier'] = this.featuringClassifier;
        this.sets['class'] = this.clazz;
    }

    elementType() {
        return 'property';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfProperty(elementType);
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
        emitProperty(ret, 'property', this);
        return ret;
    }
}

export function isSubClassOfProperty(elementType) {
    return elementType === 'property' || elementType === 'PROPERTY';
}

export function emitProperty(data, alias, property) {
    if (property.clazz.id() !== nullID()) {
        data.class = property.clazz.id();
    }
}