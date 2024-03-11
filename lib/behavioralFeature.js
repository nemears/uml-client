import Namespace from "./namespace";
import { assignFeatureSets } from "./feature";
import Set from "./set";

export default class BehavioralFeature extends Namespace {
    constructor(manager) {
        super(manager);
        assignFeatureSets(this);
        this.isAbstract = false;
        this.concurrency = "sequential";
        this.raisedExceptions = new Set(this);
        this.methods = new Set(this);
        this.ownedParameterSets = new Set(this);
        this.ownedParameters = new Set(this);
        this.ownedParameterSets.subsets(this.ownedMember);
        this.ownedParameters.subsets(this.ownedMember);
        this.methods.opposite = "specification";
    }
}

export function isSubClassOfBehavioralFeature(elementType) {
    return elementType === 'behavioralFeature' || elementType === 'BEHAVIORAL_FEATURE';
}