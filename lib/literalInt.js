import { emitEl, isSubClassOfElement } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { emitTypedElement, isSubClassOfTypedElement } from "./typedElement";
import ValueSpecification from "./valueSpecification";

export default class LiteralInt extends ValueSpecification {
    constructor() {
        super()
        this.value = undefined;
    }

    elementType() {
        return "literalInt";
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfLiteralInt(elementType);
        if (!ret) {
            ret = isSubClassOfTypedElement(elementType);
        }
        if (!ret) {
            ret = isSubClassOfTypedElement(elementType);
        }
        if (!ret) {
            ret = isSubClassOfNamedElement(elementType);
        }
        if (!ret) {
            ret = isSubClassOfElement(elementType);
        }
        return ret;
    }

    emit() {
        let ret = {
            literalInt : {}
        };
        emitEl(ret, 'literalInt', this);
        emitNamedEl(ret, 'literalInt', this);
        emitTypedElement(ret, 'literalInt', this);
        emitLiteralInt(ret, 'literalInt', this);
        return ret;
    }
}

export function isSubClassOfLiteralInt(elementType) {
    return elementType === 'literalInt' || elementType === 'LITERAL_INT';
}

export function emitLiteralInt(data, alias, literalInt) {
    if (literalInt.value !== undefined) {
        data[alias].value = literalInt.value;
    }
}