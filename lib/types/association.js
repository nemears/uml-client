import Classifier, { emitClassifier } from "./classifier";
import { deleteSet, emitEl } from "./element";
import { emitNamedEl } from "./namedElement";
import { deletePackageableElementData, emitPackageableElement } from "./packageableElement";
import { assignRelationshipSets } from "./relationship";
import UmlSet from "../set";

export default class Association extends Classifier {
    constructor(manager) {
        super(manager);
        assignRelationshipSets(this);
        this.memberEnds = new UmlSet(this);
        this.ownedEnds = new UmlSet(this);
        this.navigableOwnedEnds = new UmlSet(this);
        this.memberEnds.subsets(this.members);
        this.memberEnds.opposite = 'association';
        this.ownedEnds.subsets(this.memberEnds);
        this.ownedEnds.subsets(this.ownedMembers);
        this.ownedEnds.opposite = 'owningAssociation';
        this.navigableOwnedEnds.subsets(this.ownedEnds);
        this.sets.set('memberEnds', this.memberEnds);
        this.sets.set('ownedEnds', this.ownedEnds);
        this.sets.set('navigableOwnedEnds', this.navigableOwnedEnds);
        this.elementTypes.add('Association');
    }

    elementType() {
        return 'Association';
    }

    async deleteData() {
        await deleteSet(this.navigableOwnedEnds);
        await deleteSet(this.ownedEnds);
        await deleteSet(this.memberEnds);
        deletePackageableElementData(this);
    }

    emit() {
        const ret = {
            Association : {}
        };
        emitEl(ret, 'Association', this);
        emitNamedEl(ret, 'Association', this);
        emitPackageableElement(ret, 'Association', this);
        emitClassifier(ret, 'Association', this);
        emitAssociation(ret, 'Association', this);
        return ret;
    }
}

export function emitAssociation(data, alias, association) {
    if (association.navigableOwnedEnds.size() > 0) {
        data[alias].navigableOwnedEnds = [];
        for (let id of association.navigableOwnedEnds.ids()) {
            data[alias].navigableOwnedEnds.push(id);
        }
    }
    if (association.ownedEnds.size() > 0) {
        let emitSet = false;
        for (let id of association.ownedEnds.ids()) {
            if (!association.navigableOwnedEnds.contains(id)) {
                emitSet = true;
            }
        }
        if (emitSet) {
            data[alias].ownedEnds = [];
            for (let id of association.ownedEnds.ids()) {
                if (!association.navigableOwnedEnds.contains(id)) {
                    continue;
                }
                data[alias].ownedEnds.push(id);
            }
        }
    }
    if (association.memberEnds.size() > 0) {
        let emitSet = false;
        for (let id of association.memberEnds.ids()) {
            if (!association.ownedEnds.contains(id)) {
                emitSet = true;
            }
        }
        if (emitSet) {
            data[alias].memberEnds = [];
            for (let id of association.memberEnds.ids()) {
                if (association.ownedEnds.contains(id)) {
                    continue;
                }
                data[alias].memberEnds.push(id);
            }
        }
    }
}
