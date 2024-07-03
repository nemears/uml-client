import Element from "./element";
import UmlSet from "../set";

export default class Relationship extends Element {
    constructor(manager) {
        super(manager);
        assignRelationshipSets(this);
    }
}

export function assignRelationshipSets(relationship) {
    relationship.relatedElements = new UmlSet(relationship);
    relationship.sets.set('relatedElements', relationship.relatedElements);
    relationship.elementTypes.add('Relationship');
}
