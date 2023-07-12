import DataType, { emitDataType, isSubClassOfDataType } from "./dataType";
import { emitEl, isSubClassOfElement } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { isSubClassOfNamespace } from "./namespace";
import { emitClassifier, isSubClassOfClassifier } from "./classifier";
import { emitPackageableElement, isSubClassOfPackageableElement } from "./packageableElement";
import Set from "./set.js"

export default class Enumeration extends DataType {

    constructor() {
        super();
        this.ownedLiterals = new Set(this);
        this.ownedLiterals.subsets(this.ownedMembers);
        this.ownedLiterals.opposite = 'enumeration';
        this.sets['ownedLiterals'] = this.ownedLiterals;
    }

    elementType() {
        return 'enumeration';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfEnumeration(elementType);
        if (!ret) {
            ret = isSubClassOfDataType(elementType);
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
            enumeration: {}
        };
        emitEl(ret, 'enumeration', this);
        emitNamedEl(ret, 'enumeration', this);
        emitPackageableElement(ret, 'enumeration', this);
        emitClassifier(ret, 'enumeration', this);
        emitDataType(ret, 'enumeration', this);
        emitEnumeration(ret, 'enumeration', this);
        return ret;
    }
}

export function emitEnumeration(data, alias, el) {
    if (el.ownedLiterals.size() > 0) {
        data[alias].ownedLiterals = [];
        for (const id of el.ownedLiterals.ids()) {
            data[alias].ownedLiterals.push(id);
        }
    }
}

export function isSubClassOfEnumeration(elementType) {
    return elementType === 'enumeration' || elementType === 'ENUMERATION';
}
