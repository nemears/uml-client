export function oppositeAdd(set, el) {
    if (set.opposite !== undefined) {
        if (!el.sets[set.opposite].contains(set.el)) {
            el.sets[set.opposite].add(set.el);
        }
    } else {
        // check supersets todo
        let queue = [];
        for (let otherSet in set.superSets) {
            queue.push(otherSet);
        }
        while (queue.length !== 0) { // this can be handled better
            let front = queue[0];
            queue.splice(front, 1);
            if (front.opposite !== undefined) {
                if (!el.sets[set.opposite].contains(set.el)) {
                    el.sets[set.opposite].add(set.el);
                }
                break;
            }
            for (let otherSet in front.superSets) {
                queue.push(otherSet);
            }
        }
    }
}

export function oppositeRemove(set, el) {
    if (set.opposite !== undefined) {
        if (el.sets[set.opposite].contains(set.el)) {
            el.sets[set.opposite].remove(set.el);
        }
    } else {
        // check supersets todo
        let queue = [];
        for (let otherSet in set.superSets) {
            queue.push(otherSet);
        }
        while (queue.length !== 0) { // this can be handled better
            let front = queue[0];
            queue.splice(front, 1);
            if (front.opposite !== undefined) {
                if (el.sets[set.opposite].contains(set.el)) {
                    el.sets[set.opposite].remove(set.el);
                }
                break;
            }
            for (let otherSet in front.superSets) {
                queue.push(otherSet);
            }
        }
    }
}

export class ElementReference {
    el = null;
    constructor(el) {
        if (typeof el === 'string') {
            this.id = el;
        } else {
            this.id = el.id;
            this.el = el;
        }
    }
}

export default class Set {
    constructor(el) {
        this.subSets = [];
        this.superSets = [];
        this.redefines = [];
        this.el = el;
        this.data = [];
        this.opposite = undefined;
    }

    subsets(set) {
        set.subSets.push(this);
        this.superSets.push(set);
    }

    add(el) {
        if (typeof el === 'string') {
            if (this.data.find(entry => entry.id === el)) {
                throw Error("duplicate element added to set!");
            }
        } else {
            if (this.data.find(entry => el.id === entry.id)) {
                throw Error("duplicate element added to set!");
            }
        }
        this.data.push(new ElementReference(el));
        for (let set of this.superSets) {
            if (!set.contains(el)) {
                set.add(el);
            }
        }
        if (typeof el !== 'string') {
            oppositeAdd(this, el);
        }
    }

    contains(el) {
        if (typeof el === 'string') {
            return this.data.find(e => el == e.id);
        }
        return this.data.find(e => el.id === e.id);
    }

    remove (el) {
        if (!this.data.find(entry => el.id === entry.id)) {
            throw Error("cannot remove item that is not in set!");
        }
        this.data.splice(new ElementReference(el), 1);
        for (let set of this.superSets) {
            if (set.contains(el)) {
                set.remove(el);
            }
        }
        oppositeRemove(this, el);
    }

    size() {
        return this.data.length;
    }

    [Symbol.asyncIterator]() {
        // Use a new index for each iterator. This makes multiple
        // iterations over the iterable safe for non-trivial cases,
        // such as use of break or nested looping over the same iterable.
        let index = 0;
        let me = this;
    
        return {
            // Note: using an arrow function allows `this` to point to the
            // one of `[@@iterator]()` instead of `next()`
            next: async () => {
                if (index < me.data.length) {
                    if (me.data[index].el === null) {
                        let elFromClient = me.el.manager.getLocal(me.data[index].id);
                        if (elFromClient === undefined) {
                            elFromClient = await me.el.manager.get(me.data[index].id);
                        }
                        if (elFromClient === undefined) {
                            throw new Error("could not find element in set with id " + me.data[index].id);
                        }
                        me.data[index].el = elFromClient;
                    }
                    const currIndex = index;
                    index++;
                    return { value: me.data[currIndex].el, done: false };
                } else {
                    return { done: true };
                }
            },
        };
    }

    ids() {
        return new IDs(this);
    }
}

class IDs {
    constructor(set) {
        this.set = set;
    }
    [Symbol.iterator]() {
        let index = 0;
        return {
            // Note: using an arrow function allows `this` to point to the
            // one of `[@@iterator]()` instead of `next()`
            next: () => {
                if (index < this.set.data.length) {
                    const currIndex = index;
                    index++;
                    return { value: this.set.data[currIndex].id, done: false };
                } else {
                    return { done: true };
                }
            },
        };
    }
}