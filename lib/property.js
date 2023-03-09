import NamedElement, { emitNamedEl } from "./namedElement";
import Singleton from "./singleton";
import { emitEl, nullID } from "./element";

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

export function emitProperty(data, alias, property) {
    if (property.clazz.id() !== nullID()) {
        data.class = property.clazz.id();
    }
}