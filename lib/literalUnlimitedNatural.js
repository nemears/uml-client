import { emitEl, isSubClassOfElement } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { emitPackageableElement, isSubClassOfPackageableElement } from "./packageableElement";
import { emitTypedElement, isSubClassOfTypedElement } from "./typedElement";
import { isSubClassOfValueSpecification } from "./valueSpecification";
import LiteralSpecification , { isSubClassOfLiteralSpecification } from './literalSpecification';

export default class LiteralUnlimitedNatural extends LiteralSpecification {
    constructor(manager) {
        super(manager);
        this.value = 0;
    }

    elementType() {
        return 'literalUnlimitedNatural';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfLiteralUnlimitedNatural(elementType);
        if (!ret) {
            ret = isSubClassOfLiteralSpecification(elementType);
        }
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
            literalUnlimitedNatural: {}
        };
        emitEl(ret, 'literalUnlimitedNatural', this);
        emitNamedEl(ret, 'literalUnlimitedNatural', this);
        emitTypedElement(ret, 'literalUnlimitedNatural', this);
        emitPackageableElement(ret, 'literalUnlimitedNatural', this);
        emitLiteralUnlimitedNatural(ret, 'literalUnlimitedNatural', this);
        return ret;
    }
}

export function isSubClassOfLiteralUnlimitedNatural(elementType) {
    return elementType === 'literalUnlimitedNatural' || elementType === 'LITERAL_UNLIMITED_NATURAL';
}

export function emitLiteralUnlimitedNatural(data, alias, literalUnlimitedNatural) {
    data[alias].value = literalUnlimitedNatural.value;
}
