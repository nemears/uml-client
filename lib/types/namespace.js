import { TypeInfo } from './element';
import NamedElement from "./namedElement.js";
import UmlSet from "../set.js";
import { NAMED_ELEMENT_NAMESPACE_ID, NAMESPACE_MEMBERS_ID, NAMESPACE_OWNED_MEMBERS_ID }  from '../modelIds';


export function assignNamespaceSets(nmspc) {
    const base = nmspc.typeInfo;
    nmspc.typeInfo = new TypeInfo('Namespace');
    nmspc.typeInfo.setBase(base);
    nmspc.members = new UmlSet(nmspc, NAMESPACE_MEMBERS_ID, 'members');
    nmspc.ownedMembers = new UmlSet(nmspc, NAMESPACE_OWNED_MEMBERS_ID, 'ownedMembers');
    nmspc.ownedMembers.subsets(nmspc.members);
    nmspc.ownedMembers.subsets(nmspc.ownedElements);
    nmspc.ownedMembers.opposite = NAMED_ELEMENT_NAMESPACE_ID;
}

export default class Namespace extends NamedElement {
    constructor(manager) {
        super(manager);
        assignNamespaceSets(this);
    }
}
