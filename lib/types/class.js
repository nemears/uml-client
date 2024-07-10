import { emitClassifier } from "./classifier";
import { emitEl, deleteElementData } from "./element";
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
            Class: {}
        };
        emitEl(ret, 'Class', this);
        emitNamedEl(ret, 'Class', this);
        emitPackageableElement(ret, 'Class', this);
        emitClassifier(ret, 'Class', this);
        emitStructuredClassifier(ret, 'Class', this);
        return ret;
    }

    async deleteData() {
        let elsToDelete = [];
        for await (let el of this.ownedAttributes) {
            elsToDelete.push(el);
        }
        for (let el of elsToDelete) {
            await this.ownedAttributes.remove(el);
        }
        deletePackageableElementData(this);
        deleteElementData(this);
    }
}
