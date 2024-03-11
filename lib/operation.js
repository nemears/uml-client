import BehavioralFeature from "./behavioralFeature";
import { assignParameterableElementSets } from "./parameterableElement";
import Singleton from "./singleton";
import Set from "./set";

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
        this.class = new Singleton(this);
        this.templateParameter = new Singleton(this);
        this.redefinedOperations = new Set(this);
        this.raisedExceptions = new Set(this);
        this.type = new Singleton(this);
        this.bodyCondition = new Singleton(this);
        this.postconditions = new Set(this);
        this.preconditions = new Set(this);
        this.ownedParameters = new Set(this);
        this.type.readonly;
        this.interface.subsets(this.featuringClassifier);
        this.interface.subsets(this.namespace);
        this.interface.subsets(this.redefinitionContext);
        this.datatype.subsets(this.featuringClassifier);
        this.datatype.subsets(this.namespace);
        this.datatype.subsets(this.redefinitionContext);
        this.class.subsets(this.featuringClassifier);
        this.class.subsets(this.namespace);
        this.class.subsets(this.redefinitionContext);
        this.redefinedOperations.subsets(this.redefinedElement);
        this.bodyCondition.subsets(this.ownedRule);
        this.postconditions.subsets(this.ownedRule);
        this.preconditions.subsets(this.ownedRule);
        this.interface.opposite = 'ownedOperation';
        this.datatype.opposite = 'ownedOperation';
        this.class.opposite = 'ownedOperation';
        this.templateParameter.opposite = 'parameteredElement';
        this.redefinedOperations.opposite = 'operation';
        this.raisedExceptions.opposite = 'operation';
        this.type.opposite = 'operation';
        this.bodyCondition.opposite = 'bodyContext';
        this.postconditions.opposite = 'postContext';
        this.preconditions.opposite = 'preContext';
        this.ownedParameters.opposite = 'operation';
    }
}

export function isSubClassOfOperation(elementType) {
    return elementType === 'operation' || elementType === 'OPERATION';
}