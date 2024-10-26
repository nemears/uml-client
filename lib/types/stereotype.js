import { STEREOTYPE_ID, STEREOTYPE_PROFILE_ID } from "../modelIds.js";
import Singleton from "../singleton.js";
import Class from "./class.js";
import { TypeInfo } from "./element.js";

export default class Stereotype extends Class {

    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(STEREOTYPE_ID, 'Stereotype');
        this.stereotypeTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.classTypeInfo);
        this.typeInfo.create = () => new Stereotype(manager);
        this.profile = new Singleton(this, STEREOTYPE_PROFILE_ID, 'profile');
        this.profile.readonly = true;
    }
}
