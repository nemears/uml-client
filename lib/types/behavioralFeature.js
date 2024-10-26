import Namespace from "./namespace.js";
import { assignFeatureSets } from "./feature.js";
import UmlSet from "./set.js";

export default class BehavioralFeature extends Namespace {
    constructor(manager) {
        super(manager);
        assignFeatureSets(this);
        this.isAbstract = false;
        this.concurrency = "sequential";
        this.raisedExceptions = new UmlSet(this);
        this.methods = new UmlSet(this);
        this.ownedParameterSets = new UmlSet(this);
        this.ownedParameters = new UmlSet(this);
        this.ownedParameterSets.subsets(this.ownedMember);
        this.ownedParameters.subsets(this.ownedMember);
        this.methods.opposite = "specification";
        this.sets.set('raisedExceptions', this.raisedExceptions);
        this.sets.set('methods', this.methods);
        this.sets.set('ownedParameterSets', this.ownedParameterSets);
        this.sets.set('ownedParameters', this.ownedParameters);
        this.elementTypes.add('BehavioralFeature');
    }
}
