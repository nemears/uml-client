import DataType, { emitDataType } from "./dataType";
import { emitEl } from "./element";
import { emitNamedEl } from "./namedElement";
import { emitClassifier } from "./classifier";
import { emitPackageableElement } from "./packageableElement";
import UmlSet from "../set.js"

export default class Enumeration extends DataType {

    constructor() {
        super();
        this.ownedLiterals = new UmlSet(this);
        this.ownedLiterals.subsets(this.ownedMembers);
        this.ownedLiterals.opposite = 'enumeration';
        this.sets.set('ownedLiterals', this.ownedLiterals);
    }

    elementType() {
        return 'Enumeration';
    }

    emit() {
        let ret = {
            enumeration: {}
        };
        emitEl(ret, 'Enumeration', this);
        emitNamedEl(ret, 'Enumeration', this);
        emitPackageableElement(ret, 'Enumeration', this);
        emitClassifier(ret, 'Enumeration', this);
        emitDataType(ret, 'Enumeration', this);
        emitEnumeration(ret, 'Enumeration', this);
        return ret;
    }
}

export function emitEnumeration(data, alias, el) {
    if (el.ownedLiterals.size() > 0) {
        data[alias].ownedLiterals = [];
        for (const id of el.ownedLiterals.ids()) {
            data[alias].ownedLiterals.push(id);
        }
    }
}
