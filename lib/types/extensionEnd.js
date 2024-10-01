import { TypeInfo } from "./element";
import Property from "./property";
import { EXTENSION_END_ID } from '../modelIds';

export default class ExtensionEnd extends Property {
    
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(EXTENSION_END_ID, 'ExtensionEnd');
        this.extensionEndTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.propertyTypeInfo);
        this.typeInfo.create = () => new ExtensionEnd(manager);
    }
}
