import { oppositeAdd, oppositeRemove, ElementReference, restoreReference } from "./set.js";
import { nullID } from './element.js'

export default class Singleton {
    constructor(el) {
        this.subSets = [];
        this.superSets = [];
        this.redefinedSets = [];
        this.el = el;
        this.val = undefined;
        this.opposite = undefined;
        this.readonly = false;
    }

    subsets(set) {
        set.subSets.push(this);
        this.superSets.push(set);
    }

    redefines(set) {
        if (!set.redefinedSets.includes(this)) {
            set.redefinedSets.push(this);
        }
        if (!this.redefinedSets.includes(set)) {
            this.redefinedSets.push(set);
        }
    }

    set(val) {
        if (this.readonly) {
            throw Error('cannot set readonly singleton!');
        }
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
            const valBeingRemoved = this.val;
            this.val = undefined;
            if (valBeingRemoved.el) {
                oppositeRemove(this, valBeingRemoved.el);
            }
            for (const set of this.redefinedSets) {
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

            for (let set of this.redefinedSets) {
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

    setType() {
        return 'singleton';
    }
}
