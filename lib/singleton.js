import { oppositeAdd, oppositeRemove } from "./set.js";

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
            oppositeRemove(this, this.val);
        }
        if (val === undefined || val === null) {
            this.val = undefined;
        }
        this.val = val;
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
}