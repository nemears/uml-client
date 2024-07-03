import { emitEl } from "./element";
import { emitNamedEl } from "./namedElement";
import { emitPackageableElement } from "./packageableElement";
import { emitTypedElement } from "./typedElement";
import LiteralSpecification from './literalSpecification';

export default class LiteralBool extends LiteralSpecification {
    constructor(manager) {
        super(manager)
        this.value = 0;
        this.elementTypes.add('LiteralBool');
    }

    elementType() {
        return "LiteralBool";
    }

    emit() {
        let ret = {
            literalBool: {}
        };
        emitEl(ret, 'literalBool', this);
        emitNamedEl(ret, 'literalBool', this);
        emitTypedElement(ret, 'literalBool', this);
        emitPackageableElement(ret, 'literalBool', this);
        emitLiteralBool(ret, 'literalBool', this);
        return ret;
    }
}

export function emitLiteralBool(data, alias, literalBool) {
    if (literalBool.value !== undefined) {
        data[alias].value = literalBool.value;
    }
}
