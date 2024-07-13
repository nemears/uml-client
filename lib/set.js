import AbstractSet from './abstractSet';

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

export default class UmlSet extends AbstractSet {
    constructor(el, additionPolicy, removalPolicy) {
        super(el, additionPolicy, removalPolicy);
        this.data = [];
    }

    add(el) {
        if (this.readonly) {
            throw Error("cannot add to readonly set!");
        }
        const me = this.rootRedefinedSet;
        if (typeof el === 'string') {
            if (me.data.find(entry => entry.id === el)) {
                throw Error("duplicate element added to set!");
            }
        } else {
            if (me.data.find(entry => el.id === entry.id)) {
                throw Error("duplicate element added to set!");
            }
        }

        // add to data
        const newData = new ElementReference(el);
        me.data.push(newData);

        me._size++;

        const visited = new Set([me]);

        // check to see if the element is already in a superset and update size
        for (const superSet of me.superSets) {
            const queue = [superSet];
            while (queue.length > 0) {
                const currentSuperSet = queue.shift();
                if (visited.has(currentSuperSet)) {
                    continue;
                }
                currentSuperSet._size++;
                visited.add(currentSuperSet);
                // check data to see if it's here
                let index = 0;
                for (const elementReference of currentSuperSet.data) {
                    if (elementReference.id === newData.id) {
                        // remove the element
                        currentSuperSet.data.splice(index, 1);
                        
                        if (currentSuperSet.data.length === 0) {
                            adjustEmptySet(currentSuperSet);
                        }

                        break;
                    }
                    index++;
                }

                for (const currentSuperSetSuperSet of currentSuperSet.superSets) {
                    queue.push(currentSuperSetSuperSet);
                }
            }
        }

        // add this set to all valid subSetsWithData in superSets
        for (const superSet of me.superSets) {
            // add to this set and supersets until we hit more data
            const queue = [superSet];
            while (queue.length > 0) {
                const currentSuperSet = queue.shift();
                if (!currentSuperSet.subSetsWithData.has(me)) {
                    currentSuperSet.subSetsWithData.add(me);
                    if (currentSuperSet.data.length === 0) {
                        for (const currentSuperSetSuperSet of currentSuperSet.superSets) {
                            queue.push(currentSuperSetSuperSet);
                        }
                    }
                }
            }
        }
        
        // handle opposite and policies asyncly
        const retPromise = async() => {
            if (typeof el !== 'string') {
                // handle references
                if (!el.references.has(me.el.id)) {
                    el.references.set(me.el.id, me.el);
                } // TODO else we add reference count

                // handle policy
                const visited = new Set();
                const queue = [me];
                while (queue.length > 0) {
                    const front = queue.shift();
                    if (visited.has(front)) {
                        continue;
                    }
                    visited.add(front);
                    if (front.additionPolicy) {
                        await front.additionPolicy(el, me.el);
                    }
                    for (const redefinedSet of front.redefinedSets) {
                        await redefinedSet.additionPolicy(el, me.el);
                    }
                    for (const superSet of front.superSets) {
                        queue.push(superSet);
                    }
                }

                // handle opposite
                await oppositeAdd(me, el);
            }
        }
        return retPromise();
    }

    contains(el) {
        let id = el;
        if (typeof el === 'object') {
            id = el.id;
        }
        for (const elementID of this.ids()) {
            if (elementID === id) {
                return true;
            }
        }
        return false;
    }

