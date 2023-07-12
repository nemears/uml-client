import { emitEl, isSubClassOfElement } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { deletePackageableElementData, emitPackageableElement, isSubClassOfPackageableElement } from "./packageableElement";
import { emitTypedElement, isSubClassOfTypedElement } from "./typedElement";
import ValueSpecification, { deleteValueSpecificationData, isSubClassOfValueSpecification } from "./valueSpecification";

export default class LiteralInt extends ValueSpecification {
    constructor(manager) {
        super(manager)
        this.value = 0;
    }

    elementType() {
        return "literalInt";
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfLiteralInt(elementType);
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
        let ret = {
            literalInt : {}
        };
        emitEl(ret, 'literalInt', this);
        emitNamedEl(ret, 'literalInt', this);
        emitTypedElement(ret, 'literalInt', this);
        emitPackageableElement(ret, 'literalInt', this);
        emitLiteralInt(ret, 'literalInt', this);
        return ret;
    }

    async deleteData() {
        await deleteValueSpecificationData(this);
        await deletePackageableElementData(this);
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
