import { emitEl } from "./element";
import { emitNamedEl } from "./namedElement";
import PackageableElement , { deletePackageableElementData, emitPackageableElement } from "./packageableElement";

export default class PrimitiveType extends PackageableElement {
    constructor() {
        super();
    }

    elementType() {
        return 'primitiveType';
    }

    emit() {
        let ret = {
            primitiveType: {}
        };
        emitEl(ret, 'primitiveType', this);
        emitNamedEl(ret, 'primitiveType', this);
        emitPackageableElement(ret, 'primitiveType', this);
        return ret;
    }
    
    async deleteData() {
        deletePackageableElementData(this);
    }
}