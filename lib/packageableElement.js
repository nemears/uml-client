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

export function deletePackageableElementData(el) {
    if (el.owningPackage.get() !== undefined) {
        el.owningPackage.set(null);
    }
}

export async function emitPackageableElement(data, el) {
    if (await el.owningPackage.get() !== undefined) {
        const owningPackage = await el.owningPackage.get();
        data['owningPackage'] = owningPackage.id;
    }
}