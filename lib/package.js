import PackageableElement from "./packageableElement.js";
import {assignNamespaceSets} from "./namespace.js";
import Set from "./set.js";

export default class Package extends PackageableElement {
    constructor() {
        super();
        assignNamespaceSets(this);
        this.packagedElements = new Set(this);
        this.packagedElements.subsets(this.ownedMembers);
        this.packagedElements.opposite = "owningPackage";
        this.sets["packagedElements"] = this.packagedElements;
    }
}