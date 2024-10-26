import Classifier, { emitClassifier } from "./classifier.js";
import UmlSet from "../set.js";
import { emitPackageableElement, deletePackageableElementData } from "./packageableElement.js";
import { emitNamedEl } from "./namedElement.js";
import { emitEl } from "./element.js";

export default class Signal extends Classifier {
    constructor(manager) {
        super(manager);
        this.ownedAttributes = new UmlSet(this);
        this.ownedAttributes.subsets(this.attributes);
        this.ownedAttributes.subsets(this.ownedMembers);
        this.sets.set('ownedAttributes', this.ownedAttributes);
        this.ownedAttributes.opposite = 'owningSignal';
        this.elementTypes.add('Signal');
    }

    elementType() {
        return 'Signal';
    }

    emit() {
        let ret = {
            Signal: {}
        };
        emitEl(ret, 'Signal', this);
        emitNamedEl(ret, 'Signal', this);
        emitPackageableElement(ret, 'Signal', this);
        emitClassifier(ret, 'Signal', this);
        emitSignal(ret, 'Signal', this);
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

export function emitSignal(data, alias, signal) {
    if (signal.ownedAttributes.size() > 0) {
        data[alias].ownedAttributes = [];
        for (let attributeID of signal.ownedAttributes.ids()) {
            data[alias].ownedAttributes.push(attributeID);
        }
    }
}
