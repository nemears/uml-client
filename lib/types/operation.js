import BehavioralFeature from "./behavioralFeature.js";
import { assignParameterableElementSets } from "./parameterableElement.js";
import Singleton from "../singleton.js";
import UmlSet from "../set.js";

export default class Operation extends BehavioralFeature {
    constructor(manager) {
        super(manager);
        assignParameterableElementSets(this);
        this.isOrdered;
        this.isQuery = false;
        this.isUnique;
        this.lower;
        this.upper;
        this.interface = new Singleton(this);
        this.datatype = new Singleton(this);
        this.clazz = new Singleton(this);
        this.redefinedOperations = new UmlSet(this);
        this.ownedParameters = new UmlSet(this);
        this.interface.subsets(this.featuringClassifier);
        this.interface.subsets(this.namespace);
        this.interface.subsets(this.redefinitionContext);
        this.datatype.subsets(this.featuringClassifier);
        this.datatype.subsets(this.namespace);
        this.datatype.subsets(this.redefinitionContext);
        this.clazz.subsets(this.featuringClassifier);
        this.clazz.subsets(this.namespace);
        this.clazz.subsets(this.redefinitionContext);
        this.redefinedOperations.subsets(this.redefinedElement);
        this.interface.opposite = 'ownedOperations';
        this.datatype.opposite = 'ownedOperations';
        this.clazz.opposite = 'ownedOperations';
        this.ownedParameters.opposite = 'operation';
        this.sets.set('interface', this.interface);
        this.sets.set('dataType', this.dataType);
        this.sets.set('class', this.clazz);
        this.sets.set('redefinedOperations', this.redefinedOperations);
        this.sets.set('ownedParameters', this.ownedParameters);
        this.elementTypes.add('Operation');
    }
}
