import { nullID } from "./element";
import NamedElement from "./namedElement";
import Singleton from "../singleton";

export default class TypedElement extends NamedElement {
    constructor(manager) {
        super(manager);
        assignTypedElementSets(this);
    }
}

export function assignTypedElementSets(typedElement) {
    typedElement.type = new Singleton(typedElement);
    typedElement.sets.set('type', typedElement.type);
    typedElement.elementTypes.add('TypedElement');
}

export function emitTypedElement(data, alias, typedElement) {
    if (typedElement.type.id() !== nullID()) {
        data[alias].type = typedElement.type.id();
    }
}
