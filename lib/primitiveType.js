import Classifier, { isSubClassOfClassifier } from "./classifier";
import { emitEl, isSubClassOfElement } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { isSubClassOfNamespace } from "./namespace";
import { deletePackageableElementData, emitPackageableElement, isSubClassOfPackageableElement } from "./packageableElement";
import Set from "./set";

export default class PrimitiveType extends Classifier {
    constructor() {
        super();
        this.ownedAttributes = new Set(this);
        this.ownedAttributes.subsets(this.attributes);
        this.ownedAttributes.subsets(this.ownedMembers);
        this.sets['ownedAttributes'] = this.ownedAttributes;
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
        let elsToDelete = [];
        for await (let el of this.ownedAttributes) {
            elsToDelete.push(el);
        }
        for (let el of elsToDelete) {
            el.ownedAttributes.remove(el);
        }
        deletePackageableElementData(this);
    }
}

export function isSubClassOfPrimitiveType(elementType) {
    return elementType === 'primitiveType' || elementType === 'PRIMITIVE_TYPE';
}