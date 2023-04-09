import Relationship from "./relationship";
import Set from "./set";

export default class DirectedRelationship extends Relationship {
    constructor() {
        super();
        this.targets = new Set(this);
        this.sources = new Set(this);
        this.targets.subsets(this.relatedElements);
        this.sources.subsets(this.relatedElements);
        this.sets['targets'] = this.targets;
        this.sets['sources'] = this.sources;
    }
}

export function isSubClassOfDirectedRelationship(elementType) {
    return elementType === 'directedRelationship' || elementType === 'DIRECTED_RELATIONSHIP';
}