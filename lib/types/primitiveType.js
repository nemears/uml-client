import DataType, { emitDataType } from "./dataType";
import { emitEl } from "./element";
import { emitNamedEl } from "./namedElement";
import { emitClassifier } from "./classifier";
import { emitPackageableElement } from "./packageableElement";

export default class PrimitiveType extends DataType {

    constructor(manager) {
        super(manager);
        this.elementTypes.add('PrimitiveType');
    }

    elementType() {
        return 'PrimitiveType';
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
