import Classifier, { emitClassifier, isSubClassOfClassifier } from "./classifier";
import Set from "./set";
import { emitPackageableElement, deletePackageableElementData, isSubClassOfPackageableElement } from "./packageableElement";
import { isSubClassOfNamespace } from "./namespace";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { emitEl, cleanupReferences, isSubClassOfElement } from "./element";

export default class Signal extends Classifier {
    constructor(manager) {
        super(manager);
        this.ownedAttributes = new Set(this);
        this.ownedAttributes.subsets(this.attributes);
        this.ownedAttributes.subsets(this.ownedMembers);
        this.sets['ownedAttributes'] = this.ownedAttributes;
        this.ownedAttributes.opposite = 'owningSignal';
    }

    elementType() {
        return 'signal';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfSignal(elementType);
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
            signal: {}
        };
        emitEl(ret, 'signal', this);
        emitNamedEl(ret, 'signal', this);
        emitPackageableElement(ret, 'signal', this);
        emitClassifier(ret, 'signal', this);
        emitSignal(ret, 'signal', this);
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
        await cleanupReferences(this);
    }
}

export function isSubClassOfSignal(elementType) {
    return elementType === 'signal' || elementType === 'SIGNAL';
}

export function emitSignal(data, alias, signal) {
    if (signal.ownedAttributes.size() > 0) {
        data[alias].ownedAttributes = [];
        for (let attributeID of signal.ownedAttributes.ids()) {
            data[alias].ownedAttributes.push(attributeID);
        }
    }
}