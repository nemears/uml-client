import DirectedRelationship from "./directedRelationship";
import { emitEl, deleteSet } from "./element";
import { assignNamedElementSets, emitNamedEl } from "./namedElement";
import { assignPackageableElementSets, deletePackageableElementData, emitPackageableElement } from "./packageableElement";
import UmlSet from "../set";
import { emitSet } from "../emit";

export default class Dependency extends DirectedRelationship {
    constructor(manager) {
        super(manager);
        assignNamedElementSets(this);
        assignPackageableElementSets(this);
        this.suppliers = new UmlSet(this);
        this.clients = new UmlSet(this);
        this.suppliers.subsets(this.targets);
        this.clients.subsets(this.sources);
        this.clients.opposite = "clientDependencies";
        this.sets.set('suppliers', this.suppliers);
        this.sets.set('clients', this.clients);
        this.elementTypes.add('Dependency');
    }

    elementType() {
        return 'Dependency';
    }

    emit() {
        let ret = {
            Dependency: {}
        };
        emitEl(ret, 'Dependency', this);
        emitNamedEl(ret, 'Dependency', this);
        emitPackageableElement(ret, 'Dependency', this);
        emitDependency(ret, 'Dependency', this);
        return ret;
    }

    async deleteData() {
        await deleteSet(this.clients);
        await deleteSet(this.suppliers);
        deletePackageableElementData(this);
    }
}

export function emitDependency(data, alias, dependency) {
    emitSet(data, alias, dependency.clients, 'clients');
    emitSet(data, alias, dependency.suppliers, 'suppliers');
}
