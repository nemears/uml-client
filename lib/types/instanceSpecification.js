import { TypeInfo } from "./element.js";
import PackageableElement from "./packageableElement.js";
import UmlSet from "../set.js";
import Singleton from "../singleton.js";
import {
    INSTANCE_SPECIFICATION_ID,
    INSTANCE_SPECIFICATION_CLASSIFIERS_ID,
    INSTANCE_SPECIFICATION_SLOTS_ID,
    INSTANCE_SPECIFICATION_SPECIFICATION_ID,
    SLOT_OWNING_INSTANCE_ID
} from '../modelIds.js';

export default class InstanceSpecification extends PackageableElement {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(INSTANCE_SPECIFICATION_ID, 'InstanceSpecification');
        this.instanceSpecificationTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.packageableElementTypeInfo);
        this.typeInfo.create = () => new InstanceSpecification(manager);
        this.classifiers = new UmlSet(this, INSTANCE_SPECIFICATION_CLASSIFIERS_ID, "classifiers");
        this.slots = new UmlSet(this, INSTANCE_SPECIFICATION_SLOTS_ID, 'slots');
        this.specification = new Singleton(this, INSTANCE_SPECIFICATION_SPECIFICATION_ID, 'specification');
        this.slots.subsets(this.ownedElements);
        this.slots.opposite = SLOT_OWNING_INSTANCE_ID;
        this.specification.subsets(this.ownedElements);
    }
}
