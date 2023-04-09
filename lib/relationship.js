import Element from "./element";
import Set from "./set";

export default class Relationship extends Element {
    constructor(manager) {
        super(manager);
        assignRelationshipSets(this);
    }
}

export function assignRelationshipSets(relationship) {
    relationship.relatedElements = new Set(relationship);
    relationship.sets['relatedElements'] = relationship.relatedElements;
}

export function isSubClassOfRelationship(elementType) {
    return elementType === 'relationship' || elementType === 'RELATIONSHIP';
}