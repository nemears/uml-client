import { emitEl, isSubClassOfElement } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { emitPackageableElement, isSubClassOfPackageableElement } from "./packageableElement";
import { emitTypedElement, isSubClassOfTypedElement } from "./typedElement";
import ValueSpecification, { isSubClassOfValueSpecification } from "./valueSpecification";

export default class LiteralReal extends ValueSpecification {
    constructor(manager) {
        super(manager);
        this.value = undefined;
    }

    elementType() {
        return 'literalReal';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfLiteralReal(elementType);
        if (!ret) {
            ret = isSubClassOfValueSpecification(elementType);
        }
        if (!ret) {
            ret = isSubClassOfPackageableElement(elementType);
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

export function isSubClassOfLiteralReal(elementType) {
    return elementType === 'literalReal' || elementType === 'LITERAL_REAL';
}

export function emitLiteralReal(data, alias, literalReal) {
    if (literalReal.value !== undefined) {
        data[alias].value = literalReal.value;
    }
}
