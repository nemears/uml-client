import ParameterableElement from "./parameterableElement";
import { assignTypedElementSets } from "./typedElement";
import Set from "./set";
import Singleton from "./singleton";

export default class ConnectableElement extends ParameterableElement {
    constructor(manager) {
        super(manager);
        assignTypedElementSets(this);
        this.structuredClassifiers = new Set(this);
        this.templateParameter = new Singleton(this);
        this.ends = new Set(this);
        this.structuredClassifiers.readonly;
        this.ends.readonly;
        this.structuredClassifiers.subsets(this.memberNamespace);
        this.structuredClassifiers.opposite = 'role';
        this.templateParameter.opposite = 'parameteredElement'
        this.ends.opposite = 'role';
    }
}

export function isSubClassOfConnectableElement(elementType) {
    return elementType === 'connectableElement' || elementType === 'CONNECTABLE_ELEMENT';
}