import { TypeInfo } from './element';
import NamedElement from "./namedElement.js";
import Singleton from "../singleton.js";
import { PACKAGEABLE_ELEMENT_OWNING_PACKAGE_ID, PACKAGE_PACKAGED_ELEMENTS_ID } from '../modelIds';

export function assignPackageableElementSets(pckgblEl) {
    const base = pckgblEl.typeInfo;
    pckgblEl.typeInfo = new TypeInfo('PackageableElement');
    pckgblEl.typeInfo.setBase(base);
    pckgblEl.owningPackage = new Singleton(pckgblEl, PACKAGEABLE_ELEMENT_OWNING_PACKAGE_ID, 'owningPackage');
    pckgblEl.owningPackage.subsets(pckgblEl.namespace);
    pckgblEl.owningPackage.opposite = PACKAGE_PACKAGED_ELEMENTS_ID;
}

export default class PackageableElement extends NamedElement {
    constructor(manager) {
        super(manager);
        assignPackageableElementSets(this);
    }
}
