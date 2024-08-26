import Element, { TypeInfo } from "./element";
import UmlSet from "../set";
import { RELATIONSHIP_RELATED_ELEMENTS_ID } from '../modelIds';

export default class Relationship extends Element {
    constructor(manager) {
        super(manager);
        assignRelationshipSets(this);
    }
}

export function assignRelationshipSets(relationship) {
    const base = this.typeInfo;
    this.typeInfo = new TypeInfo('Relationship');
    this.typeInfo.setBase(base);
    relationship.relatedElements = new UmlSet(relationship, RELATIONSHIP_RELATED_ELEMENTS_ID, 'relatedElements');
}
