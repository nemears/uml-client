import { oppositeAdd, oppositeRemove, ElementReference, restoreReference } from "./set.js";
import { nullID } from './element.js'

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

    redefines(set) {
        if (!set.redefines.includes(this)) {
            set.redefines.push(this);
        }
        if (!this.redefines.includes(set)) {
            this.redefines.push(set);
        }
    }

    set(val) {
        if (this.val !== undefined && this.val !== null) {
            if (this.val.el === undefined || this.val.el === null) {
                this.val.el = this.el.manager.getLocal(this.val.id); // TODO maybe make this function async to get as well
            }
        }
        if (this.val) {
            if (typeof val === 'string' && val === this.val.id) {
                return;
            } else if (typeof val === 'object' && val.id === this.val.id) {
                return;
            }
            oppositeRemove(this, this.val.el);
            this.val = undefined;
            for (const set of this.redefines) {
                if (set.contains(val)) {
                    set.remove(val);
                }
            }
        }

        if (val)  {
            this.val = new ElementReference(val);

            for (let set of this.superSets) {
                if (!set.contains(val)) {
                    set.add(val);
                }
            }

            for (let set of this.redefines) {
                if (!set.contains(val)) {
                    set.add(val);
                }
            }
            if (typeof val !== 'string') {
                // set up references
                if (!val.references.has(this.el.id)) {
                    val.references.set(this.el.id, this.el);
                }

                oppositeAdd(this, val);
            }
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
            this.set(undefined);
        } else {
            throw Error("cannot remove element from singleton that is not its value");
        }
    }

    async get() {
        if (this.val !== undefined) {
            if (!this.val.el) {
                await restoreReference(this.val, this);
            }
            return this.val.el;
        }
        return undefined;
    }

    unsafe() {
        return this.val.el;
    }

    id() {
        if (this.val === undefined || this.val === null) {
            return nullID();
        } else {
            return this.val.id;
        }
    }

    has() {
        return this.val !== undefined && this.val.id !== nullID();
    }
}
