import { isSubClassOfDirectedRelationship } from "./directedRelationship";
import { isSubClassOfRelationship } from "./relationship";
import { emitEl, isSubClassOfElement } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { emitPackageableElement, isSubClassOfPackageableElement } from "./packageableElement";
import Dependency, { emitDependency, isSubClassOfDependency } from "./dependency";

export default class Abstraction extends Dependency {
    constructor(manager) {
        super(manager);
    }

    elementType() {
        return 'abstraction';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfAbstraction(elementType);
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
            abstraction: {}
        };
        emitEl(ret, 'abstraction', this);
        emitNamedEl(ret, 'abstraction', this);
        emitPackageableElement(ret, 'abstraction', this);
        emitDependency(ret, 'abstraction', this);
        return ret;
    }
}

export function isSubClassOfAbstraction(elementType) {
    return elementType === 'abstraction' || elementType === 'ABSTRACTION';
}