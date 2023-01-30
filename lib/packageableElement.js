import NamedElement from "./namedElement.js";
import Singleton from "./singleton.js";

export default class PackageableElement extends NamedElement {
    constructor() {
        super();
        this.owningPackage = new Singleton(this);
        this.owningPackage.subsets(this.namespace);
        this.owningPackage.opposite ="packagedElements";
        this.sets["owningPackage"] = this.owningPackage;
    }
}