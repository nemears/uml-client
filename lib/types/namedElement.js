import Element from './element.js'
import Singleton from '../singleton.js';
import UmlSet from '../set.js';

export const NAMED_ELEMENT_NAMESPACE_ID = 'XjBtcuD1gdltfGHP3NqzlXg61zbh';
export const NAMESPACE_MEMBERS_ID = 'ypBZodwaaRcE7gld4WuSbrsav39p';
export const NAMESPACE_OWNED_MEMBERS_ID = 'RFhcUcft&ayqEN8IOPI1ftyO5gsx';

export function assignNamedElementSets(namedEl) {
    namedEl.name = ""; 
    namedEl.namespace = new Singleton(namedEl);
    namedEl.namespace.definingFeature = NAMED_ELEMENT_NAMESPACE_ID;
    namedEl.namespace.subsets(namedEl.owner);
    namedEl.namespace.opposite = NAMESPACE_OWNED_MEMBERS_ID;
    namedEl.sets.set("namespace", namedEl.namespace);
    namedEl.sets.set(NAMED_ELEMENT_NAMESPACE_ID, namedEl.namespace);
    namedEl.clientDependencies = new UmlSet(namedEl);
    namedEl.sets.set("clientDependencies", namedEl.clientDependencies);
    namedEl.elementTypes.add('NamedElement');
}

export default class NamedElement extends Element {
    constructor(manager) {
        super(manager);
        assignNamedElementSets(this);
    }
}

export function emitNamedEl(data, alias, el) {
    if (el.name !== "") {
        data[alias].name = el.name;
    }

    if (el.owner.subSets.length === 0) {
        console.warn("owner not configured correctly during emit");
    }
}
