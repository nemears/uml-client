import { TypeInfo } from './element.js';
import NamedElement from "./namedElement.js";
import Singleton from "../singleton.js";
import { PACKAGEABLE_ELEMENT_ID, PACKAGEABLE_ELEMENT_OWNING_PACKAGE_ID, PACKAGE_PACKAGED_ELEMENTS_ID } from '../modelIds.js';

export function assignPackageableElementSets(pckgblEl) {
    pckgblEl.typeInfo = new TypeInfo(PACKAGEABLE_ELEMENT_ID, 'PackageableElement');
    pckgblEl.packageableElementTypeInfo = pckgblEl.typeInfo;
    pckgblEl.typeInfo.setBase(pckgblEl.namedElementTypeInfo);
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
