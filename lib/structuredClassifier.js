import Classifier from "./classifier";
import Set from "./set";

export default class StructuredClassifier extends Classifier {
    constructor(manager) {
        super(manager);
        this.ownedAttributes = new Set(this);
        this.ownedAttributes.subsets(this.attributes);
        this.ownedAttributes.subsets(this.ownedMembers);
        this.sets['ownedAttributes'] = this.ownedAttributes;
    }
}

export function isSubClassOfStructuredClassifier(elementType) {
    return elementType === 'structuredClassifier' || elementType === 'STRUCTURED_CLASSIFIER';
}

export function emitStructuredClassifier(data, alias, structuredClassifier) {
    if (structuredClassifier.ownedAttributes.size() > 0) {
        data[alias].ownedAttributes = [];
        for (let attributeID of structuredClassifier.ownedAttributes.ids()) {
            data[alias].ownedAttributes.push(attributeID);
        }
    }
}