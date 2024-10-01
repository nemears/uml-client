import StructuredClassifier from "./structuredClassifier";
import UmlSet from "../set";
import { TypeInfo } from './element';
import { ENCAPSULATED_CLASSIFIER_ID } from '../modelIds';

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
