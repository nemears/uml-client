import StructuredClassifier from "./structuredClassifier.js";
// import UmlSet from "../set.js";
import { TypeInfo } from './element.js';
import { ENCAPSULATED_CLASSIFIER_ID } from '../modelIds.js';

export default class EncapsulatedClassifier extends StructuredClassifier {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(ENCAPSULATED_CLASSIFIER_ID, 'EncapsulatedClassifier');
        this.encapsulatedClassifierTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.structuredClassifierTypeInfo);
        // this.ownedPorts = new UmlSet(this);
        // this.ownedPorts.subsets(this.ownedAttribute);
        // this.ownedPorts.opposite = 'encapsulatedClassifier';
        // this.sets.set('ownedPorts', this.ownedPorts);
        // this.elementTypes.add('EncapsulatedClassifier');
    }
}
