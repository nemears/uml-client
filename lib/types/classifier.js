import { assignNamespaceSets } from "./namespace";
import PackageableElement from "./packageableElement";
import UmlSet from "../set.js"

export default class Classifier extends PackageableElement {
    constructor(manager) {
        super(manager);
        assignNamespaceSets(this);
        this.features = new UmlSet(this);
        this.features.subsets(this.members);
        this.features.opposite = 'featuringClassifier';
        this.attributes = new UmlSet(this);
        this.attributes.subsets(this.features);
        this.generalizations = new UmlSet(this);
        this.generalizations.subsets(this.ownedElements);
        this.generalizations.opposite = 'specific';
        this.sets.set('features', this.features);
        this.sets.set('attributes', this.attributes);
        this.sets.set('generalizations', this.generalizations);
        this.elementTypes.add('Classifier');
    }
}

export function emitClassifier(data, alias, classifier) {
    if (classifier.generalizations.size() > 0) {
        data[alias].generalizations = [];
        for (let generalizationID of classifier.generalizations.ids()) {
            data[alias].generalizations.push(generalizationID);
        }
    }
}
