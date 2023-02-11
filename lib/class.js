import { emitEl } from "./element";
import { emitNamedEl } from "./namedElement";
import PackageableElement from "./packageableElement";

export default class Class extends PackageableElement {
    constructor() {
        super();
    }

    elementType() {
        return 'class';
    }

    async emit() {
        let ret = {
            class: {}
        };
        await emitEl(ret.class, this);
        await emitNamedEl(ret.class, this);
        return ret;
    }
}