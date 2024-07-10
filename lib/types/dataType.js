import Classifier, { emitClassifier } from "./classifier";
import UmlSet from "../set";
import { emitPackageableElement, deletePackageableElementData } from "./packageableElement";
import { emitNamedEl } from "./namedElement";
import { emitEl, deleteElementData } from "./element";

export default class DataType extends Classifier {
    constructor(manager) {
        super(manager);
        this.ownedAttributes = new UmlSet(this);
        this.ownedOperations = new UmlSet(this);
        this.ownedAttributes.subsets(this.attributes);
        this.ownedAttributes.subsets(this.ownedMembers);
        this.ownedOperations.subsets(this.features);
        //this.ownedOperations.subsets(this.redefinableElements);
        this.ownedOperations.subsets(this.ownedMembers);
        this.sets.set('ownedAttributes', this.ownedAttributes);
        this.sets.set('ownedOperations', this.ownedOperations);
        this.ownedAttributes.opposite = 'dataType';
        this.ownedOperations.opposite = 'dataType';
        this.elementTypes.add('DataType');
    }

    elementType() {
        return 'DataType';
    }

    emit() {
        let ret = {
            DataType: {}
        };
        emitEl(ret, 'DataType', this);
        emitNamedEl(ret, 'DataType', this);
        emitPackageableElement(ret, 'DataType', this);
        emitClassifier(ret, 'DataType', this);
        emitDataType(ret, 'DataType', this);
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
            await this.ownedAttributes.remove(el);
        }
        for (let el of elsToDeleteO) {
            await this.ownedOperations.remove(el);
        }
        await deletePackageableElementData(this);
        await deleteElementData(this);
    }
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
