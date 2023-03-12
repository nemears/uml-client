import Element from './element.js'
import Singleton from './singleton.js';

export default class NamedElement extends Element {
    constructor(manager) {
        super(manager);
        this.name = "";
        this.namespace = new Singleton(this);
        this.namespace.subsets(this.owner);
        this.namespace.opposite = "ownedMembers";
        this.sets["namespace"] = this.namespace;
    }
}

export function isSubClassOfNamedElement(elementType) {
    return elementType === 'namedElement' || elementType === 'NAMED_ELEMENT';
}

export function emitNamedEl(data, alias, el) {
    if (el.name !== "") {
        data[alias].name = el.name;
    }
}