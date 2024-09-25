import { emitSet } from '../emit.js';
import UmlSet from '../set.js'
import Singleton from '../singleton.js';
import { ELEMENT_APPLIED_STEREOTYPES_ID, ELEMENT_OWNED_COMMENTS_ID, ELEMENT_OWNED_ELEMENTS_ID, ELEMENT_OWNER_ID } from '../modelIds';

export function randomID() {
    let ret  =  "";
    const base64chars = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
                        ,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
                        ,'0','1','2','3','4','5','6','7','8','9','_','&'];
    for (let i = 0; i < 28; i++) {
        ret += base64chars[Math.floor(Math.random() * 64)];
    }
    return ret;
}

export function nullID() {
    let ret = '';
    for (let i = 0; i < 28; i++) {
        ret += 'A';
    }
    return ret;
}


export class TypeInfo {
    base = new Set();
    derived = new Set();
    sets = new Map();
    specialEmit = (_data) => {};

    constructor(name) {
        this.name = name;
    }

    setBase(base) {
        this.base.add(base);
        base.derived.add(this);
    }
}

export default class Element {

    references = new Map();

    constructor(manager) {
        this.typeInfo = new TypeInfo('Element');
        this.elementTypeInfo = this.typeInfo;
        const me = this;
        this.typeInfo.specialEmit = (data) => {
            data.id = me.id;
        }
        this.manager = manager;
        this.id = randomID();
        this.ownedElements = new UmlSet(this, ELEMENT_OWNED_ELEMENTS_ID, 'ownedElements');
        this.ownedElements.opposite = ELEMENT_OWNER_ID;
        this.owner = new Singleton(this, ELEMENT_OWNER_ID, 'owner');
        this.owner.opposite = ELEMENT_OWNED_ELEMENTS_ID;
        this.appliedStereotypes = new UmlSet(this, ELEMENT_APPLIED_STEREOTYPES_ID, 'appliedStereotypes'); // NOT CANNON , this is how we are slipping MOF into UML
        this.ownedComments = new UmlSet(this, ELEMENT_OWNED_COMMENTS_ID, 'ownedComments');
        this.ownedComments.subsets(this.ownedElements);
    }

    setManager(manager) {
        this.manager = manager;
        for (const set of this.sets.values()) {
            set.manager = manager;
        }
    }

    elementType() {
        return this.typeInfo.name;
    }

    is(type) {
        const queue = [this.typeInfo];
        while (queue.length > 0) {
            const front = queue.shift();
            if (front.name === type) {
                return true;
            }
            for (const base of front.base) {
                queue.push(base);
            }
        }
        return false;
    }

    emit() {
        const ret = {};
        ret[this.typeInfo.name] = {};
        const data = ret[this.typeInfo.name];
        const queue = [this.typeInfo];
        while (queue.length > 0) {
            const front = queue.shift();
           
            // per type emit
            front.specialEmit(data);
            
            // sets
            const visited = new Set();
            for (const set of front.sets.values()) {
                if (visited.has(set)) {
                    continue;
                }
                visited.add(set);
                if (set.setType() === 'set') {
                    if (set.size() > 0) {
                        data[set.name] = [];
                        for (const id of set.ids()) {
                            data[set.name].push(id);
                        }
                    }
                } else if (set.setType() === 'singleton') {
                    if (set.has()) {
                        data[set.name] = set.id();
                    }
                } else {
                    throw Error('TODO');
                }
            }

            for (const base of front.base) {
                queue.push(base);
            }
        }
    }

    deleteData() {
        const queue = [this.typeInfo];
        const visited = new Set();
        while (!queue.length > 0) {
            const front = queue.shift();
            if (visited.has(front)) {
                continue;
            }
            visited.add(front);
            const visitedSets = new Set();
            for (const set of front.sets.values()) {
                if (visitedSets.has(set)) {
                    continue;
                }
                visitedSets.add(set);
                if (set.setType() === 'set') {
                    if (set.size()) {
                        set.clear()
                    }
                } else if (set.setType() === 'singleton') {
                    if (set.has()) {
                        set.set(undefined);
                    }
                } else {
                    throw Error('TODO');
                }
            }
            for (const base of front.base) {
                queue.push(base);
            }
        }
        cleanupReferences(this);
    }
}

export function emitEl(data, alias, el) {
    data[alias].id = el.id;
    if (el.owner.id() !== nullID()) {
        let foundSubSetOfOwnerThatIsPopulated = false;
        let queue = [...el.owner.subSets];
        while (queue.length != 0) {
            let currSingleton = queue.shift();
            if (currSingleton.id() !== nullID()) {
                foundSubSetOfOwnerThatIsPopulated = true;
                break;
            }
            for (let subset of currSingleton.subSets) {
                queue.push(subset);
            }
        }
        if (!foundSubSetOfOwnerThatIsPopulated) {
            data.owner = el.owner.id();
        }
    }
    emitSet(data, alias, el.appliedStereotypes, 'appliedStereotypes');
    emitSet(data, alias, el.ownedComments, 'ownedComments');
}

export async function deleteSet(set) {
    let elsToDelete = [];
    for await (let elToRemove of set) {
        elsToDelete.push(elToRemove);
    }
    for (let elToRemove of elsToDelete) {
        await set.remove(elToRemove);
    }
    return set;
}

export async function deleteElementData(el) {
    await deleteSet(el.ownedComments);
}

export async function cleanupReferences(elToDelete) {
    for (const entry of elToDelete.references.entries()) {
        let referenceEl = entry[1];
        const referenceID = entry[0];
        if (!referenceEl) {
            referenceEl = await elToDelete.manager.getFromServer(referenceID);
        }
        for (const set of Object.values(referenceEl.sets)) {
            if (set.contains(elToDelete)) {
                set.remove(elToDelete);
            }
        }
        referenceEl.references.delete(elToDelete.id);
    }
}
