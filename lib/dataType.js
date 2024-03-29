import Classifier, { emitClassifier, isSubClassOfClassifier } from "./classifier";
import Set from "./set";
import { emitPackageableElement, deletePackageableElementData, isSubClassOfPackageableElement } from "./packageableElement";
import { isSubClassOfNamespace } from "./namespace";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { emitEl, isSubClassOfElement } from "./element";

export default class DataType extends Classifier {
    constructor(manager) {
        super(manager);
        this.ownedAttributes = new Set(this);
        this.ownedOperations = new Set(this);
        this.ownedAttributes.subsets(this.attributes);
        this.ownedAttributes.subsets(this.ownedMembers);
        this.ownedOperations.subsets(this.features);
        //this.ownedOperations.subsets(this.redefinableElements);
        this.ownedOperations.subsets(this.ownedMembers);
        this.sets['ownedAttributes'] = this.ownedAttributes;
        this.sets['ownedOperations'] = this.ownedOperations;
        this.ownedAttributes.opposite = 'dataType';
        this.ownedOperations.opposite = 'dataType';
    }

    elementType() {
        return 'dataType';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfDataType(elementType);
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
            dataType: {}
        };
        emitEl(ret, 'dataType', this);
        emitNamedEl(ret, 'dataType', this);
        emitPackageableElement(ret, 'dataType', this);
        emitClassifier(ret, 'dataType', this);
        emitDataType(ret, 'dataType', this);
        return ret;
    }
    
    async deleteData() {
        let elsToDeleteA = [];
        let elsToDeleteO = [];
        for await (let el of this.ownedAttributes) {
            elsToDeleteA.push(el);
        }
        for await (let el of this.ownedOperations) {
            elsToDeleteO.push(el);
        }
        for (let el of elsToDeleteA) {
            this.ownedAttributes.remove(el);
        }
        for (let el of elsToDeleteO) {
            this.ownedOperations.remove(el);
        }
        deletePackageableElementData(this);
    }
}

export function isSubClassOfDataType(elementType) {
    return elementType === 'dataType' || elementType === 'DATA_TYPE';
}

export function emitDataType(data, alias, dataType) {
    if (dataType.ownedAttributes.size() > 0) {
        data[alias].ownedAttributes = [];
        for (let attributeID of dataType.ownedAttributes.ids()) {
            data[alias].ownedAttributes.push(attributeID);
        }
    }
    if (dataType.ownedOperations.size() > 0) {
        data[alias].ownedOperations = [];
        for (let featureID of dataType.ownedOperations.ids()) {
            data[alias].ownedOperations.push(featureID);
        }
    }
}
