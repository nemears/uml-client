import { assignNamespaceSets } from "./namespace";
import PackageableElement from "./packageableElement";
import Set from "./set.js"

export default class Classifier extends PackageableElement {
    constructor(manager) {
        super(manager);
        assignNamespaceSets(this);
        this.features = new Set(this);
        this.features.subsets(this.members);
        this.features.opposite = 'featuringClassifier';
        this.attributes = new Set(this);
        this.attributes.subsets(this.features);
        this.generalizations = new Set(this);
        this.generalizations.subsets(this.ownedElements);
        this.generalizations.opposite = 'specific';
        this.sets['features'] = this.features;
        this.sets['attributes'] = this.attributes;
        this.sets['generalizations'] = this.generalizations;
    }
}

export function isSubClassOfClassifier(elementType) {
    return elementType === 'classifier' || elementType === 'CLASSIFIER';
}

export function emitClassifier(data, alias, classifier) {
    if (classifier.generalizations.size() > 0) {
        data[alias].generalizations = [];
        for (let generalizationID of classifier.generalizations.ids()) {
            data[alias].generalizations.push(generalizationID);
        }
    }
}