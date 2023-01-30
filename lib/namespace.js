import NamedElement from "./namedElement.js";
import Set from "./set.js"

export default class Namespace extends NamedElement {
    constructor() {
        super();
        this.members = new Set(this);
        this.ownedMembers = new Set(this);
        this.ownedMembers.subsets(this.members);
        this.ownedMembers.subsets(this.ownedElements);
        this.ownedMembers.opposite = "namespace";
        this.sets["members"] = this.members;
        this.sets["ownedMembers"] = this.ownedMembers;
    }
}