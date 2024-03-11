import NamedElement from "./namedElement";
import Set from "./set";

export default class RedefinableElement extends NamedElement {
    constructor(manager) {
        super(manager);
        assignRedefinableElementSets(this);
        //this.isLeaf = false;

    }
}

export function assignRedefinableElementSets(redefinableElement) {
    redefinableElement.redefinedElements = new Set(redefinableElement);
    redefinableElement.redefinitionContexts = new Set(redefinableElement);
    redefinableElement.isLeaf = false;
    redefinableElement.redefinedElements.readonly;
    redefinableElement.redefinitionContexts.readonly;
    redefinableElement.redefinedElements.opposite = 'redefinableElements';
    redefinableElement.redefinitionContexts.opposite = 'redefinableElements';
}

export function isSubClassOfRedefinableElement(elementType) {
    return elementType === 'redefinableElement' || elementType === 'REDEFINABLE_ELEMENT';
}

/* export function emitRedefinableElement(data, alias, redefinableElement) {
    if (redefinableElement.redefinedElements.size() > 0) {
        data[alias].redefinedElements = [];
        for (let redefinedElementID of redefinableElement.redefinedElements.ids()) {
            data[alias].redefinedElements.push(redefinedElementID);
        }
    }
    if (redefinableElement.redefinitionContexts.size() > 0) {
        data[alias].redefinitionContexts = [];
        for (let redefinedContextID of redefinableElement.redefinitionContexts.ids()) {
            data[alias].redefinitionContexts.push(redefinedContextID);
        }
    }
} */