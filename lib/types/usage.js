import { TypeInfo } from './element';
import Dependency from "./dependency";
import { USAGE_ID } from '../modelIds';

export default class Usage extends Dependency {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(USAGE_ID, 'Usage');
        this.usageTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.dependencyTypeInfo);
        this.typeInfo.create = () => new Usage(manager);
    }
}
