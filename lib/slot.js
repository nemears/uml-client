import Element, { cleanupReferences, emitEl, isSubClassOfElement } from "./element";
import { emitOwner, emitSet, emitSingleton } from "./emit";
import Set from "./set";
import Singleton from "./singleton";

export default class Slot extends Element {
    constructor(manager) {
        super(manager);
        this.values = new Set(this);
        this.definingFeature = new Singleton(this);
        this.owningInstance = new Singleton(this);
        this.values.subsets(this.ownedElements);
        this.owningInstance.subsets(this.owner);
        this.owningInstance.opposite = 'slots';
        this.sets['values'] = this.values;
        this.sets['definingFeature'] = this.definingFeature;
        this.sets['owningInstance'] = this.owningInstance;
    }

    elementType() {
        return 'slot';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfSlot(elementType);
        if (!ret) {
            ret = isSubClassOfElement(elementType);
        }
        return ret;
    }

    emit() {
        const ret = {
            slot: {}
        }
        emitEl(ret, 'slot', this);
        emitSlot(ret, 'slot', this);
        return ret;
    }

    async deleteData() {
        await cleanupReferences(this);
    }
}

export function isSubClassOfSlot(elementType) {
    return elementType === 'slot' || elementType === 'SLOT';
}

export function emitSlot(data, alias, slot) {
    emitSet(data, alias, slot.values, 'values');
    emitSingleton(data, alias, slot.definingFeature, 'definingFeature');
    emitOwner(data, slot.owningInstance, 'owningInstance');
}