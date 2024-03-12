import DirectedRelationship, { isSubClassOfDirectedRelationship } from "./directedRelationship";
import { emitEl, nullID } from "./element";
import { isSubClassOfRelationship } from "./relationship";
import Singleton from "./singleton";

export default class Generalization extends DirectedRelationship {
    constructor(manager) {
        super(manager);
        this.general = new Singleton(this);
        this.specific = new Singleton(this);
        this.general.subsets(this.targets);
        this.specific.subsets(this.sources);
        this.specific.subsets(this.owner);
        this.specific.opposite = "generalizations";
        this.sets['general'] = this.general;
        this.sets['specific'] = this.specific;
    }

    elementType() {
        return 'generalization';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfGeneralization(elementType);
        if (!ret) {
            ret = isSubClassOfDirectedRelationship(elementType);
        }
        if (!ret) {
            ret = isSubClassOfRelationship(elementType);
        }

        return ret;
    }

    emit() {
        let ret = {
            generalization: {}
        };
        emitEl(ret, 'generalization', this);
        emitGeneralization(ret, 'generalization', this);
        return ret;
    }

    async deleteData() {
        if (this.specific.id() !== nullID()) {
            this.specific.set(undefined);
        }
        if (this.general.id() !== nullID()) {
            this.general.set(undefined);
        }
    }
}

export function isSubClassOfGeneralization(elementType) {
    return elementType === 'generalization' || elementType === 'GENERALIZATION';
}

export function emitGeneralization(data, alias, generalization) {
    if (generalization.specific.id() !== nullID()) {
        data.specific = generalization.specific.id();
    }
    if (generalization.general.id() !== nullID()) {
        data[alias].general = generalization.general.id();
    }
}