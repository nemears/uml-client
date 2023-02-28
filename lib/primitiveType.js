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

    async emit() {
        let ret = {
            primitiveType: {}
        };
        await emitEl(ret, 'primitiveType', this);
        await emitNamedEl(ret, 'primitiveType', this);
        await emitPackageableElement(ret, 'primitiveType', this);
        return ret;
    }
    
    async deleteData() {
        deletePackageableElementData(this);
    }
}