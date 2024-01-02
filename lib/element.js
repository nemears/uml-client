import { emitSet } from './emit.js';
import Set from './set.js'
import Singleton from './singleton.js';

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

export default class Element {

    references = new Map();

    constructor(manager) {
        this.manager = manager;
        this.id = randomID();
        this.ownedElements = new Set(this);
        this.owner = new Singleton(this);
        this.appliedStereotypes = new Set(this);
        this.ownedComments = new Set(this);
        this.ownedComments.subsets(this.ownedElements);
        this.sets = {
            "ownedElements" : this.ownedElements,
            "owner" : this.owner,
            'appliedStereotypes': this.appliedStereotypes,
            "ownedComments" : this.ownedComments
        }
        this.ownedElements.opposite = "owner";
        this.owner.opposite = "ownedElements";
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

export function isSubClassOfElement(elementType) {
    return elementType === 'element' || elementType === 'ELEMENT';
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

export async function cleanupReferences(elToDelete) {
    for (const entry of elToDelete.references.entries()) {
        let referenceEl = entry[1];
        const referenceID = entry[0];
        if (!referenceEl) {
            referenceEl = await this.getFromServer(referenceID);
        }
        referenceEl.references.delete(elToDelete.id);
    }
}
