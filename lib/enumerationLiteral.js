import InstanceSpecification, { emitInstanceSpecification, deleteInstanceSpecificationData, isSubClassOfInstanceSpecification } from './instanceSpecification.js'
import { cleanupReferences, emitEl, isSubClassOfElement } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { emitPackageableElement, isSubClassOfPackageableElement } from "./packageableElement";
import { deletePackageableElementData } from "./packageableElement";
import Singleton from "./singleton";

export default class EnumerationLiteral extends InstanceSpecification {
    constructor() {
        super();
        this.enumeration = new Singleton(this);
        this.classifier = new Singleton(this);
        this.enumeration.subsets(this.namespace);
        this.enumeration.opposite = 'ownedLiterals';
        this.classifier.opposite = 'enumerationLiteral';
        this.sets['enumeration'] = this.enumeration;
    }

    elementType() {
        return 'enumerationLiteral';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfEnumerationLiteral(elementType);
        if (!ret) {
            ret = isSubClassOfInstanceSpecification(elementType);
        }
        if (!ret) {
            ret = isSubClassOfPackageableElement(elementType);
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
            enumerationLiteral : {}
        };
        emitEl(ret, 'enumerationLiteral', this);
        emitNamedEl(ret, 'enumerationLiteral', this);
        emitPackageableElement(ret, 'enumerationLiteral', this);
        emitInstanceSpecification(ret, 'enumerationLiteral', this);
        emitEnumerationLiteral(ret, 'enumerationLiteral', this);
        return ret;
    }

    async deleteData() {
        deleteEnumerationLiteralData(this);
        await deleteInstanceSpecificationData(this);
        deletePackageableElementData(this);
        await cleanupReferences(this);
    }

}

export function deleteEnumerationLiteralData(enumerationLiteral) {
    if (enumerationLiteral.enumeration.has()) {
        enumerationLiteral.enumeration.set(null);
    }
}

export function emitEnumerationLiteral(data, alias, enumerationLiteral) {
    if (enumerationLiteral.enumeration.has()) {
        data.enumeration = enumerationLiteral.enumeration.id();
    } 
}

export function isSubClassOfEnumerationLiteral(elementType) {
    return elementType === 'enumerationLiteral' || elementType === 'ENUMERATION_LITERAL';
}
