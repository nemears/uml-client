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
            abstraction: {}
        };
        emitEl(ret, 'abstraction', this);
        emitNamedEl(ret, 'abstraction', this);
        emitPackageableElement(ret, 'abstraction', this);
        emitDependency(ret, 'abstraction', this);
        return ret;
    }
}
