import Element from "./element";
import Set from "./set";

export default class Relationship extends Element {
    constructor(manager) {
        super(manager);
        this.relatedElements = new Set(this);
        this.sets['relatedElements'] = this.relatedElements;
    }
}

export function isSubClassOfRelationship(elementType) {
    return elementType === 'relationship' || elementType === 'RELATIONSHIP';
}