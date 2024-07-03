import { nullID } from "./element";
import Singleton from "../singleton";

export default function assignMultiplicityElementSets(multiplicityElement) {
    multiplicityElement.isOrdered = false;
    multiplicityElement.isUnique = true;
    multiplicityElement.lowerValue = new Singleton(multiplicityElement);
    multiplicityElement.upperValue = new Singleton(multiplicityElement);
    multiplicityElement.lowerValue.subsets(multiplicityElement.ownedElements);
    multiplicityElement.upperValue.subsets(multiplicityElement.ownedElements);
    multiplicityElement.lower = undefined;
    multiplicityElement.upper = undefined;
    multiplicityElement.sets.set('lowerValue', multiplicityElement.lowerValue);
    multiplicityElement.sets.set('upperValue', multiplicityElement.upperValue);
    multiplicityElement.elementTypes.add('MultiplicityElement');
}

export function emitMultiplicityElement(data, alias, multiplicityElement) {
    if (multiplicityElement.isOrdered) {
        data[alias].isOrdered = true;
    }
    if (!multiplicityElement.isUnique) {
        data[alias].isUnique = false;
    }
    if (multiplicityElement.lowerValue.id() !== nullID()) {
        data[alias].lowerValue = multiplicityElement.lowerValue.id();
    }
    if (multiplicityElement.upperValue.id() !== nullID()) {
        data[alias].upperValue = multiplicityElement.upperValue.id();
    }
}
