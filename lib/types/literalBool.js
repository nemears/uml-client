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
            LiteralBool: {}
        };
        emitEl(ret, 'LiteralBool', this);
        emitNamedEl(ret, 'LiteralBool', this);
        emitTypedElement(ret, 'LiteralBool', this);
        emitPackageableElement(ret, 'LiteralBool', this);
        emitLiteralBool(ret, 'LiteralBool', this);
        return ret;
    }
}

export function emitLiteralBool(data, alias, literalBool) {
    if (literalBool.value !== undefined) {
        data[alias].value = literalBool.value;
    }
}
