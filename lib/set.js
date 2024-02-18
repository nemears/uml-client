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
        for (let otherSet of set.superSets) {
            queue.push(otherSet);
        }
        while (queue.length !== 0) { // this can be handled better
            let front = queue[0];
            queue.splice(front, 1);
            if (front.opposite !== undefined) {
                if (el.sets[front.opposite].contains(set.el)) {
                    el.sets[front.opposite].remove(set.el);
                }
                break;
            }
            for (let otherSet of front.superSets) {
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

export async function restoreReference(elementReference, set) {
    let elFromClient = set.el.manager.getLocal(elementReference.id);
    if (elFromClient === undefined) {
        elFromClient = await set.el.manager.get(elementReference.id);
    }
    if (elFromClient === undefined) {
        throw new Error("could not find element in set with id " + elementReference.id);
    }
    elementReference.el = elFromClient;
    const reference = elFromClient.references.get(set.el.id);
    if (!reference) {
        elFromClient.references.set(set.el.id, set.el);
    }
    const updateElementReferenceSet = (currSet) => {
        const dataVal = currSet.data.find((ref) => ref.id === elementReference.id);
        if (dataVal) {
            dataVal.el = elementReference.el;
        }
    };
    const updateElementReferenceSingleton = (currSet) => {
        if (currSet.val.id === elementReference.id) {
            currSet.val.el = elementReference.el;
        }
    };
    const queue = [set];
    while (!queue.length > 0) {
        const currSet = queue.pop();
        if (currSet.data) {
            // set
            updateElementReferenceSet(currSet);
        } else if (currSet.val) {
            // singleton
            updateElementReferenceSingleton(currSet);
        } else {
            throw new Error('invalid set type given to restore reference!');
        } 
        for (const superSet of currSet.superSets) {
            queue.push(superSet);
        }
    }
    queue.push(set);
    while (queue.length > 0) {
        const currSet = queue.pop();
        if (currSet.data) {
            // set
            updateElementReferenceSet(currSet);
        } else if (currSet.val) {
            updateElementReferenceSingleton(currSet);
        }
        for (const subSet of currSet.subSets) {
            queue.push(subSet);
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

    redefines(set) {
        if (!set.redefines.includes(this)) {
            set.redefines.push(this);
        }
        if (!this.redefines.includes(set)) {
            this.redefines.push(set);
        }
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

        // add to data
        this.data.push(new ElementReference(el));

        // handle subsets
        for (let set of this.superSets) {
            if (!set.contains(el)) {
                set.add(el);
            }
        }
        for (let set of this.redefines) {
            if (!set.contains(el)) {
                set.add(el);
            }
        }
        if (typeof el !== 'string') {
            // handle references
            if (!el.references.has(this.el.id)) {
                el.references.set(this.el.id, this.el);
            } // TODO else we add reference count

            // handle opposite
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

        const removeFromSet = (set) => {
            set.data = set.data.filter(entry => el.id !== entry.id);

            for (let superset of set.superSets) {
                if (superset.contains(el)) {
                    removeFromSet(superset);
                }
            }
            for (let subset of set.subSets) {
                if (subset.contains(el)) {
                   removeFromSet(subset);
                }
            }
            for (let redefinedSet of set.redefines) {
                if (redefinedSet.contains(el)) {
                    removeFromSet(redefinedSet);
                }
            }
        }

        removeFromSet(this);
        oppositeRemove(this, el);
        
        // check other sets to see if we need to remove references
        if (this.el.references.has(el.id)) {
            let removeReference = true;
            for (const entry of Object.entries(this.el.sets)) {
                if (entry[1].contains(el.id)) {
                    removeReference = false;
                    break;
                }
            }
            if (removeReference) {
                for (const entry of Object.entries(el.sets)) {
                    if (entry[1].contains(this.el.id)) {
                        removeReference = false;
                        break;
                    }
                }
                if (removeReference) {
                    this.el.references.delete(el.id);
                    el.references.delete(this.el.id);
                }
            }
        }
    }

    size() {
        return this.data.length;
    }

    async front() {
        if (this.size() === 0) {
            return undefined;
        }
        if (this.data[0].el === null) {
            await restoreReference(this.data[0], this);
        }
        return this.data[0].el;
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
                        await restoreReference(me.data[index], me); 
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

    async filter(func) {
        let ret = [];
        for await(const el of this) {
            if (func(el)) {
                ret.push(el);
            }
        }
        return ret;
    }

    ids() {
        return new IDs(this);
    }

    unsafe() {
        return new Unsafe(this);
    }

    async clone() {
        const ret = [];
        for await (const el of this) {
            ret.push(el);
        }
        return ret;
    }
}

export function subsetContains(set, id) {
    let queue = set.subSets;
    queue.push(set);
    while (queue.length > 0) {
        const currSet = queue.shift();
        if (currSet.contains(id)) {
            return true;
        }
        for (let subset of currSet.subSets) {
            queue.push(subset);
        }
    }
    return false;
}

class IDs {
    constructor(set) {
        this.set = set;
    }
    front() {
        if (this.set.size() === 0) {
            return undefined;
        }
        return this.set.data[0].id;
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

class Unsafe {
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
                    return { value: this.set.data[currIndex].el, done: false };
                } else {
                    return { done: true };
                }
            },
        }; 
    }
}
