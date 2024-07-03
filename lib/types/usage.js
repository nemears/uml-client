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
            usage: {}
        };
        emitEl(ret, 'usage', this);
        emitNamedEl(ret, 'usage', this);
        emitPackageableElement(ret, 'usage', this);
        emitDependency(ret, 'usage', this);
        return ret;
    }
}
