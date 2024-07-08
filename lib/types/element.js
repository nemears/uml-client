import { emitSet } from '../emit.js';
import UmlSet from '../set.js'
import Singleton from '../singleton.js';

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

export const ELEMENT_OWNED_ELEMENTS_ID = 'XtmmRpH294S3m9x9Bp8FT63LuCMl';
export const ELEMENT_OWNER_ID = 'XIKAlIqrt4NOzZBgAKzoXuLIH2DS';

export default class Element {

    references = new Map();
    elementTypes = new Set(['Element']);
    sets = new Map();

    constructor(manager) {
        this.manager = manager;
        this.id = randomID();
        this.ownedElements = new UmlSet(this);
        this.ownedElements.definingFeature = ELEMENT_OWNED_ELEMENTS_ID;
        this.ownedElements.opposite = ELEMENT_OWNER_ID;
        this.owner = new Singleton(this);
        this.owner.definingFeature = ELEMENT_OWNER_ID;
        this.owner.opposite = ELEMENT_OWNED_ELEMENTS_ID;
        this.appliedStereotypes = new UmlSet(this); // NOT CANNON , this is how we are slipping MOF into UML
        this.ownedComments = new UmlSet(this);
        this.ownedComments.subsets(this.ownedElements);
        this.sets.set('ownedElements', this.ownedElements);
        this.sets.set(ELEMENT_OWNED_ELEMENTS_ID, this.ownedElements);
        this.sets.set('owner', this.owner);
        this.sets.set(ELEMENT_OWNER_ID, this.owner);
        this.sets.set('appliedStereotypes', this.appliedStereotypes);
        this.sets.set('ownedComments', this.ownedComments);
    }

    is(type) {
        return this.elementTypes.has(type);
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
        set.remove(elToRemove);
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
            referenceEl = await this.getFromServer(referenceID);
        }
        for (const set of Object.values(referenceEl.sets)) {
            if (set.contains(elToDelete)) {
                set.remove(elToDelete);
            }
        }
        referenceEl.references.delete(elToDelete.id);
    }
}
