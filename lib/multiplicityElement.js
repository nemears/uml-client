import { nullID } from "./element";
import Singleton from "./singleton";

export default function assignMultiplicityElementSets(multiplicityElement) {
    multiplicityElement.lowerValue = new Singleton(multiplicityElement);
    multiplicityElement.upperValue = new Singleton(multiplicityElement);
    multiplicityElement.lowerValue.subsets(multiplicityElement.ownedElements);
    multiplicityElement.upperValue.subsets(multiplicityElement.ownedElements);
    multiplicityElement.lower = undefined;
    multiplicityElement.upper = undefined;
    multiplicityElement.sets['lowerValue'] = multiplicityElement.lowerValue;
    multiplicityElement.sets['upperValue'] = multiplicityElement.upperValue;
}

export function isSubClassOfMultiplicityElement(elementType) {
    return elementType === 'multiplicityElement' || elementType === 'MULTIPLICITY_ELEMENT';
}

export function emitMultiplicityElement(data, alias, multiplicityElement) {
    if (multiplicityElement.lowerValue.id() !== nullID()) {
        data[alias].lowerValue = multiplicityElement.lowerValue.id();
    }
    if (multiplicityElement.upperValue.id() !== nullID()) {
        data[alias].upperValue = multiplicityElement.upperValue.id();
    }
}