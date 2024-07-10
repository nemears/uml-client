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
            PrimitiveType: {}
        };
        emitEl(ret, 'PrimitiveType', this);
        emitNamedEl(ret, 'PrimitiveType', this);
        emitPackageableElement(ret, 'PrimitiveType', this);
        emitClassifier(ret, 'PrimitiveType', this);
        emitDataType(ret, 'PrimitiveType', this);
        return ret;
    }
}
