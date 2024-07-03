import { emitEl } from "./element";
import { emitNamedEl } from "./namedElement";
import { emitPackageableElement } from "./packageableElement";
import { emitDependency } from "./dependency";
import Abstraction from "./abstraction";

export default class Realization extends Abstraction {
    constructor(manager) {
        super(manager);
        this.elementTypes.add('Realization');
    }

    elementType() {
        return 'Realization';
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
