import { TypeInfo} from "./element";
import Abstraction from "./abstraction";
import { REALIZATION_ID } from '../modelIds';

export default class Realization extends Abstraction {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(REALIZATION_ID, 'Realization');
        this.realizationTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.abstractionTypeInfo);
        this.typeInfo.create = () => new Realization(manager);
    }
}
