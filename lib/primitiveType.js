import DataType, { emitDataType, isSubClassOfDataType } from "./dataType";
import { emitEl, isSubClassOfElement } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { isSubClassOfNamespace } from "./namespace";
import { emitClassifier, isSubClassOfClassifier } from "./classifier";
import { emitPackageableElement, isSubClassOfPackageableElement } from "./packageableElement";

export default class PrimitiveType extends DataType {

    elementType() {
        return 'primitiveType';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfPrimitiveType(elementType);
        if (!ret) {
            ret = isSubClassOfDataType(elementType);
        }
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
        emitClassifier(ret, 'primitiveType', this);
        emitDataType(ret, 'primitiveType', this);
        return ret;
    }
}

export function isSubClassOfPrimitiveType(elementType) {
    return elementType === 'primitiveType' || elementType === 'PRIMITIVE_TYPE';
}