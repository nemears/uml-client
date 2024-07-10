import { deleteSet, emitEl, deleteElementData } from "./element";
import { emitSet, emitSingleton } from "../emit";
import { emitNamedEl } from "./namedElement";
import PackageableElement, { emitPackageableElement } from "./packageableElement";
import { deletePackageableElementData } from "./packageableElement";
import UmlSet from "../set";
import Singleton from "../singleton";

export default class InstanceSpecification extends PackageableElement {
    constructor(manager) {
        super(manager);
        this.classifiers = new UmlSet(this);
        this.slots = new UmlSet(this);
        this.specification = new Singleton(this);
        this.slots.subsets(this.ownedElements);
        this.slots.opposite = 'owningInstance';
        this.specification.subsets(this.ownedElements);
        this.sets.set('classifiers', this.classifiers);
        this.sets.set('slots', this.slots);
        this.sets.set('specification', this.specification);
        this.elementTypes.add('InstanceSpecification');
    }

    elementType() {
        return 'InstanceSpecification';
    }

    emit() {
        const ret = {
            InstanceSpecification: {}
        };
        emitEl(ret, 'InstanceSpecification', this);
        emitNamedEl(ret, 'InstanceSpecification', this);
        emitPackageableElement(ret, 'InstanceSpecification', this);
        emitInstanceSpecification(ret, 'InstanceSpecification', this);
        return ret;
    }

    async deleteData() {
        await deleteInstanceSpecificationData(this);
        await deletePackageableElementData(this);
        await deleteElementData(this);
    }
}

export function emitInstanceSpecification(data, alias, instanceSpecification) {
    emitSet(data, alias, instanceSpecification.classifiers, 'classifiers');
    emitSet(data, alias, instanceSpecification.slots, 'slots');
    emitSingleton(data, alias, instanceSpecification.specification, 'specification');
}

export async function deleteInstanceSpecificationData(instanceSpecification) {
    await deleteSet(instanceSpecification.slots);
    if (instanceSpecification.specification.has()) {
        instanceSpecification.specification.set(null);
    }
}
