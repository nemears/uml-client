import Association, { emitAssociation, isSubClassOfAssociation } from "./association";
import { emitClassifier, isSubClassOfClassifier } from "./classifier";
import { emitEl, isSubClassOfElement, nullID } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { isSubClassOfNamespace } from "./namespace";
import { emitPackageableElement, isSubClassOfPackageableElement } from "./packageableElement";
import { isSubClassOfRelationship } from "./relationship";
import Singleton from "./singleton";

export default class Extension extends Association {
    constructor(manager) {
        super(manager);
        this.ownedEnd = new Singleton(this);
        this.ownedEnd.subsets(this.ownedEnds);
        this.sets['ownedEnd'] = this.ownedEnds;
        this.metaClass = 'ELEMENT'
    }

    elementType() {
        return 'extension';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfExtension(elementType);
        if (!ret) {
            ret = isSubClassOfAssociation(elementType);
        }
        if (!ret) {
            ret = isSubClassOfClassifier(elementType);
        }
        if (!ret) {
            ret = isSubClassOfRelationship(elementType);
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
        const ret = {
            extension: {}
        };
        emitEl(ret, 'extension', this);
        emitNamedEl(ret, 'extension', this);
        emitPackageableElement(ret, 'extension', this);
        emitClassifier(ret, 'extension', this);
        emitAssociation(ret, 'extension', this);
        return ret;
    }
}

export function isSubClassOfExtension(elementType) {
    return elementType === 'extension' || elementType === 'EXTENSION';
}

export function emitExtension(data, alias, extension) {
    if (extension.ownedEnd.id() != nullID()) {
        data[alias].ownedEnd = extension.ownedEnd.id();
    }
    data[alias].metaClass = extension.metaClass;
}