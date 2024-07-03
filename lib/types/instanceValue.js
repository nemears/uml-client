import { emitEl, nullID } from "./element";
import { emitNamedEl } from "./namedElement";
import { emitPackageableElement } from "./packageableElement";
import Singleton from "../singleton";
import ValueSpecification from "./valueSpecification";

export default class InstanceValue extends ValueSpecification {
    constructor(manager) {
        super(manager);
        this.instance = new Singleton(this);
        this.sets.set('instance', this.instance);
        this.elementType.add('InstanceValue');
    }

    elementType() {
        return 'InstanceValue';
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

export function emitInstanceValue(data, alias, instanceValue) {
    if (instanceValue.instance.id() !== nullID()) {
        data[alias].instance = instanceValue.instance.id();
    }
}
