import Association from "./association";
import { TypeInfo } from "./element";
import Singleton from "../singleton";
import { EXTENSION_ID, EXTENSION_OWNED_END_ID } from "../modelIds";

export default class Extension extends Association {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(EXTENSION_ID, 'Extension');
        this.extensionTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.associationTypeInfo);
        this.typeInfo.create = () => new Extension(manager);
        this.ownedEnd = new Singleton(this, EXTENSION_OWNED_END_ID, 'ownedEnd');
        this.ownedEnd.subsets(this.ownedEnds);
    }
}
