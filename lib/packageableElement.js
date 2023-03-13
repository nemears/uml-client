import { nullID } from "./element.js";
import NamedElement from "./namedElement.js";
import Singleton from "./singleton.js";

export default class PackageableElement extends NamedElement {
    constructor(manager) {
        super(manager);
        this.owningPackage = new Singleton(this);
        this.owningPackage.subsets(this.namespace);
        this.owningPackage.opposite ="packagedElements";
        this.sets["owningPackage"] = this.owningPackage;
    }
}

export function isSubClassOfPackageableElement(elementType) {
    return elementType === 'packageableElement' || elementType === 'PACKAGEABLE_ELEMENT';
}

export function deletePackageableElementData(el) {
    if (el.owningPackage.has()) {
        el.owningPackage.set(null);
    }
}

export function emitPackageableElement(data, alias, el) {
    if (el.owningPackage.has()) { 
        data['owningPackage'] = el.owningPackage.id();
    }
}