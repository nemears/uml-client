import Element from "./element";
import Singleton from "../singleton";

export default class ParameterableElement extends Element {
    constructor(manager) {
        super(manager);
        assignParameterableElementSets(this);
    }
}

export function assignParameterableElementSets(parameterableElement) {
    parameterableElement.templateParameter = new Singleton(parameterableElement);
    parameterableElement.owningTemplateParameter = new Singleton(parameterableElement);
    parameterableElement.owningTemplateParameter.subsets(parameterableElement.templateParameter);
    parameterableElement.owningTemplateParameter.subsets(parameterableElement.owner);
    parameterableElement.templateParameter.opposite = 'parameteredElement';
    parameterableElement.owningTemplateParameter.opposite = 'ownedParameteredElement';
    parameterableElement.sets.set('templateParameter', parameterableElement.templateParameter);
    parameterableElement.sets.set('owningTemplateParameter', parameterableElement.owningTemplateParameter);
    parameterableElement.elementTypes.add('ParameterableElement');
}
