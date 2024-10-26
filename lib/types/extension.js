import Association from "./association.js";
import { TypeInfo } from "./element.js";
import Singleton from "../singleton.js";
import { EXTENSION_ID, EXTENSION_OWNED_END_ID } from "../modelIds.js";

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
