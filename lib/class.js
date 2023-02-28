import { emitEl } from "./element";
import { emitNamedEl } from "./namedElement";
import { deletePackageableElementData, emitPackageableElement } from "./packageableElement";
import StructuredClassifier from "./structuredClassifier";

export default class Class extends StructuredClassifier {
    constructor(manager) {
        super(manager);
        this.ownedAttributes.opposite = 'class';
    }

    elementType() {
        return 'class';
    }

    async emit() {
        let ret = {
            class: {}
        };
        await emitEl(ret.class, this);
        await emitNamedEl(ret.class, this);
        await emitPackageableElement(ret, this);
        return ret;
    }

    async deleteData() {
        deletePackageableElementData(this);
    }
}