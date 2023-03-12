import NamedElement from "./namedElement.js";
import Set from "./set.js"

export function assignNamespaceSets(nmspc) {
    nmspc.members = new Set(nmspc);
    nmspc.ownedMembers = new Set(nmspc);
    nmspc.ownedMembers.subsets(nmspc.members);
    nmspc.ownedMembers.subsets(nmspc.ownedElements);
    nmspc.ownedMembers.opposite = "namespace";
    nmspc.sets["members"] = nmspc.members;
    nmspc.sets["ownedMembers"] = nmspc.ownedMembers;
}

export default class Namespace extends NamedElement {
    constructor(manager) {
        super(manager);
        assignNamespaceSets(this);
    }
}

export function isSubClassOfNamespace(elementType) {
    return elementType === 'namespace' || elementType === 'NAMESPACE';
}