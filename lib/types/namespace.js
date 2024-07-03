import NamedElement from "./namedElement.js";
import UmlSet from "../set.js"

export function assignNamespaceSets(nmspc) {
    nmspc.members = new UmlSet(nmspc);
    nmspc.ownedMembers = new UmlSet(nmspc);
    nmspc.ownedMembers.subsets(nmspc.members);
    nmspc.ownedMembers.subsets(nmspc.ownedElements);
    nmspc.ownedMembers.opposite = "namespace";
    nmspc.sets.set("members", nmspc.members);
    nmspc.sets.set("ownedMembers", nmspc.ownedMembers);
    nmspc.elementTypes.add('Namespace');
}

export default class Namespace extends NamedElement {
    constructor(manager) {
        super(manager);
        assignNamespaceSets(this);
    }
}
