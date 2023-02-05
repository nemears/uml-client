import { emitEl } from "./element";
import { emitNamedEl } from "./namedElement";
import PackageableElement from "./packageableElement";

export default class Class extends PackageableElement {
    constructor() {
        super();
    }

    emit() {
        let ret = {
            class: {}
        };
        emitEl(ret.class, this);
        emitNamedEl(ret.class, this);
        return ret;
    }
}