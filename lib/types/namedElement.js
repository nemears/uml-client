import Element, { TypeInfo } from './element.js'
import Singleton from '../singleton.js';
import UmlSet from '../set.js';
import { 
    DEPENDENCY_CLIENTS_ID, 
    NAMED_ELEMENT_ID,
    NAMED_ELEMENT_NAMESPACE_ID, 
    NAMED_ELEMENT_CLIENT_DEPENDENCIES_ID, 
    NAMESPACE_OWNED_MEMBERS_ID 
} from '../modelIds';

export function assignNamedElementSets(namedEl) {
    namedEl.typeInfo = new TypeInfo(NAMED_ELEMENT_ID, 'NamedElement');
    namedEl.namedElementTypeInfo = namedEl.typeInfo;
    namedEl.typeInfo.setBase(namedEl.elementTypeInfo);
    namedEl.typeInfo.specialData.set('name', {
        getData() {
            return namedEl.name;
        },
        setData(val) {
            namedEl.name = val;
        },
        type: 'string'
    });
    namedEl.name = ""; 
    namedEl.namespace = new Singleton(namedEl, NAMED_ELEMENT_NAMESPACE_ID, 'namespace');
    namedEl.namespace.subsets(namedEl.owner);
    namedEl.namespace.opposite = NAMESPACE_OWNED_MEMBERS_ID;
    namedEl.clientDependencies = new UmlSet(namedEl, NAMED_ELEMENT_CLIENT_DEPENDENCIES_ID, 'clientDependencies');
    namedEl.clientDependencies.opposite = DEPENDENCY_CLIENTS_ID;
}

export default class NamedElement extends Element {
    constructor(manager) {
        super(manager);
        assignNamedElementSets(this);
    }
}
