import { TypeInfo } from './element.js';
import Singleton from "../singleton.js";
import { MULTIPLICITY_ELEMENT_ID, MULTIPLICITY_ELEMENT_LOWER_VALUE_ID, MULTIPLICITY_ELEMENT_UPPER_VALUE_ID } from '../modelIds.js';

export default function assignMultiplicityElementSets(multiplicityElement) {
    multiplicityElement.typeInfo = new TypeInfo(MULTIPLICITY_ELEMENT_ID, 'MultiplicityElement');
    multiplicityElement.multiplicityElementTypeInfo = multiplicityElement.typeInfo;
    multiplicityElement.typeInfo.setBase(multiplicityElement.elementTypeInfo);
    multiplicityElement.isOrdered = false;
    multiplicityElement.isUnique = true;
    multiplicityElement.lowerValue = new Singleton(multiplicityElement, MULTIPLICITY_ELEMENT_LOWER_VALUE_ID, 'lowerValue');
    multiplicityElement.upperValue = new Singleton(multiplicityElement, MULTIPLICITY_ELEMENT_UPPER_VALUE_ID, 'upperValue');
    multiplicityElement.lowerValue.subsets(multiplicityElement.ownedElements);
    multiplicityElement.upperValue.subsets(multiplicityElement.ownedElements);
    multiplicityElement.lower = undefined;
    multiplicityElement.upper = undefined;
}
