import StructuredClassifier from "./structuredClassifier";
import Set from "./set";

export default class EncapsulatedClassifier extends StructuredClassifier {
    constructor(manager) {
        super(manager);
        this.ownedPorts = new Set(this);
        this.ownedPorts.subsets(this.ownedAttribute);
        this.ownedPorts.opposite = 'encapsulatedClassifier';
    }
}

export function isSubClassOfEncapsulatedClassifier(elementType) {
    return elementType === 'encapsulatedClassifier' || elementType === 'ENCAPSULATED_CLASSIFIER';
}