import Classifier, { emitClassifier, isSubClassOfClassifier } from "./classifier";
import Set from "./set";
import { emitPackageableElement, deletePackageableElementData, isSubClassOfPackageableElement } from "./packageableElement";
import { isSubClassOfNamespace } from "./namespace";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { emitEl, cleanupReferences, isSubClassOfElement } from "./element";

export default class Interface extends Classifier {
    constructor(manager) {
        super(manager);
        this.ownedAttributes = new Set(this);
        this.ownedOperations = new Set(this);
        this.ownedReceptions = new Set(this);
        this.ownedAttributes.subsets(this.attributes);
        this.ownedAttributes.subsets(this.ownedMembers);
        this.ownedOperations.subsets(this.features);
        //this.ownedOperations.subsets(this.redefinableElements);
        this.ownedOperations.subsets(this.ownedMembers);
        this.ownedReceptions.subsets(this.features);
        this.ownedReceptions.subsets(this.ownedMembers);
        this.sets['ownedAttributes'] = this.ownedAttributes;
        this.sets['ownedOperations'] = this.ownedOperations;
        this.sets['ownedReceptions'] = this.ownedReceptions;
        this.ownedAttributes.opposite = 'interface';
        this.ownedOperations.opposite = 'interface';
        this.ownedReceptions.opposite = 'interface';
    }

    elementType() {
        return 'interface';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfInterface(elementType);
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
            interface: {}
        };
        emitEl(ret, 'interface', this);
        emitNamedEl(ret, 'interface', this);
        emitPackageableElement(ret, 'interface', this);
        emitClassifier(ret, 'interface', this);
        emitInterface(ret, 'interface', this);
        return ret;
    }
    
    async deleteData() {
        let elsToDeleteA = [];
        let elsToDeleteO = [];
        let elsToDeleteR = [];
        for await (let el of this.ownedAttributes) {
            elsToDeleteA.push(el);
        }
        for await (let el of this.ownedOperations) {
            elsToDeleteO.push(el);
        }
        for await (let el of this.ownedReceptions) {
            elsToDeleteR.push(el);
        }
        for (let el of elsToDeleteA) {
            this.ownedAttributes.remove(el);
        }
        for (let el of elsToDeleteO) {
            this.ownedOperations.remove(el);
        }
        for (let el of elsToDeleteR) {
            this.ownedReceptions.remove(el);
        }
        deletePackageableElementData(this);
        await cleanupReferences(this);
    }
}

export function isSubClassOfInterface(elementType) {
    return elementType === 'interface' || elementType === 'INTERFACE';
}

export function emitInterface(data, alias, interfaceEl) {
    if (interfaceEl.ownedAttributes.size() > 0) {
        data[alias].ownedAttributes = [];
        for (let attributeID of interfaceEl.ownedAttributes.ids()) {
            data[alias].ownedAttributes.push(attributeID);
        }
    }
    if (interfaceEl.ownedOperations.size() > 0) {
        data[alias].ownedOperations = [];
        for (let featureID of interfaceEl.ownedOperations.ids()) {
            data[alias].ownedOperations.push(featureID);
        }
    }
    if (interfaceEl.ownedReceptions.size() > 0) {
        data[alias].ownedReceptions = [];
        for (let featureID of interfaceEl.ownedOperations.ids()) {
            data[alias].ownedOperations.push(featureID);
        }
    }
}