import { emitEl, isSubClassOfElement } from "./element";
import { emitSet, emitSingleton } from "./emit";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import PackageableElement, { emitPackageableElement, isSubClassOfPackageableElement } from "./packageableElement";
import Set from "./set";
import Singleton from "./singleton";

export default class InstanceSpecification extends PackageableElement {
    constructor(manager) {
        super(manager);
        this.classifiers = new Set(this);
        this.slots = new Set(this);
        this.specification = new Singleton(this);
        this.slots.subsets(this.ownedElements);
        this.slots.opposite = 'owningInstance';
        this.specification.subsets(this.ownedElements);
        this.sets['classifiers'] = this.classifiers;
        this.sets['slots'] = this.slots;
        this.sets['specification'] = this.specification;
    }

    elementType() {
        return 'instanceSpecification';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfInstanceSpecification(elementType);
        if (!ret) {
            ret = isSubClassOfPackageableElement(elementType);
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
        const ret = {
            instanceSpecification: {}
        };
        emitEl(ret, 'instanceSpecification', this);
        emitNamedEl(ret, 'instanceSpecification', this);
        emitPackageableElement(ret, 'instanceSpecification', this);
        emitInstanceSpecification(ret, 'instanceSpecification', this);
        return ret;
    }
}

export function isSubClassOfInstanceSpecification(elementType) {
    return elementType === 'instanceSpecification' || elementType === 'INSTANCE_SPECIFICATION';
}

export function emitInstanceSpecification(data, alias, instanceSpecification) {
    emitSet(data, alias, instanceSpecification.classifiers, 'classifiers');
    emitSet(data, alias, instanceSpecification.slots, 'slots');
    emitSingleton(data, alias, instanceSpecification.specification, 'specification');
}