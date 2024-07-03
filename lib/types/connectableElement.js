import ParameterableElement from "./parameterableElement";
import { assignTypedElementSets } from "./typedElement";

export default class ConnectableElement extends ParameterableElement {
    constructor(manager) {
        super(manager);
        assignTypedElementSets(this);
        assignConnectableElement(this);
    }
}

export function assignConnectableElement(connectableElement) {
    connectableElement.elementTypes.add('ConnectableElement');
}
