import { emitClassifier } from "./classifier";
import { emitEl } from "./element";
import { emitNamedEl } from "./namedElement";
import { deletePackageableElementData, emitPackageableElement } from "./packageableElement";
import StructuredClassifier, { emitStructuredClassifier } from "./structuredClassifier";

export default class Class extends StructuredClassifier {
    constructor(manager) {
        super(manager);
        this.ownedAttributes.opposite = 'class';
        this.elementTypes.add('Class');
    }

    elementType() {
        return 'Class';
    }

    emit() {
        let ret = {
            class: {}
        };
        emitEl(ret, 'class', this);
        emitNamedEl(ret, 'class', this);
        emitPackageableElement(ret, 'class', this);
        emitClassifier(ret, 'class', this);
        emitStructuredClassifier(ret, 'class', this);
        return ret;
    }

    async deleteData() {
        let elsToDelete = [];
        for await (let el of this.ownedAttributes) {
            elsToDelete.push(el);
        }
        for (let el of elsToDelete) {
            this.ownedAttributes.remove(el);
        }
        deletePackageableElementData(this);
    }
}
