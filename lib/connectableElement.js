import ParameterableElement from "./parameterableElement";
import { assignTypedElementSets } from "./typedElement";
import Set from "./set";
import Singleton from "./singleton";

export default class ConnectableElement extends ParameterableElement {
    constructor(manager) {
        super(manager);
        assignTypedElementSets(this);
    }
}


export function isSubClassOfConnectableElement(elementType) {
    return elementType === 'connectableElement' || elementType === 'CONNECTABLE_ELEMENT';
}
