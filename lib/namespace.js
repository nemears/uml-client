import NamedElement from "./namedElement";

export default class Namespace extends NamedElement {
    constructor() {
        this.members = new Set(this);
        this.ownedMembers = new Set(this);
        this.ownedMembers.subsets(this.members);
        this.ownedMembers.subsets(this.ownedElements);
    }
}