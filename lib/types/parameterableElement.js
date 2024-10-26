import { TypeInfo } from './element.js';
import Element from "./element.js";
import Singleton from "../singleton.js";
import { PARAMETERABLE_ELEMENT_ID } from '../modelIds.js';

export default class ParameterableElement extends Element {
    constructor(manager) {
        super(manager);
        assignParameterableElementSets(this);
    }
}

export function assignParameterableElementSets(parameterableElement) {
    parameterableElement.parameterableElementTypeInfo = new TypeInfo(PARAMETERABLE_ELEMENT_ID, 'ParameterableElement');
    parameterableElement.typeInfo = parameterableElement.parameterableElementTypeInfo;
    parameterableElement.typeInfo.setBase(parameterableElement.elementTypeInfo);
    // parameterableElement.templateParameter = new Singleton(parameterableElement);
    // parameterableElement.owningTemplateParameter = new Singleton(parameterableElement);
    // parameterableElement.owningTemplateParameter.subsets(parameterableElement.templateParameter);
    // parameterableElement.owningTemplateParameter.subsets(parameterableElement.owner);
    // parameterableElement.templateParameter.opposite = 'parameteredElement';
    // parameterableElement.owningTemplateParameter.opposite = 'ownedParameteredElement';
    // parameterableElement.sets.set('templateParameter', parameterableElement.templateParameter);
    // parameterableElement.sets.set('owningTemplateParameter', parameterableElement.owningTemplateParameter);
    // parameterableElement.elementTypes.add('ParameterableElement');
}
