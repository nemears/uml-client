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
        this.sets['features'] = this.features;
        this.sets['attributes'] = this.attributes;
    }
}

export function isSubClassOfClassifier(elementType) {
    return elementType === 'classifier' || elementType === 'CLASSIFIER';
}