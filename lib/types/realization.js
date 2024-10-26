import { TypeInfo} from "./element.js";
import Abstraction from "./abstraction.js";
import { REALIZATION_ID } from '../modelIds.js';

export default class Realization extends Abstraction {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(REALIZATION_ID, 'Realization');
        this.realizationTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.abstractionTypeInfo);
        this.typeInfo.create = () => new Realization(manager);
    }
}
