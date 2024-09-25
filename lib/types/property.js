import { TypeInfo } from './element';
import Singleton from "../singleton";
import UmlSet from '../set';
import StructuralFeature from "./structuralFeature";
import { assignConnectableElement } from './connectableElement';
import { assignParameterableElementSets } from './parameterableElement';
import { PROPERTY_DEFAULT_VALUE_ID, PROPERTY_SUBSETTED_PROPERTIES_ID, PROPERTY_REDEFINED_PROPERTIES_ID } from '../modelIds';

export default class Property extends StructuralFeature {
    constructor(manager) {
        super(manager);
        assignParameterableElementSets(this);
        assignConnectableElement(this);
        this.propertyTypeInfo = new TypeInfo('Property');
        this.typeInfo = this.propertyTypeInfo;
        this.typeInfo.setBase(this.structuralFeatureTypeInfo);
        this.typeInfo.setBase(this.connectableElementTypeInfo);
        // this.clazz = new Singleton(this);
        // this.clazz.subsets(this.featuringClassifier);
        // this.clazz.subsets(this.namespace);
        // this.clazz.opposite = 'ownedAttributes';
        // this.dataType = new Singleton(this);
        // this.dataType.subsets(this.featuringClassifier);
        // this.dataType.subsets(this.namespace);
        // this.dataType.opposite = 'ownedAttributes';
        // this.association = new Singleton(this);
        // this.association.opposite = 'memberEnds';
        // this.owningAssociation = new Singleton(this);
        // this.owningAssociation.subsets(this.association);
        // this.owningAssociation.subsets(this.namespace);
        // this.owningAssociation.subsets(this.featuringClassifier);
        // this.owningAssociation.opposite = 'ownedEnds';
        this.defaultValue = new Singleton(this, PROPERTY_DEFAULT_VALUE_ID, 'defaultValue');
        this.defaultValue.subsets(this.ownedElements);
        this.aggregation = 'none';
        this.subsettedProperties = new UmlSet(this, PROPERTY_SUBSETTED_PROPERTIES_ID, 'subsettedProperties');
        this.redefinedProperties = new UmlSet(this, PROPERTY_REDEFINED_PROPERTIES_ID, 'redefinedProperties');
        this.redefinedProperties.subsets(this.redefinedElements);
    }
}
