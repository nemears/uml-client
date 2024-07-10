import { emitEl } from "./element";
import { emitNamedEl } from "./namedElement";
import { emitPackageableElement } from "./packageableElement";
import { emitTypedElement } from "./typedElement";
import LiteralSpecification from './literalSpecification';

export default class LiteralInt extends LiteralSpecification {
    constructor(manager) {
        super(manager)
        this.value = 0;
        this.elementTypes.add('LiteralInt');
    }

    elementType() {
        return "LiteralInt";
    }

    emit() {
        let ret = {
            LiteralInt : {}
        };
        emitEl(ret, 'LiteralInt', this);
        emitNamedEl(ret, 'LiteralInt', this);
        emitTypedElement(ret, 'LiteralInt', this);
        emitPackageableElement(ret, 'LiteralInt', this);
        emitLiteralInt(ret, 'LiteralInt', this);
        return ret;
    }
}

export function emitLiteralInt(data, alias, literalInt) {
    if (literalInt.value !== undefined) {
        data[alias].value = literalInt.value;
    }
}
