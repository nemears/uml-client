import { oppositeAdd, oppositeRemove, ElementReference } from "./set.js";

export default class Singleton {
    constructor(el) {
        this.subSets = [];
        this.superSets = [];
        this.redefines = [];
        this.el = el;
        this.val = undefined;
        this.opposite = undefined;
    }

    subsets(set) {
        set.subSets.push(this);
        this.superSets.push(set);
    }

    set(val) {
        if (this.val !== undefined && this.val !== null) {
            let valToRemove = this.val.el;
            if (valToRemove === undefined) {
                valToRemove = this.el.manager.getLocal(this.val.id);
            }
            if (valToRemove === undefined) {
                valToRemove = this.val.id;
            }
            oppositeRemove(this, valToRemove);
        }
        if (val === undefined || val === null) {
            this.val = undefined;
        } else {
            this.val = new ElementReference(val);
        }
        for (let set of this.superSets) {
            if (!set.contains(val)) {
                set.add(val);
            }
        }
        if (val !== undefined && val !== null) {
            oppositeAdd(this, val);
        }
    }

    contains(el) {
        if (this.val === undefined || this.val === null) {
            return false;
        }
        return this.val.id === el.id;
    }

    add(el) {
        this.set(el);
    }

    remove(el) {
        if (this.contains(el)) {
            this.set(null);
        } else {
            throw Error("cannot remove element from singleton that is not its value");
        }
    }

    async get() {
        if (this.val !== undefined) {
            if (this.val.el === undefined) {
                this.val.el = this.el.manager.getLocal(this.val.id);
            }
            if (this.val.el === undefined) {
                this.val.el = await this.el.manager.get(this.val.id);
            }
        }
        return undefined;
    }
}