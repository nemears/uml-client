import Class, { isSubClassOfClass } from "./class";
import { emitClassifier } from "./classifier";
import { emitEl, isSubClassOfElement } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { isSubClassOfNamespace } from "./namespace";
import { emitPackageableElement, isSubClassOfPackageableElement } from "./packageableElement";
import { emitStructuredClassifier, isSubClassOfStructuredClassifier } from "./structuredClassifier";

export default class Stereotype extends Class {
    elementType() {
        return 'stereotype';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfStereotype(elementType);
        if (!ret) {
            ret = isSubClassOfClass(elementType);
        }
        if (!ret) {
            ret = isSubClassOfStructuredClassifier(elementType);
        }
        if (!ret) {
            ret = isSubClassOfPackageableElement(elementType);
        }
        if (!ret) {
            ret = isSubClassOfNamespace(elementType);
        }
        if (!ret) {
            ret = isSubClassOfNamedElement(elementType);
        }
        if (!ret) {
            ret = isSubClassOfElement(elementType);
        }
    }

    emit() {
        const ret = {
            stereotype : {}
        };
        emitEl(ret, 'stereotype', this);
        emitNamedEl(ret, 'stereotype', this);
        emitPackageableElement(ret, 'stereotype', this);
        emitClassifier(ret, 'stereotype', this);
        emitStructuredClassifier(ret, 'stereotype', this);
        return ret;
    }
}

export function isSubClassOfStereotype(elementType) {
    return elementType === 'stereotype' || elementType === 'STEREOTYPE';
}