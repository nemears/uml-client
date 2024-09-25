import { TypeInfo } from './element';
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
    connectableElement.connectableElementTypeInfo = new TypeInfo('ConnectableElement');
    connectableElement.typeInfo = connectableElement.connectableElementTypeInfo;
    connectableElement.typeInfo.setBase(connectableElement.typedElementTypeInfo);
    connectableElement.typeInfo.setBase(connectableElement.parameterableElementTypeInfo);
}
