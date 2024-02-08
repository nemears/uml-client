import DirectedRelationship, { isSubClassOfDirectedRelationship } from "./directedRelationship";
import { emitEl, deleteSet, isSubClassOfElement } from "./element";
import { assignNamedElementSets, emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
// import { isSubClassOfNamespace } from "./namespace";
import { assignPackageableElementSets, deletePackageableElementData, emitPackageableElement, isSubClassOfPackageableElement } from "./packageableElement";
import { isSubClassOfRelationship } from "./relationship";
import Set from "./set";
import { emitSet } from "./emit";

export default class Dependency extends DirectedRelationship {
    constructor(manager) {
        super(manager);
        assignNamedElementSets(this);
        assignPackageableElementSets(this);
        this.suppliers = new Set(this);
        this.clients = new Set(this);
        this.suppliers.subsets(this.targets);
        this.clients.subsets(this.sources);
        this.clients.opposite = "clientDependencies";
        this.sets['suppliers'] = this.suppliers;
        this.sets['clients'] = this.clients;
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
        // if (!ret) {
        //     ret = isSubClassOfNamespace(elementType);
        // }
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
        emitNamedEl(ret, 'dependency', this);
        emitPackageableElement(ret, 'dependency', this);
        emitDependency(ret, 'dependency', this);
        return ret;
    }

    async deleteData() {
        await deleteSet(this.clients);
        await deleteSet(this.suppliers);
        deletePackageableElementData(this);
    }
}

export function isSubClassOfDependency(elementType) {
    return elementType === 'dependency' || elementType === 'DEPENDENCY';
}

export function emitDependency(data, alias, dependency) {
    emitSet(data, alias, dependency.clients, 'clients');
    emitSet(data, alias, dependency.suppliers, 'suppliers');
}