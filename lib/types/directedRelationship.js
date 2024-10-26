import { TypeInfo } from './element.js';
import Relationship from "./relationship.js";
import UmlSet from "../set.js";
import { DIRECTED_RELATIONSHIP_ID, DIRECTED_RELATIONSHIP_SOURCES_ID, DIRECTED_RELATIONSHIP_TARGETS_ID } from '../modelIds.js';

export default class DirectedRelationship extends Relationship {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(DIRECTED_RELATIONSHIP_ID, 'DirectedRelationship');
        this.directedRelationshipTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.relationshipTypeInfo);
        this.targets = new UmlSet(this, DIRECTED_RELATIONSHIP_TARGETS_ID, 'targets');
        this.sources = new UmlSet(this, DIRECTED_RELATIONSHIP_SOURCES_ID, 'sources');
        this.targets.subsets(this.relatedElements);
        this.sources.subsets(this.relatedElements);
    }
}
