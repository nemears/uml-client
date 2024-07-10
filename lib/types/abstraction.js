import { emitEl } from "./element";
import { emitNamedEl } from "./namedElement";
import { emitPackageableElement } from "./packageableElement";
import Dependency, { emitDependency } from "./dependency";

export default class Abstraction extends Dependency {
    constructor(manager) {
        super(manager);
        this.elementTypes.add('Abstraction');
    }

    elementType() {
        return 'Abstraction';
    }

    emit() {
        let ret = {
            Abstraction: {}
        };
        emitEl(ret, 'Abstraction', this);
        emitNamedEl(ret, 'Abstraction', this);
        emitPackageableElement(ret, 'Abstraction', this);
        emitDependency(ret, 'Abstraction', this);
        return ret;
    }
}
