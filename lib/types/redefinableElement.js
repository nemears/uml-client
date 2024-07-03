import NamedElement from "./namedElement";
import UmlSet from "../set";

export default class RedefinableElement extends NamedElement {
    constructor(manager) {
        super(manager);
        assignRedefinableElementSets(this);
    }
}

export function assignRedefinableElementSets(redefinableElement) {
    redefinableElement.redefinedElements = new UmlSet(redefinableElement);
    redefinableElement.redefinitionContexts = new UmlSet(redefinableElement);
    redefinableElement.isLeaf = false;
    redefinableElement.redefinedElements.readonly = true;
    redefinableElement.redefinitionContexts.readonly = true;
    redefinableElement.sets.set('redefinedElements', redefinableElement.redefinedElements);
    redefinableElement.sets.set('redefinitionContexts', redefinableElement.redefinitionContexts);
    redefinableElement.elementTypes.add('RedefinableElement');
}
