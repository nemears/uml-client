import { TypeInfo } from "./element";
import Dependency from "./dependency";
import { ABSTRACTION_ID } from '../modelIds';

export default class Abstraction extends Dependency {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(ABSTRACTION_ID, 'Abstraction');
        this.abstractionTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.dependencyTypeInfo);
    }
}
