import Classifier, { emitClassifier } from "./classifier.js";
import UmlSet from "../set.js";
import { emitPackageableElement, deletePackageableElementData } from "./packageableElement.js";
import { emitNamedEl } from "./namedElement.js";
import { emitEl } from "./element.js";

export default class Interface extends Classifier {
    constructor(manager) {
        super(manager);
        this.ownedAttributes = new UmlSet(this);
        this.ownedOperations = new UmlSet(this);
        this.ownedReceptions = new UmlSet(this);
        this.ownedAttributes.subsets(this.attributes);
        this.ownedAttributes.subsets(this.ownedMembers);
        this.ownedOperations.subsets(this.features);
        //this.ownedOperations.subsets(this.redefinableElements);
        this.ownedOperations.subsets(this.ownedMembers);
        this.ownedReceptions.subsets(this.features);
        this.ownedReceptions.subsets(this.ownedMembers);
        this.sets.set('ownedAttributes', this.ownedAttributes);
        this.sets.set('ownedOperations', this.ownedOperations);
        this.sets.set('ownedReceptions', this.ownedReceptions);
        this.ownedAttributes.opposite = 'interface';
        this.ownedOperations.opposite = 'interface';
        this.ownedReceptions.opposite = 'interface';
        this.elementTypes.add('Interface');
    }

    elementType() {
        return 'Interface';
    }

    emit() {
        let ret = {
            Interface: {}
        };
        emitEl(ret, 'Interface', this);
        emitNamedEl(ret, 'Interface', this);
        emitPackageableElement(ret, 'Interface', this);
        emitClassifier(ret, 'Interface', this);
        emitInterface(ret, 'Interface', this);
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
    }
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
