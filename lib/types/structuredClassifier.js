import Classifier from "./classifier";
import UmlSet from "../set";

export default class StructuredClassifier extends Classifier {
    constructor(manager) {
        super(manager);
        this.ownedAttributes = new UmlSet(this);
        this.ownedAttributes.subsets(this.attributes);
        this.ownedAttributes.subsets(this.ownedMembers);
        this.sets.set('ownedAttributes', this.ownedAttributes);
        this.elementTypes.add('StructuredClassifier');
    }
}

export function emitStructuredClassifier(data, alias, structuredClassifier) {
    if (structuredClassifier.ownedAttributes.size() > 0) {
        data[alias].ownedAttributes = [];
        for (let attributeID of structuredClassifier.ownedAttributes.ids()) {
            data[alias].ownedAttributes.push(attributeID);
        }
    }
}
