import { isSubClassOfClassifier } from "./classifier";
import { emitEl, isSubClassOfElement } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { isSubClassOfNamespace } from "./namespace";
import PackageableElement , { deletePackageableElementData, emitPackageableElement, isSubClassOfPackageableElement } from "./packageableElement";

export default class PrimitiveType extends PackageableElement {
    constructor() {
        super();
    }

    elementType() {
        return 'primitiveType';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfPrimitiveType(elementType);
        if (!ret) {
            ret = isSubClassOfClassifier(elementType);
        }
        if (!ret) {
            ret = isSubClassOfPackageableElement(elementType);
        }
        if (!ret) {
            ret = isSubClassOfNamespace(elementType);
        }
        if (!ret) {
            ret = isSubClassOfNamedElement(elementType);
        }
        if (!ret) {
            ret = isSubClassOfElement(elementType);
        }

        return ret;
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

export function isSubClassOfPrimitiveType(elementType) {
    return elementType === 'primitiveType' || elementType === 'PRIMITIVE_TYPE';
}