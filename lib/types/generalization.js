import DirectedRelationship  from "./directedRelationship";
import { emitEl, nullID } from "./element";
import Singleton from "../singleton";

export default class Generalization extends DirectedRelationship {
    constructor(manager) {
        super(manager);
        this.general = new Singleton(this);
        this.specific = new Singleton(this);
        this.general.subsets(this.targets);
        this.specific.subsets(this.sources);
        this.specific.subsets(this.owner);
        this.specific.opposite = "generalizations";
        this.sets.set('general', this.general);
        this.sets.set('specific', this.specific);
        this.elementTypes.add('Generalization');
    }

    elementType() {
        return 'Generalization';
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

export function emitGeneralization(data, alias, generalization) {
    if (generalization.specific.id() !== nullID()) {
        data.specific = generalization.specific.id();
    }
    if (generalization.general.id() !== nullID()) {
        data[alias].general = generalization.general.id();
    }
}
