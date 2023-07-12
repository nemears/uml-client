import { emitEl, isSubClassOfElement } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { deletePackageableElementData, emitPackageableElement, isSubClassOfPackageableElement } from "./packageableElement";
import { emitTypedElement, isSubClassOfTypedElement } from "./typedElement";
import ValueSpecification, { deleteValueSpecificationData, isSubClassOfValueSpecification } from "./valueSpecification";

export default class LiteralString extends ValueSpecification {
    constructor(manager) {
        super(manager);
        this.value = '';
    }

    elementType() {
        return 'literalString';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfLiteralString(elementType);
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
            literalString: {}
        }
        emitEl(ret, 'literalString', this);
        emitNamedEl(ret, 'literalString', this);
        emitTypedElement(ret, 'literalString', this);
        emitPackageableElement(ret, 'literalString', this);
        emitLiteralString(ret, 'literalString', this);
        return ret;
    }

    async deleteData() {
        await deleteValueSpecificationData(this);
        await deletePackageableElementData(this);
    }
}

export function isSubClassOfLiteralString(elementType) {
    return elementType === 'literalString' || elementType === 'LITERAL_STRING';
}

export function emitLiteralString(data, alias, literalString) {
    if (literalString.value !== '') {
        data[alias].value = literalString.value;
    }
}