    async remove (el) {
        if (this.readonly) {
            throw Error("cannot remove from readonly set!");
        }
        const me = this.rootRedefinedSet;
        if (!me.contains(el)) {
            throw Error("cannot remove item that is not in set!");
        }

        let id;
        if (typeof el === 'string') {
            id = el;
        } else {
            id = el.id;
        }

        {
            // adjust sizes
            // run removal policies
            const visited = new Set();
            const queue = [me];
            while (queue.length > 0) {
                const front = queue.shift();
                if (visited.has(front)) {
                    continue;
                }
                visited.add(front);
                front._size--;
                if (front.removalPolicy) {
                    const elToRemove = await me.el.manager.get(id);
                    await front.removalPolicy(elToRemove, me.el);
                }
                for (const redefinedSet of front.redefinedSets) {
                    if (redefinedSet.removalPolicy) {
                        const elToRemove = await me.el.manager.get(id);
                        await redefinedSet.removalPolicy(elToRemove, me.el);
                    }
                }
                for (const superSet of front.superSets) {
                    queue.push(superSet);
                }
            }
        }

        // remove data
        const queue = [me]
        while (queue.length > 0) {
            const front = queue.shift();
            let index = 0;
            let found = false;
            for (const elReference of front.data) {
                if (elReference.id === id) {
                    front.data.splice(index, 1);
                    found = true;
                    break;
                }
                index++;
            }
            if (found) {
                if (front.data.length === 0) {
                    adjustEmptySet(front);
                }
                break;
            }
            for (const subSet of front.subSetsWithData) {
                queue.push(subSet);
            }
        }

        await oppositeRemove(this, el);
        
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

    async clear() {
        while (this.size() > 0) {
            await this.remove(await this.front());
        }
    }

    size() {
        return this.rootRedefinedSet._size;
    }

    async front() {
        if (this.size() === 0) {
            return undefined;
        }

        const me = this.rootRedefinedSet;
        let data;
        if (me.data.length === 0) {
            data = me.subSetsWithData.values().next().value.data
        } else {
            data = me.data;
        }

        if (data[0].el === null) {
            await restoreReference(data[0], me);
        }
        return data[0].el;
        
    }

    [Symbol.asyncIterator]() {
        const me = this;
        return createNext(me, async (reference) => {
            if (reference.el === null) {
                await restoreReference(reference, me);
            }
            return reference.el;
        }, true);
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

    setType() {
        return 'set';
    }
}

export async function oppositeAdd(set, el) {
    const queue = [set];
    while (queue.length > 0) {
        const front = queue.shift();
        if (front.opposite) {
            const opposite = el.sets.get(front.opposite);
            if (!opposite.contains(set.el)) { // TODO not do it this way, do an inner add function
                await opposite.add(set.el);
            }
            break;
        }
        for (const superSet of front.superSets) {
            queue.push(superSet);
        }
    }
}

export async function oppositeRemove(set, el) {
    const queue = [set];
    while (queue.length > 0) {
        const front = queue.shift();
        if (front.opposite) {
            const opposite = el.sets.get(front.opposite);
            if (opposite.contains(set.el)) {
                await opposite.remove(set.el);
            }
            break;
        }
        for (const superSet of front.superSets) {
            queue.push(superSet);
        }
    }
}

class IDs {
    constructor(set) {
        this.set = set;
    }
    front() {
        if (this.set.size() === 0) {
            return undefined;
        }
        let me = this.set.rootRedefinedSet;
        let data;
        if (me.data.length === 0) {
            data = me.subSetsWithData.values().next().value.data
        } else {
            data = me.data;
        }
        return data[0].id;
    }
    [Symbol.iterator]() {
        return createNext(this.set, (reference) => {
            return reference.id;
        });
    }
}

class Unsafe {
    constructor(set) {
        this.set = set;
    }
    [Symbol.iterator]() {
        return createNext(this.set, (reference) => {
            return reference.el;
        });
    }
    front() {
        if (this.set.size() === 0) {
            return undefined;
        }
        let me = this.set.rootRedefinedSet;
        let data;
         if (me.data.length === 0) {
            data = me.subSetsWithData.values().next().value.data
        } else {
            data = me.data;
        }
        return data[0].el;
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

function adjustEmptySet(emptySet) {
    // replace subSetsWithData in all superSets with ours until we hit data
    const adjustQueue = [];
    for (const currentSuperSetSuperSet of emptySet.superSets) {
        adjustQueue.push(currentSuperSetSuperSet);
    }
    while (adjustQueue.length > 0) {
        const currentSetToAdjust = adjustQueue.shift();
        if (currentSetToAdjust.data.length === 0) {
            currentSetToAdjust.subSetsWithData = new Set();
            for (const setToCopy of emptySet.subSetsWithData) {
                currentSetToAdjust.subSetsWithData.add(setToCopy);
            }
            for (const setToAdjustSuperSet of currentSetToAdjust.superSets) {
                adjustQueue.push(setToAdjustSuperSet);
            }
        }
    }
}

function createNext(me, valueCreator, isAsync) {
    let index = 0;
    let currentSet = me.rootRedefinedSet;
    let queue = [];
    for (const subSet of currentSet.subSetsWithData) {
        queue.push(subSet);
    }
    if (currentSet.data.length === 0 && queue.length > 0) {
        currentSet = queue.shift();
    }

    const increaseIt = () => {
        index++;
        const makeValid = () => {
            currentSet = queue.shift();
            index = 0;
            for (const subSet of currentSet.subSetsWithData) {
                queue.push(subSet);
            }
        };
        if (currentSet.setType() === 'set') {
            if (currentSet.data.length <= index && queue.length > 0) {
                // make state valid for next next
                makeValid();   
            }
        } else if (currentSet.setType() === 'singleton') {
            if (queue.length > 0) {
                makeValid();
            }
        } else {
            throw Error('TODO, iterator');
        }
    }

    const getRet = () => {
       if (currentSet.setType() === 'set') {
            if (currentSet.data.length > index) {
                let ret = {  done: false };
                increaseIt();
                return ret;
            } else {
                return { done: true };
            }
        } else if (currentSet.setType() === 'singleton') {
            if (index === 0 && currentSet.val) {
                let ret = { done: false };
                increaseIt();
                return ret;
            } else {
                return { done: true };
            }
        } else {
            throw Error('TODO iterator');
        } 
    }

    if (isAsync) {
        return {
            next: async () => {
                let value;
                if (currentSet.setType() === 'set') {
                    if (currentSet.data.length > index) {
                        value = await valueCreator(currentSet.data[index]);
                    }
                } else if (currentSet.setType() === 'singleton') {
                    if (currentSet.val) {
                        value = await valueCreator(currentSet.val);
                    }
                } else {
                    throw Error('TODO iterator');
                }
                let ret = getRet();
                if (!ret.done) {
                    ret.value = value;
                }
                return ret;
            },
        };
    } else {
        return {
            next: () => {
                let value;
                if (currentSet.setType() === 'set') {
                    if (currentSet.data.length > index) {
                        value = valueCreator(currentSet.data[index]);
                    }
                } else if (currentSet.setType() === 'singleton') {
                    if (currentSet.val) {
                        value = valueCreator(currentSet.val);
                    }
                } else {
                    throw Error('TODO iterator');
                }
                let ret = getRet();
                if (!ret.done) {
                    ret.value = value;
                }
                return ret;
            }
        }
    }
}
