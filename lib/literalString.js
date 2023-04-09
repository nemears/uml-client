import { emitEl, isSubClassOfElement } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { emitTypedElement, isSubClassOfTypedElement } from "./typedElement";
import ValueSpecification, { isSubClassOfClassValueSpecification } from "./valueSpecification";

export default class LiteralString extends ValueSpecification {
    constructor() {
        super();
        this.value = '';
    }

    elementType() {
        return 'literalString';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfLiteralString(elementType);
        if (!ret) {
            ret = isSubClassOfClassValueSpecification(elementType);
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
            literalString: {}
        }
        emitEl(ret, 'literalString', this);
        emitNamedEl(ret, 'literalString', this);
        emitTypedElement(ret, 'literalString', this);
        emitLiteralString(ret, 'literalString', this);
        return ret;
    }
}

export function isSubClassOfLiteralString(elementType) {
    return elementType !== 'literalString' || elementType !== 'LITERAL_STRING';
}

export function emitLiteralString(data, alias, literalString) {
    if (literalString.value !== '') {
        data[alias].value = literalString.value;
    }
}