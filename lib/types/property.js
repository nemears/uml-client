import { emitNamedEl } from "./namedElement";
import Singleton from "../singleton";
import UmlSet from '../set';
import { emitEl, nullID, deleteElementData } from "./element";
import { emitTypedElement } from "./typedElement";
import { emitMultiplicityElement } from "./multiplicityElement";
import StructuralFeature, { emitStructuralFeature } from "./structuralFeature";
import { assignConnectableElement } from './connectableElement';
import { emitSet } from '../emit';

export default class Property extends StructuralFeature {
    constructor(manager) {
        super(manager);
        assignConnectableElement(this);
        this.clazz = new Singleton(this);
        this.clazz.subsets(this.featuringClassifier);
        this.clazz.subsets(this.namespace);
        this.clazz.opposite = 'ownedAttributes';
        this.dataType = new Singleton(this);
        this.dataType.subsets(this.featuringClassifier);
        this.dataType.subsets(this.namespace);
        this.dataType.opposite = 'ownedAttributes';
        this.association = new Singleton(this);
        this.association.opposite = 'memberEnds';
        this.owningAssociation = new Singleton(this);
        this.owningAssociation.subsets(this.association);
        this.owningAssociation.subsets(this.namespace);
        this.owningAssociation.subsets(this.featuringClassifier);
        this.owningAssociation.opposite = 'ownedEnds';
        this.defaultValue = new Singleton(this);
        this.defaultValue.subsets(this.ownedElements);
        this.aggregation = 'none';
        this.subsettedProperties = new UmlSet(this);
        this.redefinedProperties = new UmlSet(this);
        this.redefinedProperties.subsets(this.redefinedElements);
        this.sets.set('class', this.clazz);
        this.sets.set('dataType', this.dataType);
        this.sets.set('association', this.association);
        this.sets.set('owningAssociation', this.owningAssociation);
        this.sets.set('defaultValue', this.defaultValue);
        this.sets.set('subsettedProperties', this.subsettedProperties);
        this.sets.set('redefinedProperties', this.redefinedProperties);
        this.elementTypes.add('Property');
    }

    elementType() {
        return 'Property';
    }

    emit() {
        let ret = {
            Property: {}
        };
        emitEl(ret, 'Property', this);
        emitNamedEl(ret, 'Property', this);
        emitTypedElement(ret, 'Property', this);
        emitMultiplicityElement(ret, 'Property', this);
        emitStructuralFeature(ret, 'Property', this);
        emitProperty(ret, 'Property', this);
        return ret;
    }

    async deleteData() {
        if (this.clazz.has()) {
            await this.clazz.set(undefined);
        }
        await deleteElementData(this);
    }
}

export function emitProperty(data, alias, property) {
    if (property.clazz.id() !== nullID()) {
        data.class = property.clazz.id();
    } else if (property.dataType.id() !== nullID()) {
        data.dataType = property.dataType.id();
    } else if (property.owningAssociation.id() !== nullID()) {
        data.owningAssociation = property.owningAssociation.id();
    }

    if (property.aggregation !== 'none') {
        data[alias].aggregation = property.aggregation;
    }

    if (property.owningAssociation.id() === nullID() && property.association.id() !== nullID()) {
        data[alias].association = property.association.id();
    }

    if (property.defaultValue.id() !== nullID()) {
        data[alias].defaultValue = property.defaultValue.id();
    }
    emitSet(data, alias, property.subsettedProperties, 'subsettedProperties');
    emitSet(data, alias, property.redefinedProperties, 'redefinedProperties');
}
