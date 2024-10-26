import Classifier  from "./classifier.js";
import { TypeInfo } from "./element.js";
import { assignRelationshipSets } from "./relationship.js";
import UmlSet from "../set.js";
import { 
    ASSOCIATION_ID,
    ASSOCIATION_MEMBER_ENDS_ID, 
    ASSOCIATION_NAVIGABLE_OWNED_ENDS_ID, 
    ASSOCIATION_OWNED_ENDS_ID, 
    PROPERTY_ASSOCIATION_ID, 
    PROPERTY_OWNING_ASSOCIATION_ID 
} from '../modelIds.js';

export default class Association extends Classifier {
    constructor(manager) {
        super(manager);
        assignRelationshipSets(this);
        this.typeInfo = new TypeInfo(ASSOCIATION_ID, 'Association');
        this.associationTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.classifierTypeInfo);
        this.typeInfo.setBase(this.relationshipTypeInfo);
        this.typeInfo.create = () => new Association(manager);
        this.memberEnds = new UmlSet(this, ASSOCIATION_MEMBER_ENDS_ID, "memberEnds");
        this.ownedEnds = new UmlSet(this, ASSOCIATION_OWNED_ENDS_ID, "ownedEnds");
        this.navigableOwnedEnds = new UmlSet(this, ASSOCIATION_NAVIGABLE_OWNED_ENDS_ID, "navigableOwnedEnds");
        this.memberEnds.subsets(this.members);
        this.memberEnds.opposite = PROPERTY_ASSOCIATION_ID;
        this.ownedEnds.subsets(this.memberEnds);
        this.ownedEnds.subsets(this.ownedMembers);
        this.ownedEnds.opposite = PROPERTY_OWNING_ASSOCIATION_ID;
        this.navigableOwnedEnds.subsets(this.ownedEnds);
    }
}
