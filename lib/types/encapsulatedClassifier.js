import StructuredClassifier from "./structuredClassifier";
import UmlSet from "./set";

export default class EncapsulatedClassifier extends StructuredClassifier {
    constructor(manager) {
        super(manager);
        this.ownedPorts = new UmlSet(this);
        this.ownedPorts.subsets(this.ownedAttribute);
        this.ownedPorts.opposite = 'encapsulatedClassifier';
        this.sets.set('ownedPorts', this.ownedPorts);
        this.elementTypes.add('EncapsulatedClassifier');
    }
}
