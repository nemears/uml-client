import { TypeInfo } from './element.js';
import NamedElement from "./namedElement.js";
import UmlSet from "../set.js";
import { 
    REDEFINABLE_ELEMENT_ID, 
    REDEFINABLE_ELEMENT_REDEFINED_ELEMENTS_ID, 
    REDEFINABLE_ELEMENT_REDEFINITION_CONTEXT_ID 
} from '../modelIds.js';

export default class RedefinableElement extends NamedElement {
    constructor(manager) {
        super(manager);
        assignRedefinableElementSets(this);
    }
}

export function assignRedefinableElementSets(redefinableElement) {
    redefinableElement.typeInfo = new TypeInfo(REDEFINABLE_ELEMENT_ID, "RedefinableElement");
    redefinableElement.redefinableElementTypeInfo = redefinableElement.typeInfo;
    redefinableElement.redefinableElementTypeInfo.setBase(redefinableElement.namedElementTypeInfo);
    redefinableElement.redefinedElements = new UmlSet(redefinableElement, REDEFINABLE_ELEMENT_REDEFINED_ELEMENTS_ID, 'redefinedElements');
    redefinableElement.redefinitionContexts = new UmlSet(redefinableElement, REDEFINABLE_ELEMENT_REDEFINITION_CONTEXT_ID, 'redefinitionContext');
    redefinableElement.isLeaf = false;
    redefinableElement.redefinedElements.readonly = true;
    redefinableElement.redefinitionContexts.readonly = true;
}
