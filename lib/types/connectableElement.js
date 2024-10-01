import { TypeInfo } from './element';
import ParameterableElement from "./parameterableElement";
import { assignTypedElementSets } from "./typedElement";
import { CONNECTABLE_ELEMENT_ID } from '../modelIds';

export default class ConnectableElement extends ParameterableElement {
    constructor(manager) {
        super(manager);
        assignTypedElementSets(this);
        assignConnectableElement(this);
    }
}

export function assignConnectableElement(connectableElement) {
    connectableElement.connectableElementTypeInfo = new TypeInfo(CONNECTABLE_ELEMENT_ID, 'ConnectableElement');
    connectableElement.typeInfo = connectableElement.connectableElementTypeInfo;
    connectableElement.typeInfo.setBase(connectableElement.typedElementTypeInfo);
    connectableElement.typeInfo.setBase(connectableElement.parameterableElementTypeInfo);
}
