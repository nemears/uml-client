import { STEREOTYPE_PROFILE_ID } from "../modelIds";
import Singleton from "../singleton";
import Class from "./class";
import { TypeInfo } from "./element";

export default class Stereotype extends Class {

    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo('Stereotype');
        this.stereotypeTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.classTypeInfo);
        this.typeInfo.create = () => new Stereotype(manager);
        this.profile = new Singleton(this, STEREOTYPE_PROFILE_ID, 'profile');
        this.profile.readonly = true;
    }
}