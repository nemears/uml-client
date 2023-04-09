import { isSubClassOfClassifier } from "./classifier";
import { emitEl, isSubClassOfElement } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { isSubClassOfNamespace } from "./namespace";
import { deletePackageableElementData, emitPackageableElement, isSubClassOfPackageableElement } from "./packageableElement";
import StructuredClassifier, { emitStructuredClassifier, isSubClassOfStructuredClassifier } from "./structuredClassifier";

export default class Class extends StructuredClassifier {
    constructor(manager) {
        super(manager);
        this.ownedAttributes.opposite = 'class';
    }

    elementType() {
        return 'class';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfClass(elementType);
        if (!ret) {
            ret = isSubClassOfStructuredClassifier(elementType);
        }
        if (!ret) {
            ret = isSubClassOfClassifier(elementType);
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
        return ret;
    }

    emit() {
        let ret = {
            class: {}
        };
        emitEl(ret, 'class', this);
        emitNamedEl(ret, 'class', this);
        emitPackageableElement(ret, 'class', this);
        emitStructuredClassifier(ret, 'class', this);
        return ret;
    }

    async deleteData() {
        let elsToDelete = [];
        for await (let el of this.ownedAttributes) {
            elsToDelete.push(el);
        }
        for (let el of elsToDelete) {
            this.ownedAttributes.remove(el);
        }
        deletePackageableElementData(this);
    }
}

export function isSubClassOfClass(elementType) {
    return elementType === 'class' || elementType === 'CLASS';
}