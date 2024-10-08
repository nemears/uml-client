import { TypeInfo } from './element';
import { assignNamespaceSets } from "./namespace";
import Type from './type';
import { assignRedefinableElementSets } from './redefinableElement';
import UmlSet from "../set.js";
import { 
    CLASSIFIER_ID,
    CLASSIFIER_GENERALIZATIONS_ID, 
    GENERALIZATION_SPECIFIC_ID, 
    CLASSIFIER_FEATURES_ID, 
    CLASSIFIER_ATTRIBUTES_ID, 
    FEATURE_FEATURING_CLASSIFIER_ID 
} from '../modelIds';

export default class Classifier extends Type {
    constructor(manager) {
        super(manager);
        assignNamespaceSets(this);
        assignRedefinableElementSets(this);
        this.typeInfo = new TypeInfo(CLASSIFIER_ID, 'Classifier');
        this.classifierTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.typeTypeInfo);
        this.typeInfo.setBase(this.namespaceTypeInfo);
        this.typeInfo.setBase(this.redefinableElementTypeInfo);
        this.features = new UmlSet(this, CLASSIFIER_FEATURES_ID, 'features');
        this.features.subsets(this.members);
        this.features.opposite = FEATURE_FEATURING_CLASSIFIER_ID;
        this.attributes = new UmlSet(this, CLASSIFIER_ATTRIBUTES_ID, 'attributes');
        this.attributes.subsets(this.features);
        this.generalizations = new UmlSet(this, CLASSIFIER_GENERALIZATIONS_ID, 'generalizations');
        this.generalizations.subsets(this.ownedElements);
        this.generalizations.opposite = GENERALIZATION_SPECIFIC_ID;
    }
}
