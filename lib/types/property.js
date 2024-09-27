import { TypeInfo } from './element';
import Singleton from "../singleton";
import UmlSet from '../set';
import StructuralFeature from "./structuralFeature";
import { assignConnectableElement } from './connectableElement';
import { assignParameterableElementSets } from './parameterableElement';
import { 
    ASSOCIATION_MEMBER_ENDS_ID,
    ASSOCIATION_OWNED_ENDS_ID,
    CLASS_OWNED_ATTRIBUTES_ID,
    DATATYPE_OWNED_ATTRIBUTES_ID,
    PROPERTY_ASSOCIATION_ID, 
    PROPERTY_CLASS_ID, 
    PROPERTY_DATATYPE_ID, 
    PROPERTY_DEFAULT_VALUE_ID, 
    PROPERTY_OWNING_ASSOCIATION_ID, 
    PROPERTY_SUBSETTED_PROPERTIES_ID, 
    PROPERTY_REDEFINED_PROPERTIES_ID 
} from '../modelIds';

export default class Property extends StructuralFeature {
    constructor(manager) {
        super(manager);
        assignParameterableElementSets(this);
        assignConnectableElement(this);
        this.propertyTypeInfo = new TypeInfo('Property');
        this.typeInfo = this.propertyTypeInfo;
        this.typeInfo.create = () => { return new Property(manager); };
        this.typeInfo.setBase(this.structuralFeatureTypeInfo);
        this.typeInfo.setBase(this.connectableElementTypeInfo);
        const me = this;
        this.typeInfo.specialData.set('aggregation', {
            getData() {
                if (me.aggregation === 'none') {
                    return '';
                }
                return me.aggregation;
            },
            setData(val) {
                me.aggregation = val;
            }
        });
        this.clazz = new Singleton(this, PROPERTY_CLASS_ID, "class");
        this.clazz.subsets(this.featuringClassifier);
        this.clazz.subsets(this.namespace);
        this.clazz.opposite = CLASS_OWNED_ATTRIBUTES_ID;
        this.dataType = new Singleton(this, PROPERTY_DATATYPE_ID, "dataType");
        this.dataType.subsets(this.featuringClassifier);
        this.dataType.subsets(this.namespace);
        this.dataType.opposite = DATATYPE_OWNED_ATTRIBUTES_ID;
        this.association = new Singleton(this, PROPERTY_ASSOCIATION_ID, "association");
        this.association.opposite = ASSOCIATION_MEMBER_ENDS_ID;
        this.owningAssociation = new Singleton(this, PROPERTY_OWNING_ASSOCIATION_ID, "owningAssociation");
        this.owningAssociation.subsets(this.association);
        this.owningAssociation.subsets(this.namespace);
        this.owningAssociation.subsets(this.featuringClassifier);
        this.owningAssociation.opposite = ASSOCIATION_OWNED_ENDS_ID;
        this.defaultValue = new Singleton(this, PROPERTY_DEFAULT_VALUE_ID, 'defaultValue');
        this.defaultValue.subsets(this.ownedElements);
        this.aggregation = 'none';
        this.subsettedProperties = new UmlSet(this, PROPERTY_SUBSETTED_PROPERTIES_ID, 'subsettedProperties');
        this.redefinedProperties = new UmlSet(this, PROPERTY_REDEFINED_PROPERTIES_ID, 'redefinedProperties');
        this.redefinedProperties.subsets(this.redefinedElements);
    }
}
