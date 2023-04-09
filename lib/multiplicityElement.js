import { nullID } from "./element";
import Singleton from "./singleton";

export default function assignMultiplicityElementSets(multiplicityElement) {
    multiplicityElement.lowerValue = new Singleton(multiplicityElement);
    multiplicityElement.upperValue = new Singleton(multiplicityElement);
    multiplicityElement.lower = undefined;
    multiplicityElement.upper = undefined;
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