import { TypeInfo } from "./element";
import DirectedRelationship  from "./directedRelationship";
import Singleton from "../singleton";
import { 
    CLASSIFIER_GENERALIZATIONS_ID, 
    GENERALIZATION_ID, 
    GENERALIZATION_GENERAL_ID, 
    GENERALIZATION_SPECIFIC_ID 
} from '../modelIds';

export default class Generalization extends DirectedRelationship {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(GENERALIZATION_ID, 'Generalization');
        this.generalizationTypeInfo = this.typeInfo;
        this.typeInfo.create = () => new Generalization(manager);
        this.typeInfo.setBase(this.directedRelationshipTypeInfo);
        this.general = new Singleton(this, GENERALIZATION_GENERAL_ID, 'general');
        this.specific = new Singleton(this, GENERALIZATION_SPECIFIC_ID, 'specific');
        this.general.subsets(this.targets);
        this.specific.subsets(this.sources);
        this.specific.subsets(this.owner);
        this.specific.opposite = CLASSIFIER_GENERALIZATIONS_ID;
    }
}
