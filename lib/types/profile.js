import { TypeInfo } from "./element";
import Package from "./package";
import { PROFILE_ID } from '../modelIds';

export default class Profile extends Package {

    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(PROFILE_ID, 'Profile');
        this.profileTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.packageTypeInfo);
        this.typeInfo.create = () => new Profile(manager);
    }
}
