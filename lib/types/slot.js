import Element, { emitEl } from "./element";
import { emitOwner, emitSet, emitSingleton } from "../emit";
import UmlSet from "../set";
import Singleton from "../singleton";

export default class Slot extends Element {
    constructor(manager) {
        super(manager);
        this.values = new UmlSet(this);
        this.definingFeature = new Singleton(this);
        this.owningInstance = new Singleton(this);
        this.values.subsets(this.ownedElements);
        this.owningInstance.subsets(this.owner);
        this.owningInstance.opposite = 'slots';
        this.sets.set('values', this.values);
        this.sets.set('definingFeature', this.definingFeature);
        this.sets.set('owningInstance', this.owningInstance);
        this.elementTypes.add('Slot');
    }

    elementType() {
        return 'Slot';
    }

    emit() {
        const ret = {
            Slot: {}
        }
        emitEl(ret, 'Slot', this);
        emitSlot(ret, 'Slot', this);
        return ret;
    }

    async deleteData() {
        if (this.owningInstance.has()) {
            this.owningInstance.set(undefined);
        }
    }
}

export function emitSlot(data, alias, slot) {
    emitSet(data, alias, slot.values, 'values');
    emitSingleton(data, alias, slot.definingFeature, 'definingFeature');
    emitOwner(data, slot.owningInstance, 'owningInstance');
}
