import NamedElement from "./namedElement.js";
import Singleton from "../singleton.js";

export function assignPackageableElementSets(pckgblEl) {
    pckgblEl.owningPackage = new Singleton(pckgblEl);
    pckgblEl.owningPackage.subsets(pckgblEl.namespace);
    pckgblEl.owningPackage.opposite = "packagedElements";
    pckgblEl.sets.set("owningPackage", pckgblEl.owningPackage);
    pckgblEl.elementTypes.add('PackageableElement');
}

export default class PackageableElement extends NamedElement {
    constructor(manager) {
        super(manager);
        assignPackageableElementSets(this);
    }
}

export function deletePackageableElementData(el) {
    if (el.owningPackage.has()) {
        el.owningPackage.set(undefined);
    }
}

export function emitPackageableElement(data, alias, el) {
    if (el.owningPackage.has()) { 
        data['owningPackage'] = el.owningPackage.id();
    }
}
