import AbstractSet from './abstractSet';
import { oppositeAdd, oppositeRemove, ElementReference, restoreReference } from "./set";
import { nullID } from './types/element'

export default class Singleton extends AbstractSet {
    constructor(el, additionPolicy, removalPolicy) {
        super(el, additionPolicy, removalPolicy);
        this.val = undefined;
    }

    // Being a singleton assumes that everything that subsets this is also a singleton
    async set(val) {
        if (this.readonly) {
            throw Error('cannot set readonly singleton!');
        }
        await internalSet(val, this);
    }

    contains(el) {
        let id = el;
        if (typeof el === 'object') {
            id = el.id
        }
        const me = this.rootRedefinedSet;
        const ref = getReference(me);
        if (ref && ref.id === id) {
            return true;
        }
        return false;
    }

    async add(el) {
        await this.set(el);
    }

    async remove(el) {
        if (this.contains(el)) {
            await this.set(undefined);
        } else {
            throw Error("cannot remove element from singleton that is not its value");
        }
    }

    async get() {
        const me = this.rootRedefinedSet;
        const ref = getReference(me);
        if (ref) {
            if (!ref.el) {
                await restoreReference(ref, me);
            }
            return ref.el;
        }
        return undefined;
    }

    unsafe() {
        const ref = getReference(this.rootRedefinedSet);
        if (ref) {
            if (!ref.el) {
                throw Error('unsafe get!');
            }
            return ref.el;
        }
        return undefined;
    }

    id() {
        const ref = getReference(this.rootRedefinedSet);
        if (ref) {
            return ref.id;
        }
        return nullID();
    }

    has() {
        return getReference(this.rootRedefinedSet) !== undefined;
    }

    setType() {
        return 'singleton';
    }
}

function getReference(me) {
    if (me.val) {
        return me.val;
    }
    if (me.subSetsWithData.size > 0) {
        const subSetsWithDataIt = me.subSetsWithData.values();
        const iteratorValue = subSetsWithDataIt.next();
        return iteratorValue.value.val;
    }
    return undefined;
}

export async function internalSet(val, singleton) {
    const me = singleton.rootRedefinedSet;
    if (me.val || me.subSetsWithData.size > 0) {
        let currVal = me.val;
        if (!currVal) {
            currVal = me.subSetsWithData.values().next().value.val;
        }
        if (currVal.el === undefined || currVal.el === null) {
            restoreReference(currVal, me);
        }
        if (typeof val === 'string' && val === currVal.id) {
            return;
        } else if (typeof val === 'object' && val.id === currVal.id) {
           return; 
        }

        // run removal policies
        // decrease size
        const queue = [me];
        while (queue.length > 0) {
            const front = queue.shift();
            front._size--;
            if (front.removalPolicy) {
                await front.removalPolicy(currVal.el, me.el);
            }
            for (const redefinedSet of front.redefinedSets) {
                if (redefinedSet.removalPolicy) {
                    await redefinedSet.removalPolicy(currVal.el, me.el);
                }
            }
            for (const superSet of front.superSets) {
                queue.push(superSet);
            }
        }
       
        // remove value
        const removeValueFromSingleton = (singleton) => {
            singleton.val = undefined;
            // get rid of us in supersets
            const queue = [];
            for (const superSet of singleton.superSets) {
                queue.push(superSet);
            }
            while (queue.length > 0) {
                const front = queue.shift();
                if (front.subSetsWithData.has(singleton)) {
                    front.subSetsWithData.delete(singleton);
                    for (const superSet of front.superSets) {
                        queue.push(superSet);
                    }
                }
            }
        };
        if (me.val.id === currVal.id) {
            removeValueFromSingleton(me);
        } else {
            removeValueFromSingleton(me.subSetsWithData.values().next().value);
        }
       
        // run opposite
        await oppositeRemove(me, currVal.el);
    }

    if (val) {
        me.val = new ElementReference(val);

        // add to superSets
        let queue = [];
        for (const superSet of me.superSets) {
            queue.push(superSet);
        }

        while (queue.length > 0) {
            const front = queue.shift();
            front.subSetsWithData.add(me);
            if (front.setType() === 'singleton') {
                if (!front.val) {
                    for (const frontSuperSet of front.superSets) {
                        queue.push(frontSuperSet);
                    }
                }
            } else if (front.data) {
                if (front.data.length === 0) {
                    for (const frontSuperSet of front.superSets) {
                        queue.push(frontSuperSet);
                    }
                }
            }
        }

        // additionPolicy and size
        queue = [];
        while (queue.length > 0) {
            const front = queue.shift();
            front._size++;
            if (front.additionPolicy && typeof val === 'object') {
                await front.additionPolicy(val, me)
            }
            for (const superSet of front.superSets) {
                queue.push(superSet);
            }
        }
        
        if (typeof val === 'object') {
            // set up references
            if (!val.references.has(singleton.el.id)) {
                val.references.set(singleton.el.id, singleton.el);
            }

            await oppositeAdd(me, val);
        }
    }
}
