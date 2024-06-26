import { emitEl, isSubClassOfElement } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { isSubClassOfPackageableElement } from "./packageableElement";
import { emitTypedElement, isSubClassOfTypedElement } from "./typedElement";
import { isSubClassOfValueSpecification } from "./valueSpecification";
import LiteralSpecification , { isSubClassOfLiteralSpecification } from './literalSpecification';

export default class LiteralNull extends LiteralSpecification {
    elementType() {
        return 'literalNull';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfLiteralNull(elementType);
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
            literalNull: {}
        };
        emitEl(ret, 'literalNull', this)
        emitNamedEl(ret, 'literalNull', this);
        emitTypedElement(ret, 'literalNull', this);
        return ret;
    }
}

export function isSubClassOfLiteralNull(elementType) {
    return elementType === 'literalNull' || elementType === 'LITERAL_NULL';
}
