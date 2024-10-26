import { TypeInfo } from "./element.js";
import Property from "./property.js";
import { EXTENSION_END_ID } from '../modelIds.js';

export default class ExtensionEnd extends Property {
    
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(EXTENSION_END_ID, 'ExtensionEnd');
        this.extensionEndTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.propertyTypeInfo);
        this.typeInfo.create = () => new ExtensionEnd(manager);
    }
}
