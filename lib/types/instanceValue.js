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
        this.elementTypes.add('InstanceValue');
    }

    elementType() {
        return 'InstanceValue';
    }

    emit() {
        const ret  = {
            InstanceValue: {}
        };
        emitEl(ret, 'InstanceValue', this);
        emitNamedEl(ret, 'InstanceValue', this);
        emitPackageableElement(ret, 'InstanceValue', this);
        emitInstanceValue(ret, 'InstanceValue', this);
        return ret;
    }
}

export function emitInstanceValue(data, alias, instanceValue) {
    if (instanceValue.instance.id() !== nullID()) {
        data[alias].instance = instanceValue.instance.id();
    }
}
