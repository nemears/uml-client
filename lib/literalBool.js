import { emitEl, isSubClassOfElement } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { deletePackageableElementData, emitPackageableElement, isSubClassOfPackageableElement } from "./packageableElement";
import { emitTypedElement, isSubClassOfTypedElement } from "./typedElement";
import ValueSpecification, { deleteValueSpecificationData, isSubClassOfValueSpecification } from "./valueSpecification";

export default class LiteralBool extends ValueSpecification {
    constructor(manager) {
        super(manager)
        this.value = 0;
    }

    elementType() {
        return "literalBool";
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfLiteralBool(elementType);
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
            literalBool: {}
        };
        emitEl(ret, 'literalBool', this);
        emitNamedEl(ret, 'literalBool', this);
        emitTypedElement(ret, 'literalBool', this);
        emitPackageableElement(ret, 'literalBool', this);
        emitLiteralBool(ret, 'literalBool', this);
        return ret;
    }

    async deleteData() {
        await deleteValueSpecificationData(this);
        await deletePackageableElementData(this);
    } 
}

export function isSubClassOfLiteralBool(elementType) {
    return elementType === 'literalBool' || elementType === 'LITERAL_BOOL';
}

export function emitLiteralBool(data, alias, literalBool) {
    if (literalBool.value !== undefined) {
        data[alias].value = literalBool.value;
    }
}