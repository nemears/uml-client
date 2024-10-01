import { TypeInfo } from './element';
import NamedElement from "./namedElement";
import Singleton from "../singleton";
import { TYPED_ELEMENT_ID, TYPED_ELEMENT_TYPE_ID } from '../modelIds';

export default class TypedElement extends NamedElement {
    constructor(manager) {
        super(manager);
        assignTypedElementSets(this);
    }
}

export function assignTypedElementSets(typedElement) {
    typedElement.typeInfo = new TypeInfo(TYPED_ELEMENT_ID, 'TypedElement');
    typedElement.typedElementTypeInfo = typedElement.typeInfo;
    typedElement.typeInfo.setBase(typedElement.namedElementTypeInfo);
    typedElement.type = new Singleton(typedElement, TYPED_ELEMENT_TYPE_ID, 'type');
}
