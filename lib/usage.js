import { isSubClassOfDirectedRelationship } from "./directedRelationship";
import { isSubClassOfRelationship } from "./relationship";
import { emitEl, isSubClassOfElement } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { emitPackageableElement, isSubClassOfPackageableElement } from "./packageableElement";
import Dependency, { emitDependency, isSubClassOfDependency } from "./dependency";

export default class Usage extends Dependency {
    constructor(manager) {
        super(manager);
    }

    elementType() {
        return 'usage';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfUsage(elementType);
        if (!ret) {
            ret = isSubClassOfDependency(elementType);
        }
        if (!ret) {
            ret = isSubClassOfDirectedRelationship(elementType);
        }
        if (!ret) {
            ret = isSubClassOfRelationship(elementType);
        }
        if (!ret) {
            ret = isSubClassOfPackageableElement(elementType);
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
            usage: {}
        };
        emitEl(ret, 'usage', this);
        emitNamedEl(ret, 'usage', this);
        emitPackageableElement(ret, 'usage', this);
        emitDependency(ret, 'usage', this);
        return ret;
    }
}

export function isSubClassOfUsage(elementType) {
    return elementType === 'usage' || elementType === 'USAGE';
}