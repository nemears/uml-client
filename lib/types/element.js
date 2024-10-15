import UmlSet, { removeFromReadOnlySet} from '../set.js'
import Singleton, { internalSet } from '../singleton.js';
import { 
    ELEMENT_ID,
    ELEMENT_APPLIED_STEREOTYPES_ID, 
    ELEMENT_OWNED_COMMENTS_ID, 
    ELEMENT_OWNED_ELEMENTS_ID, 
    ELEMENT_OWNER_ID 
} from '../modelIds';

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
    sets = new Map();
    specialData = new Map();

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    setBase(base) {
        this.base.add(base);
    }

    getSet(id) {
        const queue = [this];
        while (queue.length > 0) {
            const front = queue.shift();
            const match = front.sets.get(id);
            if (match !== undefined) {
                return match;
            }
            for (const base of front.base) {
                queue.push(base);
            }
        }
        return undefined;
    }
    getSpecialData(id) {
        const queue = [this];
        while (queue.length > 0) {
            const front = queue.shift();
            const match = front.specialData.get(id);
            if (match !== undefined) {
                return match;
            }
            for (const base of front.base) {
                queue.push(base);
            }
        }
        return undefined;
    }
}

export function extendBaseElement(el, manager) {
    el.references = new Map()
    el.manager = manager;
    el.id = randomID();
    el.elementType = function() {
        return el.typeInfo.name;
    }
    el.is = function(type) {
        const queue = [el.typeInfo];
        while (queue.length > 0) {
            const front = queue.shift();
            if (front.name === type) {
                return true;
            }
            if (front.id === type) {
                return true;
            }
            for (const base of front.base) {
                queue.push(base);
            }
        }
        return false;
    }
    el.emit = function() {
        const ret = {};
        ret[el.typeInfo.name] = {};
        const data = ret[el.typeInfo.name];
        data.id = el.id;
        const queue = [el.typeInfo];
        while (queue.length > 0) {
            const front = queue.shift();
           
            // per type emit
            for (const dataPair of front.specialData) {
                const dataName = dataPair[0];
                const dataPolicy = dataPair[1];
                if (dataPolicy.getData().length > 0) {
                    data[dataName] = dataPolicy.getData();
                }
            }
            
            // sets
            const visited = new Set();
            for (const set of front.sets.values()) {
                if (visited.has(set)) {
                    continue;
                }
                visited.add(set);
                if (!set.rootSet()) {
                    continue;
                }
                if (set.setType() === 'set') {
                    let numElsInSet = set.size();
                    for (const id of set.ids()) {
                        if (set.subSetContains(id)) {
                            numElsInSet--;
                        }
                    }
                    if (numElsInSet === 0) {
                        continue;
                    }
                    if (numElsInSet > 0) {
                        data[set.name] = [];
                        for (const id of set.ids()) {
                            data[set.name].push(id);
                        }
                    }
                } else if (set.setType() === 'singleton') {
                    if (set.has()) {
                        if (set.subSetContains(set.id())) {
                            continue;
                        }
                        if (set.composition === 'anticomposite') {
                            ret[set.name] = set.id();
                        } else {
                            data[set.name] = set.id();
                        }
                    }
                } else {
                    throw Error('TODO');
                }
            }

            for (const base of front.base) {
                queue.push(base);
            }
        }
        return ret;
    }
    el.delete = async function() {

        // recursively delete children first
        {
            const queue = [el.typeInfo];
            const visited = new Set();
            while (queue.length > 0) {
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
                    if (set.composition === 'composite') {
                        if (set.setType() === 'set') {
                            for await (const child of set) {
                                await manager.delete(child);
                            }
                        } else if (set.setType() === 'singleton') {
                            if (set.has()) {
                                await manager.delete(await set.get());
                            }
                        } else {
                            throw Error('TODO');
                        }
                    }
                }
                for (const base of front.base) {
                    queue.push(base);
                }    
            }
        }

        // cleanup references reference to us
        await cleanupReferences(el);
        
        const queue = [el.typeInfo];
        const visited = new Set();
        while (queue.length > 0) {
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
                    while (set.size() > 0) {
                        await removeFromReadOnlySet(await set.front(), set);
                    }
                } else if (set.setType() === 'singleton') {
                    if (set.has()) {
                        await internalSet(undefined, set);
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
}

export class BaseElement {
    constructor(manager) {
        extendBaseElement(this, manager);
    }
}

export default class Element extends BaseElement {

    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(ELEMENT_ID, 'Element');
        this.elementTypeInfo = this.typeInfo;
        this.ownedElements = new UmlSet(this, ELEMENT_OWNED_ELEMENTS_ID, 'ownedElements');
        this.ownedElements.readonly = true;
        this.ownedElements.composition = 'composite';
        this.ownedElements.opposite = ELEMENT_OWNER_ID;
        this.owner = new Singleton(this, ELEMENT_OWNER_ID, 'owner');
        this.owner.readonly = true;
        this.owner.composition = 'anticomposite';
        this.owner.opposite = ELEMENT_OWNED_ELEMENTS_ID;
        this.appliedStereotypes = new UmlSet(this, ELEMENT_APPLIED_STEREOTYPES_ID, 'appliedStereotypes'); // NOT CANNON , this is how we are slipping MOF into UML
        this.ownedComments = new UmlSet(this, ELEMENT_OWNED_COMMENTS_ID, 'ownedComments');
        this.ownedComments.subsets(this.ownedElements);
    }
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
            referenceEl = await elToDelete.manager.get(referenceID);
        }
        const queue = [referenceEl.typeInfo];
        const visited = new Set();
        while (queue.length > 0) {
            const front = queue.shift();
            if (visited.has(front)) {
                continue;
            }
            visited.add(front);
            for (const setPair of front.sets) {
                const set = setPair[1];
                if (set.contains(elToDelete)) {
                    await set.remove(elToDelete);
                }
            }
            for (const base of front.base) {
                queue.push(base);
            }
        }
        referenceEl.references.delete(elToDelete.id);
    }
}
