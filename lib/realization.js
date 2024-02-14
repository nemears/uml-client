import { isSubClassOfDirectedRelationship } from "./directedRelationship";
import { isSubClassOfRelationship } from "./relationship";
import { emitEl, isSubClassOfElement } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { emitPackageableElement, isSubClassOfPackageableElement } from "./packageableElement";
import { emitDependency, isSubClassOfDependency } from "./dependency";
import Abstraction, {isSubClassOfAbstraction} from "./abstraction";

export default class Realization extends Abstraction {
    constructor(manager) {
        super(manager);
    }

    elementType() {
        return 'realization';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfRealization(elementType);
        if (!ret) {
            ret = isSubClassOfAbstraction(elementType);
        }
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
            realization: {}
        };
        emitEl(ret, 'realization', this);
        emitNamedEl(ret, 'realization', this);
        emitPackageableElement(ret, 'realization', this);
        emitDependency(ret, 'realization', this);
        return ret;
    }
}

export function isSubClassOfRealization(elementType) {
    return elementType === 'realization' || elementType === 'REALIZATION';
}