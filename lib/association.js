import Classifier, { emitClassifier, isSubClassOfClassifier } from "./classifier";
import { emitEl, isSubClassOfElement } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { isSubClassOfNamespace } from "./namespace";
import { deletePackageableElementData, emitPackageableElement, isSubClassOfPackageableElement } from "./packageableElement";
import { assignRelationshipSets, isSubClassOfRelationship } from "./relationship";
import Set, { subsetContains } from "./set";

export default class Association extends Classifier {
    constructor(manager) {
        super(manager);
        assignRelationshipSets(this);
        this.memberEnds = new Set(this);
        this.ownedEnds = new Set(this);
        this.navigableOwnedEnds = new Set(this);
        this.memberEnds.subsets(this.members);
        this.memberEnds.opposite = 'association';
        this.ownedEnds.subsets(this.memberEnds);
        this.ownedEnds.subsets(this.ownedMembers);
        this.ownedEnds.opposite = 'owningAssociation';
        this.navigableOwnedEnds.subsets(this.ownedEnds);
        this.sets['memberEnds'] = this.memberEnds;
        this.sets['ownedEnds'] = this.ownedEnds;
        this.sets['navigableOwnedEnds'] = this.navigableOwnedEnds;
    }

    elementType() {
        return 'association';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfAssociation(elementType);
        if (!ret) {
            ret = isSubClassOfClassifier(elementType);
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
            ret = isSubClassOfRelationship(elementType);
        }
        if (!ret) {
            ret = isSubClassOfElement(elementType);
        }
        return ret;
    }

    async deleteData() {
        let elsToDelete = await this.navigableOwnedEnds.clone();
        for (const end of elsToDelete) {
            this.navigableOwnedEnds.remove(end);
        }
        elsToDelete = await this.ownedEnds.clone();
        for (const end of elsToDelete) {
            this.ownedEnds.remove(end);
        }
        elsToDelete = await this.memberEnds.clone();
        for (const end of elsToDelete) {
            this.memberEnds.remove(end);
        }
        await deletePackageableElementData(this);
    }

    emit() {
        const ret = {
            association : {}
        };
        emitEl(ret, 'association', this);
        emitNamedEl(ret, 'association', this);
        emitPackageableElement(ret, 'association', this);
        emitClassifier(ret, 'association', this);
        emitAssociation(ret, 'association', this);
        return ret;
    }
}

export function isSubClassOfAssociation(elementType) {
    return elementType === 'association' || elementType === 'ASSOCIATION';
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
            if (!subsetContains(association.navigableOwnedEnds, id)) {
                emitSet = true;
            }
        }
        if (emitSet) {
            data[alias].ownedEnds = [];
            for (let id of association.ownedEnds.ids()) {
                if (subsetContains(association.navigableOwnedEnds, id)) {
                    continue;
                }
                data[alias].ownedEnds.push(id);
            }
        }
    }
    if (association.memberEnds.size() > 0) {
        let emitSet = false;
        for (let id of association.memberEnds.ids()) {
            if (!subsetContains(association.ownedEnds, id)) {
                emitSet = true;
            }
        }
        if (emitSet) {
            data[alias].memberEnds = [];
            for (let id of association.memberEnds.ids()) {
                if (subsetContains(association.ownedEnds, id)) {
                    continue;
                }
                data[alias].memberEnds.push(id);
            }
        }
    }
}
