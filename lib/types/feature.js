import { TypeInfo } from './element.js';
import RedefinableElement from "./redefinableElement.js";
import Singleton from "../singleton.js";
import { FEATURE_ID, FEATURE_FEATURING_CLASSIFIER_ID, CLASSIFIER_FEATURES_ID } from '../modelIds.js';

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
    featureElement.featuringClassifier.readonly = true;
    const me = featureElement;
    featureElement.typeInfo.specialData.set('static', {
        getData() {
            return me.isStatic;
        },
        setData(val) {
            if (typeof val === 'string') {
                me.isStatic = val === 'true';
            } else {
                me.isStatic = val;
            }
        },
        type: 'bool'
    });
}
