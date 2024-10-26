import ConnectableElement from "./connectableElement.js";
import { assignMultiplicityElementSets } from "./multiplicityElement.js";
import Singleton from "../singleton.js";
import UmlSet from "../set.js";

export default class Parameter extends ConnectableElement {
    constructor(manager) {
        super(manager);
        assignMultiplicityElementSets(this);
        this.default = '';
        this.direction = 'in';
        this.effect = '';
        this.isException = false;
        this.isStream = false;
        this.parameterSets = new UmlSet(this);
        this.defaultValue = new Singleton(this);
        this.defaultValue.subsets(this.ownedElement);
        this.parameterSets.opposite = 'parameter';
        this.sets.set('defaultValue', this.defaultValue);
        this.sets.set('parameterSets'. this.parameterSets);
        this.elementTypes.add('Parameter');
    }
}
