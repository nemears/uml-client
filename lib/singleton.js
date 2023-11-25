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

    set(val) {
        if (this.val !== undefined && this.val !== null) {
            if (this.val.el === undefined || this.val.el === null) {
                this.val.el = this.el.manager.getLocal(this.val.id); // TODO maybe make this function async to get as well
            }
        }
        if (val === undefined || val === null) {
            const oldVal = this.val;
            this.val = undefined;
            if (oldVal !== undefined && oldVal.el) {
                oppositeRemove(this, oldVal.el);
            }
        } else {
            this.val = new ElementReference(val);

            for (let set of this.superSets) {
                if (!set.contains(val)) {
                    set.add(val);
                }
            }
            if (val !== undefined && val !== null && typeof val !== 'string') {
                // set up references
                const elementReference = val.references.find((reference) => reference.id === this.el.id);
                if (!elementReference) {
                    val.references.push(new ElementReference(this.el));
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
            this.set(null);
        } else {
            throw Error("cannot remove element from singleton that is not its value");
        }
    }

    async get() {
        if (this.val !== undefined) {
            if (!this.val.el) {
                await restoreReference(this.val, this.el);
            }
            return this.val.el;
        }
        return undefined;
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
