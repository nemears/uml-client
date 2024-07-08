import NamedElement , { NAMED_ELEMENT_NAMESPACE_ID, NAMESPACE_MEMBERS_ID, NAMESPACE_OWNED_MEMBERS_ID } from "./namedElement.js";
import UmlSet from "../set.js"


export function assignNamespaceSets(nmspc) {
    nmspc.members = new UmlSet(nmspc);
    nmspc.members.definingFeature = NAMESPACE_MEMBERS_ID;
    nmspc.ownedMembers = new UmlSet(nmspc);
    nmspc.ownedMembers.definingFeature = NAMESPACE_OWNED_MEMBERS_ID;
    nmspc.ownedMembers.subsets(nmspc.members);
    nmspc.ownedMembers.subsets(nmspc.ownedElements);
    nmspc.ownedMembers.opposite = NAMED_ELEMENT_NAMESPACE_ID;
    nmspc.sets.set("members", nmspc.members);
    nmspc.sets.set("ownedMembers", nmspc.ownedMembers);
    nmspc.sets.set(NAMESPACE_MEMBERS_ID, nmspc.members);
    nmspc.sets.set(NAMESPACE_OWNED_MEMBERS_ID, nmspc.ownedMembers);
    nmspc.elementTypes.add('Namespace');
}

export default class Namespace extends NamedElement {
    constructor(manager) {
        super(manager);
        assignNamespaceSets(this);
    }
}
