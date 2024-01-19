import DirectedRelationship, { isSubClassOfDirectedRelationship } from "./directedRelationship";
import { emitEl, deleteSet } from "./element";
import { assignNamedElementSets } from "./namedElement";
import { assignPackageableElementSets } from "./packageableElement";
import { isSubClassOfRelationship } from "./relationship";
import Set from "./set";
import { emitSet } from "./emit";

export default class Dependency extends DirectedRelationship {
    constructor(manager) {
        super(manager);
        assignNamedElementSets(this);
        assignPackageableElementSets(this);
        this.supplier = new Set(this);
        this.client = new Set(this);
        this.supplier.subsets(this.targets);
        this.client.subsets(this.sources);
        this.client.opposite = "clientDependencies";
        this.sets['suppliers'] = this.supplier;
        this.sets['clients'] = this.client;
    }

    elementType() {
        return 'dependency';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfDependency(elementType);
        if (!ret) {
            ret = isSubClassOfDirectedRelationship(elementType);
        }
        if (!ret) {
            ret = isSubClassOfRelationship(elementType);
        }
        if (!ret) {
            ret = isSubClassOfPackageableElement(elementType);
        }
        if (!ret) {
            ret = isSubClassOfNamespace(elementType);
        }
        if (!ret) {
            ret = isSubClassOfNamedElement(elementType);
        }
        if (!ret) {
            ret = isSubClassOfElement(elementType);
        }
        return ret;
    }

    emit() {
        let ret = {
            dependency: {}
        };
        emitEl(ret, 'dependency', this);
        emitDependency(ret, 'dependency', this);
        return ret;
    }

    async deleteData() {
        await deleteSet(this.client);
        await deleteSet(this.supplier);
    }
}

export function isSubClassOfDependency(elementType) {
    return elementType === 'dependency' || elementType === 'DEPENDENCY';
}

export function emitDependency(data, alias, dependency) {
    emitSet(data, alias, dependency.client, 'clients');
    emitSet(data, alias, dependency.supplier, 'suppliers');
}