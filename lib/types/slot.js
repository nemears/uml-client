import Element, { TypeInfo } from "./element.js";
import UmlSet from "../set.js";
import Singleton from "../singleton.js";
import { 
    SLOT_ID, 
    INSTANCE_SPECIFICATION_SLOTS_ID, 
    SLOT_DEFINING_FEATURE_ID, 
    SLOT_OWNING_INSTANCE_ID, 
    SLOT_VALUES_ID 
} from "../modelIds.js";

export default class Slot extends Element {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(SLOT_ID, 'Slot');
        this.slotTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.elementTypeInfo);
        this.typeInfo.create = () => new Slot(manager);
        this.values = new UmlSet(this, SLOT_VALUES_ID, 'values');
        this.definingFeature = new Singleton(this, SLOT_DEFINING_FEATURE_ID, 'definingFeature');
        this.owningInstance = new Singleton(this, SLOT_OWNING_INSTANCE_ID, 'owningInstance');
        this.values.subsets(this.ownedElements);
        this.owningInstance.subsets(this.owner);
        this.owningInstance.opposite = INSTANCE_SPECIFICATION_SLOTS_ID;
    }
}
