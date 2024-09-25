import { TypeInfo } from './element';
import NamedElement from "./namedElement";
import UmlSet from "../set";
import { REDEFINABLE_ELEMENT_REDEFINED_ELEMENTS, REDEFINABLE_ELEMENT_REDEFINITION_CONTEXT } from '../modelIds';

export default class RedefinableElement extends NamedElement {
    constructor(manager) {
        super(manager);
        assignRedefinableElementSets(this);
    }
}

export function assignRedefinableElementSets(redefinableElement) {
    redefinableElement.typeInfo = new TypeInfo("RedefinableElement");
    redefinableElement.redefinableElementTypeInfo = redefinableElement.typeInfo;
    redefinableElement.redefinableElementTypeInfo.setBase(redefinableElement.namedElementTypeInfo);
    redefinableElement.redefinedElements = new UmlSet(redefinableElement, REDEFINABLE_ELEMENT_REDEFINED_ELEMENTS, 'redefinedElements');
    redefinableElement.redefinitionContexts = new UmlSet(redefinableElement, REDEFINABLE_ELEMENT_REDEFINITION_CONTEXT, 'redefinitionContext');
    redefinableElement.isLeaf = false;
    redefinableElement.redefinedElements.readonly = true;
    redefinableElement.redefinitionContexts.readonly = true;
}
