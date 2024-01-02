import PackageableElement, { deletePackageableElementData, emitPackageableElement, isSubClassOfPackageableElement } from "./packageableElement.js";
import { assignNamespaceSets, isSubClassOfNamespace } from "./namespace.js";
import { cleanupReferences, emitEl, isSubClassOfElement } from "./element.js";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement.js";
import Set, { subsetContains } from "./set.js";

export default class Package extends PackageableElement {
    constructor(manager) {
        super(manager);
        assignNamespaceSets(this);
        this.packagedElements = new Set(this);
        this.packagedElements.subsets(this.ownedMembers);
        this.packagedElements.opposite = "owningPackage";
        this.ownedStereotypes = new Set(this);
        this.ownedStereotypes.subsets(this.packagedElements);
        this.sets["packagedElements"] = this.packagedElements;
        this.sets['ownedStereotypes'] = this.ownedStereotypes;
    }

    elementType() {
        return 'package';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfPackage(elementType);
        if (!ret) {
            ret = isSubClassOfPackageableElement(elementType);
        }
        if (!ret) {
            ret = isSubClassOfNamespace(elementType);
        }
        if (!ret) {
            ret = isSubClassOfNamedElement(elementType);
        }
        if (!ret) {
            ret = isSubClassOfElement(elementType);
        }
        return ret;
    }

    emit() {
        let ret = {
            package : {}
        };
        emitEl(ret, 'package', this);
        emitNamedEl(ret, 'package', this);
        emitPackageableElement(ret, 'package', this);
        emitPackage(ret, 'package', this);
        return ret;
    }

    async deleteData() {
        let elsToDelete = [];
        for await (let el of this.packagedElements) {
            elsToDelete.push(el);
        }
        for (let el of elsToDelete) {
            this.packagedElements.remove(el);
        }
        deletePackageableElementData(this);
        await cleanupReferences(this);
    }
}

export function isSubClassOfPackage(elementType) {
    return elementType === 'package' || elementType === 'PACKAGE';
}

export function emitPackage(data, alias, pckg) {
    if (pckg.packagedElements.size() > 0) {
        let emitSet = false;
        for (let id of pckg.packagedElements.ids()) {
            if (!subsetContains(pckg.ownedStereotypes, id)) {
                emitSet = true;
                break;
            }
        }
        if (emitSet) {
            data[alias].packagedElements = [];
            for (let el of pckg.packagedElements.ids()) {
                data[alias].packagedElements.push(el);
            }
        }
    }
    if (pckg.ownedStereotypes.size() > 0) {
        data[alias].ownedStereotypes = [];
        for (let el of pckg.ownedStereotypes.ids()) {
            data[alias].ownedStereotypes.push(el);
        } 
    }
}