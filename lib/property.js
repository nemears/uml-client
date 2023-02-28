import NamedElement, { emitNamedEl } from "./namedElement";
import Singleton from "./singleton";
import { emitEl } from "./element";

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

    async emit() {
        let ret = {
            property: {}
        };
        await emitEl(ret, 'property', this);
        await emitNamedEl(ret, 'property', this);
        await emitProperty(ret, 'property', this);
        return ret;
    }
}

export async function emitProperty(data, alias, property) {
    if (property.clazz.get() !== undefined) {
        data.class = (await property.clazz.get()).id;
    }
}