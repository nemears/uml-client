import RedefinableElement from "./redefinableElement";
import Singleton from "./singleton";

export default class Feature extends RedefinableElement {
    constructor(manager) {
        super(manager);
        assignFeatureSets(this);
    }
}

export function assignFeatureSets(featureElement) {
    featureElement.featuringClassifier = new Singleton(featureElement);
    featureElement.isStatic = false;
    featureElement.featuringClassifier.opposite = 'features';
    featureElement.sets['featuringClassifier'] = featureElement.featuringClassifier;
}

export function isSubClassOfFeature(elementType) {
    return elementType === 'feature' || elementType === 'FEATURE';
}

//emit function and parse in parse.js the isReadOnly
export function emitFeature(data, alias, feature) {
    if (feature.isStatic !== undefined) {
        data[alias].isStatic = feature.isStatic;
    }
    if (feature.featuringClassifier.size() > 0) {
        data[alias].featuringClassifier = feature.featuringClassifier;
    }
}