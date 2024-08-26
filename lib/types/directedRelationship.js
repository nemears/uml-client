import { TypeInfo } from './element';
import Relationship from "./relationship";
import UmlSet from "../set";
import { DIRECTED_RELATIONSHIP_SOURCES_ID, DIRECTED_RELATIONSHIP_TARGETS_ID } from '../modelIds';

export default class DirectedRelationship extends Relationship {
    constructor(manager) {
        super(manager);
        const base = this.typeInfo;
        this.typeInfo = new TypeInfo('DirectedRelationship');
        this.typeInfo.setBase(base);
        this.targets = new UmlSet(this, DIRECTED_RELATIONSHIP_TARGETS_ID, 'targets');
        this.sources = new UmlSet(this, DIRECTED_RELATIONSHIP_SOURCES_ID, 'sources');
        this.targets.subsets(this.relatedElements);
        this.sources.subsets(this.relatedElements);
    }
}
