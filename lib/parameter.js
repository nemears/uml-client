import ConnectableElement from "./connectableElement";
import {assignMultiplicityElementSets} from "./multiplicityElement";
import Singleton from "./singleton";
import Set from "./set";

export default class Parameter extends ConnectableElement {
    constructor(manager) {
        super(manager);
        assignMultiplicityElementSets(this);
        this.default = '';
        this.direction = 'in';
        this.effect = '';
        this.isException = false;
        this.isStream = false;
        this.ownerFormalParam = new Singleton(this);
        this.parameterSets = new Set(this);
        this.defaultValue = new Singleton(this);
        this.ownerFormalParam.subsets(this.namespace);
        this.defaultValue.subsets(this.ownedElement);
        this.ownerFormalParam.opposite = 'ownedParameter';
        this.parameterSets.opposite = 'parameter';
        this.defaultValue.opposite = 'owningParameter';
    }
}

export function isSubClassOfParameter(elementType) {
    return elementType === 'parameter' || elementType === 'PARAMETER';
}