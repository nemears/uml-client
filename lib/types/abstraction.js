import { TypeInfo } from "./element.js";
import Dependency from "./dependency.js";
import { ABSTRACTION_ID } from '../modelIds.js';

export default class Abstraction extends Dependency {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(ABSTRACTION_ID, 'Abstraction');
        this.abstractionTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.dependencyTypeInfo);
        this.typeInfo.create = () => new Abstraction(manager);
    }
}
