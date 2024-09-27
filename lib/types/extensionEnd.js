import { TypeInfo } from "./element";
import Property from "./property";

export default class ExtensionEnd extends Property {
    
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo('ExtensionEnd');
        this.extensionEndTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.propertyTypeInfo);
        this.typeInfo.create = () => new ExtensionEnd(manager);
    }
}
