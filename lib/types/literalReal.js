import { emitEl } from "./element";
import { emitNamedEl } from "./namedElement";
import { emitPackageableElement } from "./packageableElement";
import { emitTypedElement } from "./typedElement";
import LiteralSpecification from './literalSpecification';

export default class LiteralReal extends LiteralSpecification {
    constructor(manager) {
        super(manager);
        this.value = undefined;
        this.elementTypes.add('LiteralReal');
    }

    elementType() {
        return 'LiteralReal';
    }

    emit() {
        const ret = {
            literalReal: {}
        };
        emitEl(ret, 'literalReal', this)
        emitNamedEl(ret, 'literalReal', this);
        emitTypedElement(ret, 'literalReal', this);
        emitPackageableElement(ret, 'literalReal', this);
        emitLiteralReal(ret, 'literalReal', this);
        return ret;
    }
}

export function emitLiteralReal(data, alias, literalReal) {
    if (literalReal.value !== undefined) {
        data[alias].value = literalReal.value;
    }
}
