import { emitEl } from "./element";
import { emitNamedEl } from "./namedElement";
import { emitPackageableElement } from "./packageableElement";
import Dependency, { emitDependency } from "./dependency";

export default class Usage extends Dependency {
    constructor(manager) {
        super(manager);
        this.elementTypes.add('Usage');
    }

    elementType() {
        return 'Usage';
    }

    emit() {
        let ret = {
            Usage: {}
        };
        emitEl(ret, 'Usage', this);
        emitNamedEl(ret, 'Usage', this);
        emitPackageableElement(ret, 'Usage', this);
        emitDependency(ret, 'Usage', this);
        return ret;
    }
}
