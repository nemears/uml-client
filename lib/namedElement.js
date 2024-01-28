import Element from './element.js'
import Singleton from './singleton.js';
import Set from './set.js';

export function assignNamedElementSets(namedEl) {
    namedEl.name = ""; 
    namedEl.namespace = new Singleton(namedEl);
    namedEl.namespace.subsets(namedEl.owner);
    namedEl.namespace.opposite = "ownedMembers";
    namedEl.sets["namespace"] = namedEl.namespace;
    namedEl.clientDependencies = new Set(namedEl);
    namedEl.sets["clientDependencies"] = namedEl.clientDependencies;

}

export default class NamedElement extends Element {
    constructor(manager) {
        super(manager);
        assignNamedElementSets(this);
    }
}

export function isSubClassOfNamedElement(elementType) {
    return elementType === 'namedElement' || elementType === 'NAMED_ELEMENT';
}

export function emitNamedEl(data, alias, el) {
    if (el.name !== "") {
        data[alias].name = el.name;
    }

    if (el.owner.subSets.length === 0) {
        console.warn("owner not configured correctly during emit");
    }
}
