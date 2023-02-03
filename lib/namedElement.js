import Element from './element.js'
import Singleton from './singleton.js';

export default class NamedElement extends Element {
    constructor() {
        super();
        this.name = "";
        this.namespace = new Singleton(this);
        this.namespace.subsets(this.owner);
        this.namespace.opposite = "ownedMembers";
        this.sets["namespace"] = this.namespace;
    }
}

export function emitNamedEl(data, el) {
    if (el.name !== "") {
        data.name = el.name;
    }
}