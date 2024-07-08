import NamedElement from "./namedElement.js";
import Singleton from "../singleton.js";

export const PACKAGEABLE_ELEMENT_OWNING_PACKAGE_ID = 'PL0LXBVcYZKI2s3zYLO4d_2R9_tV';
export const PACKAGE_PACKAGED_ELEMENTS_ID = 'F628ncQKADxo6FLtAlDOdlJfewLy';

export function assignPackageableElementSets(pckgblEl) {
    pckgblEl.owningPackage = new Singleton(pckgblEl);
    pckgblEl.owningPackage.definingFeature = PACKAGEABLE_ELEMENT_OWNING_PACKAGE_ID;
    pckgblEl.owningPackage.subsets(pckgblEl.namespace);
    pckgblEl.owningPackage.opposite = PACKAGE_PACKAGED_ELEMENTS_ID;
    pckgblEl.sets.set("owningPackage", pckgblEl.owningPackage);
    pckgblEl.sets.set(PACKAGEABLE_ELEMENT_OWNING_PACKAGE_ID, pckgblEl.owningPackage);
    pckgblEl.elementTypes.add('PackageableElement');
}

export default class PackageableElement extends NamedElement {
    constructor(manager) {
        super(manager);
        assignPackageableElementSets(this);
    }
}

export async function deletePackageableElementData(el) {
    if (el.owningPackage.has()) {
        await el.owningPackage.set(undefined);
    }
}

export function emitPackageableElement(data, alias, el) {
    if (el.owningPackage.has()) { 
        data['owningPackage'] = el.owningPackage.id();
    }
}
