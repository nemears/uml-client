import DirectedRelationship from "./directedRelationship";
import { assignNamedElementSets } from './namedElement';
import { assignPackageableElementSets } from './packageableElement';
import { TypeInfo } from "./element";
import UmlSet from "../set";
import { DEPENDENCY_ID, DEPENDENCY_CLIENTS_ID, DEPENDENCY_SUPPLIERS_ID, NAMED_ELEMENT_CLIENT_DEPENDENCIES_ID } from '../modelIds';

export default class Dependency extends DirectedRelationship {
    constructor(manager) {
        super(manager);
        assignNamedElementSets(this);
        assignPackageableElementSets(this);
        this.typeInfo = new TypeInfo(DEPENDENCY_ID, 'Dependency');
        this.dependencyTypeInfo = this.typeInfo;
        this.typeInfo.create = () => { return new Dependency(manager); };
        this.typeInfo.setBase(this.directedRelationshipTypeInfo);
        this.typeInfo.setBase(this.packageableElementTypeInfo);
        this.suppliers = new UmlSet(this, DEPENDENCY_SUPPLIERS_ID, 'suppliers');
        this.clients = new UmlSet(this, DEPENDENCY_CLIENTS_ID, 'clients');
        this.suppliers.subsets(this.targets);
        this.clients.subsets(this.sources);
        this.clients.opposite = NAMED_ELEMENT_CLIENT_DEPENDENCIES_ID;
    }
}
