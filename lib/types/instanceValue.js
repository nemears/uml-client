import { INSTANCE_VALUE_ID, INSTANCE_VALUE_INSTANCE_ID } from "../modelIds";
import Singleton from "../singleton";
import { TypeInfo } from "./element";
import ValueSpecification from "./valueSpecification";

export default class InstanceValue extends ValueSpecification {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(INSTANCE_VALUE_ID, 'InstanceValue');
        this.instanceValueTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.valueSpecificationTypeInfo);
        this.typeInfo.create = () => new InstanceValue(manager);
        this.instance = new Singleton(this, INSTANCE_VALUE_INSTANCE_ID, 'instance');
    }
}
