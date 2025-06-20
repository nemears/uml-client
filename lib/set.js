import AbstractSet from './abstractSet.js';
import { internalSet } from './singleton.js';

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
    constructor(el, id, name, additionPolicy, removalPolicy) {
        super(el, id, name, additionPolicy, removalPolicy);
        this.data = [];
    }

    add(el) {
        if (this.rootRedefinedSet.readonly) {
            throw Error("cannot add to readonly set!");
        }
        return addToReadOnlySet(el, this);
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
        if (this.rootRedefinedSet.readonly) {
            throw Error("cannot remove from readonly set!");
        }
        await removeFromReadOnlySet(el, this);
    }

    async clear() {
        while (this.size() > 0) {
            await this.remove(await this.front());
        }
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
            const opposite = el.typeInfo.getSet(front.opposite);
            if (!opposite.contains(set.el)) { // TODO not do it this way, do an inner add function
                if (opposite.setType() === 'set') {
                    await addToReadOnlySet(set.el, opposite);
                } else if (opposite.setType() === 'singleton') {
                    await internalSet(set.el, opposite);
                }
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
            const opposite = el.typeInfo.getSet(front.opposite);
            if (!opposite) {
                continue;
            }
            if (opposite.contains(set.el)) {
                if (opposite.setType() === 'set') {
                    await removeFromReadOnlySet(set.el, opposite);
                } else if (opposite.setType() === 'singleton') {
                    await internalSet(undefined, opposite);
                }
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

export function addToReadOnlySet(el, set) {
    const me = set.rootRedefinedSet;
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


                    const decreaseSizeQueue = [currentSuperSet];
                    const decreaseSizeVisited = new Set();
                    while (decreaseSizeQueue.length > 0) {
                        const decreaseSizeSet = decreaseSizeQueue.shift();
                        if (decreaseSizeVisited.has(decreaseSizeSet)) {
                            continue;
                        }
                        decreaseSizeVisited.add(decreaseSizeSet);
                        decreaseSizeSet._size--;
                        for (const decreaseSizeSuperSet of decreaseSizeSet.superSets) {
                            decreaseSizeQueue.push(decreaseSizeSuperSet);
                        }
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

    me.el._update_to_server = true;
    
    if (typeof el === 'string') {
        if (!me.el.references.has(el)) {
            me.el.references.set(el, undefined);
        }
    } else {
        if (!me.el.references.has(el.id)) {
            me.el.references.set(el.id, el);
        }
    }
    
    // handle opposite and policies asyncly
    const retPromise = async() => {
        if (typeof el !== 'string') {
            // handle references
            if (!el.references.has(me.el.id)) {
                el.references.set(me.el.id, me.el);
            }

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
                    if (redefinedSet.additionPolicy) {
                        await redefinedSet.additionPolicy(el, me.el);
                    }
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

export async function removeFromReadOnlySet(el, set) {
    const me = set.rootRedefinedSet;
    if (!me.contains(el)) {
        throw Error("cannot remove item that is not in set!");
    }

    let id;
    if (typeof el === 'string') {
        id = el;
    } else {
        id = el.id;
    }

    let bottomSet = me;
    {
        // remove data
        const queue = [me]
        while (queue.length > 0) {
            bottomSet = queue.shift();
            let index = 0;
            let found = false;
            for (const elReference of bottomSet.data) {
                if (elReference.id === id) {
                    bottomSet.data.splice(index, 1);
                    found = true;
                    break;
                }
                index++;
            }
            if (found) {
                if (bottomSet.data.length === 0) {
                    adjustEmptySet(bottomSet);
                }
                break;
            }
            for (const subSet of bottomSet.subSetsWithData) {
                queue.push(subSet);
            }
        }
    }

    {
        // adjust sizes
        // run removal policies
        const visited = new Set();
        const queue = [bottomSet];
        while (queue.length > 0) {
            const front = queue.shift();
            if (visited.has(front)) {
                continue;
            }
            visited.add(front);
            front._size--;
            if (front.removalPolicy) {
                const elToRemove = await me.manager.get(id);
                await front.removalPolicy(elToRemove, me.el);
            }
            for (const redefinedSet of front.redefinedSets) {
                if (redefinedSet.removalPolicy) {
                    const elToRemove = await me.manager.get(id);
                    await redefinedSet.removalPolicy(elToRemove, me.el);
                }
            }
            for (const superSet of front.superSets) {
                queue.push(superSet);
            }
        }
    }

    

    await oppositeRemove(bottomSet, el);
    
    // check other sets to see if we need to remove references
    if (set.el.references.has(el.id)) {
        let removeReference = true;
        const queue = [set.el.typeInfo];
        while (queue.length > 0) {
            const front = queue.shift();
            for (const entry of Object.entries(front.sets)) {
                if (entry[1].contains(el.id)) {
                    removeReference = false;
                    break;
                }
            }
            if (!removeReference) {
                break;
            }
            for (const base of front.base) {
                queue.push(base);
            }
        }
        
        if (removeReference) {
            set.el.references.delete(el.id);
            el.references.delete(set.el.id);
        }
    }
}

export async function restoreReference(elementReference, set) {
    let elFromClient = set.manager.getLocal(elementReference.id);
    if (elFromClient === undefined) {
        elFromClient = await set.manager.get(elementReference.id);
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
        if (currentSetToAdjust.subSetsWithData.has(emptySet)) {
            currentSetToAdjust.subSetsWithData.delete(emptySet);
        }
        if (currentSetToAdjust.data.length === 0) {
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
        for (const subSet of currentSet.subSetsWithData) {
            queue.push(subSet);
        }
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
