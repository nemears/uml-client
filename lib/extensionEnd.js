import { emitEl, isSubClassOfElement } from "./element";
import { emitMultiplicityElement, isSubClassOfMultiplicityElement } from "./multiplicityElement";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import Property, { emitProperty, isSubClassOfProperty } from "./property";
import { emitTypedElement, isSubClassOfTypedElement } from "./typedElement";

export default class ExtensionEnd extends Property {
    elementType() {
        return 'extensionEnd';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfExtensionEnd(elementType);
        if (!ret) {
            ret = isSubClassOfProperty(elementType);
        }
        if (!ret) {
            ret = isSubClassOfTypedElement(elementType);
        }
        if (!ret) {
            ret = isSubClassOfMultiplicityElement(elementType);
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
            extensionEnd: {}
        };
        emitEl(ret, 'extensionEnd', this);
        emitNamedEl(ret, 'extensionEnd', this);
        emitTypedElement(ret, 'extensionEnd', this);
        emitMultiplicityElement(ret, 'extensionEnd', this);
        emitProperty(ret, 'extensionEnd', this);
        return ret;
    }
}

export function isSubClassOfExtensionEnd(elementType) {
    return elementType === 'extensionEnd' || elementType === 'EXTENSION_END';
}