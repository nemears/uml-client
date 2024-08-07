import InstanceSpecification, { emitInstanceSpecification, deleteInstanceSpecificationData } from './instanceSpecification.js'
import { emitEl } from "./element";
import { emitNamedEl } from "./namedElement";
import { deletePackageableElementData , emitPackageableElement } from "./packageableElement";
import Singleton from "../singleton";

export default class EnumerationLiteral extends InstanceSpecification {
    constructor() {
        super();
        this.enumeration = new Singleton(this);
        this.classifier = new Singleton(this);
        this.enumeration.subsets(this.namespace);
        this.enumeration.opposite = 'ownedLiterals';
        this.classifier.opposite = 'enumerationLiteral';
        this.sets.set('enumeration', this.enumeration);
        this.elementTypes.add('EnumerationLiteral');
    }

    elementType() {
        return 'EnumerationLiteral';
    }

    emit() {
        const ret = {
            EnumerationLiteral : {}
        };
        emitEl(ret, 'EnumerationLiteral', this);
        emitNamedEl(ret, 'EnumerationLiteral', this);
        emitPackageableElement(ret, 'EnumerationLiteral', this);
        emitInstanceSpecification(ret, 'EnumerationLiteral', this);
        emitEnumerationLiteral(ret, 'EnumerationLiteral', this);
        return ret;
    }

    async deleteData() {
        deleteEnumerationLiteralData(this);
        await deleteInstanceSpecificationData(this);
        deletePackageableElementData(this);
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
