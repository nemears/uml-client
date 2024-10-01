import { TypeInfo } from './element';
import RedefinableElement from "./redefinableElement";
import Singleton from "../singleton";
import { FEATURE_ID, FEATURE_FEATURING_CLASSIFIER_ID, CLASSIFIER_FEATURES_ID } from '../modelIds';

export default class Feature extends RedefinableElement {
    constructor(manager) {
        super(manager);
        assignFeatureSets(this);
    }
}

export function assignFeatureSets(featureElement) {
    featureElement.typeInfo = new TypeInfo(FEATURE_ID, 'Feature');
    featureElement.featureTypeInfo = featureElement.typeInfo;
    featureElement.typeInfo.setBase(featureElement.redefinableElementTypeInfo);
    featureElement.featuringClassifier = new Singleton(featureElement, FEATURE_FEATURING_CLASSIFIER_ID, 'featuringClassifier');
    featureElement.isStatic = false;
    featureElement.featuringClassifier.opposite = CLASSIFIER_FEATURES_ID;
}
