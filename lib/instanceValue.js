import { emitEl, isSubClassOfElement, nullID } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { emitPackageableElement } from "./packageableElement";
import { isSubClassOfPackageableElement } from "./packageableElement";
import Singleton from "./singleton";
import ValueSpecification, { isSubClassOfValueSpecification } from "./valueSpecification";

export default class InstanceValue extends ValueSpecification {
    constructor(manager) {
        super(manager);
        this.instance = new Singleton(this);
        this.sets['instance'] = this.instance;
    }

    elementType() {
        return 'instanceValue';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfInstanceValue(elementType);
        if (!ret) {
            ret = isSubClassOfValueSpecification(elementType);
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
        const ret  = {
            instanceValue: {}
        };
        emitEl(ret, 'instanceValue', this);
        emitNamedEl(ret, 'instanceValue', this);
        emitPackageableElement(ret, 'instanceValue', this);
        emitInstanceValue(ret, 'instanceValue', this);
        return ret;
    }
}

export function isSubClassOfInstanceValue(elementType) {
    return elementType === 'instanceValue' || elementType === 'INSTANCE_VALUE';
}

export function emitInstanceValue(data, alias, instanceValue) {
    if (instanceValue.instance.id() !== nullID()) {
        data[alias].instance = instanceValue.instance.id();
    }
}
