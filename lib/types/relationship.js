import Element, { TypeInfo } from "./element.js";
import UmlSet from "../set.js";
import { RELATIONSHIP_ID, RELATIONSHIP_RELATED_ELEMENTS_ID } from '../modelIds.js';

export default class Relationship extends Element {
    constructor(manager) {
        super(manager);
        assignRelationshipSets(this);
    }
}

export function assignRelationshipSets(relationship) {
    relationship.typeInfo = new TypeInfo(RELATIONSHIP_ID, 'Relationship');
    relationship.relationshipTypeInfo = relationship.typeInfo;
    relationship.typeInfo.setBase(relationship.elementTypeInfo);
    relationship.relatedElements = new UmlSet(relationship, RELATIONSHIP_RELATED_ELEMENTS_ID, 'relatedElements');
}
