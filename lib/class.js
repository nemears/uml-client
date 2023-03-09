import { emitEl } from "./element";
import { emitNamedEl } from "./namedElement";
import { deletePackageableElementData, emitPackageableElement } from "./packageableElement";
import StructuredClassifier, { emitStructuredClassifier } from "./structuredClassifier";

export default class Class extends StructuredClassifier {
    constructor(manager) {
        super(manager);
        this.ownedAttributes.opposite = 'class';
    }

    elementType() {
        return 'class';
    }

    emit() {
        let ret = {
            class: {}
        };
        emitEl(ret, 'class', this);
        emitNamedEl(ret, 'class', this);
        emitPackageableElement(ret, 'class', this);
        emitStructuredClassifier(ret, 'class', this);
        return ret;
    }

    async deleteData() {
        deletePackageableElementData(this);
    }
}