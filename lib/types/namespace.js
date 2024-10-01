import { TypeInfo } from './element';
import NamedElement from "./namedElement.js";
import UmlSet from "../set.js";
import { NAMED_ELEMENT_NAMESPACE_ID, NAMESPACE_ID, NAMESPACE_MEMBERS_ID, NAMESPACE_OWNED_MEMBERS_ID }  from '../modelIds';


export function assignNamespaceSets(nmspc) {
    nmspc.typeInfo = new TypeInfo(NAMESPACE_ID, 'Namespace');
    nmspc.namespaceTypeInfo = nmspc.typeInfo;
    nmspc.typeInfo.setBase(nmspc.namedElementTypeInfo);
    nmspc.members = new UmlSet(nmspc, NAMESPACE_MEMBERS_ID, 'members');
    nmspc.members.readonly = true;
    nmspc.ownedMembers = new UmlSet(nmspc, NAMESPACE_OWNED_MEMBERS_ID, 'ownedMembers');
    nmspc.ownedMembers.readonly = true;
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
