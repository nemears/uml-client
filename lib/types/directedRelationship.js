import Relationship from "./relationship";
import UmlSet from "../set";

export default class DirectedRelationship extends Relationship {
    constructor(manager) {
        super(manager);
        this.targets = new UmlSet(this);
        this.sources = new UmlSet(this);
        this.targets.subsets(this.relatedElements);
        this.sources.subsets(this.relatedElements);
        this.sets.set('targets', this.targets);
        this.sets.set('sources', this.sources);
        this.elementTypes.add('DirectedRelationship');
    }
}
