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
            Realization: {}
        };
        emitEl(ret, 'Realization', this);
        emitNamedEl(ret, 'Realization', this);
        emitPackageableElement(ret, 'Realization', this);
        emitDependency(ret, 'Realization', this);
        return ret;
    }
}
