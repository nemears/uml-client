import UmlManager, { Manager } from './manager.js';
import { BaseElement, emit, TypeInfo } from './types/element.js';
import Singleton from './singleton.js';
import UmlSet from './set.js';
import { randomID } from './types/element.js';
import { KERNEL_TYPES } from './modelIds.js';

export const STRING_ID = 'string_L-R5eAEq6f3LUNtUmzHzT';
export const BOOL_ID = 'bool_bzkcabSy3CiFd-HmJOtnVRK';
export const INT_ID = 'int_r9nNbBukx47IomXrT2raqtc4';
export const REAL_ID = 'real_aZG-w6yl61bXVWutgeyScN9';

export const PRIMITIVE_TYPE_IDS = new Set([STRING_ID, BOOL_ID, INT_ID, REAL_ID]);

class SpecialValue {
    constructor(element, name) {
        this.element = element;
        this.name = name;
    }
}

class StringSpecialValue extends SpecialValue {
    constructor(element, name) {
        super(element, name);
        this.type = 'string'
    }
    getData() {
        return this.element[this.name];
    }
    setData(val) {
        this.element[this.name] = val;
    }
}
class BoolSpecialValue extends SpecialValue{
    constructor(element, name) {
        super(element, name);
        this.type = 'bool';
    }
    getData() {
        return this.element[this.name];
    }
    setData(val) {
        if (typeof val === 'string') {
            if (val === 'true') {
                this.element[this.name] = true;
            } else if (val === 'false') {
                this.element[this.name] = false;
            } else {
                throw Error('bad serialization!');
            }
        } else {
            this.element[this.name] = val;
        }
    }
}

class NumberSpecialValue extends SpecialValue {
    constructor(element, name) {
        super(element, name);
        this.type = 'number';
    }
    getData() {
        if (this.element[this.name]) {
            return this.element[this.name].toString();
        }
        return '';
    }
    setData(val) {
        if (typeof val === 'string') {
            val = parseFloat(val);
        }
        this.element[this.name] = val;
    }
}

export async function generate(generation_root, umlClient) {
    const ret = new Manager();
    const hidden_uml_manager = new UmlManager();

    // TODO fill out types
    const visited = new Set();
    const visitEl = async (current_element) => {
        if (visited.has(current_element.id)) {
            return
        }

        umlClient.try_put(current_element);

        visited.add(current_element.id);

        if (current_element.is('Classifier')) {

            if (current_element.isAbstract) {
                // dont add to manager
                return;
            }

            if (current_element.is('Association')) {
                // not handling assocaitions rn
                return;
            }

            // check if it is a built in type
            if (KERNEL_TYPES.has(current_element.id)) {
                for (const uml_type of umlClient._types) {
                    if (uml_type.typeInfo.id === current_element.id) {
                        ret._types.push(uml_type);
                        break;
                    }
                }
                return;
            }

            // set up type for manager
            const base_element = new BaseElement(ret);
            base_element._model_id = current_element.id;

            const visit_classifier = async (current_classifier) => {
                if (current_classifier.name === '') {
                    throw Error('Error generating class ' + current_classifier.id + ', the element is a type but has no name!');
                }
                
                const element_type_info = new TypeInfo(current_classifier.id, current_classifier.name);
                element_type_info.is_meta = true;
                element_type_info.generated = true;
                if (current_classifier.is('Stereotype')) {
                    element_type_info.is_stereotype = true;

                    // standard is on client side to create a property that attaches to
                    // an extension where the property is of type representing the
                    // meta class and the property is owned by the stereotype
                    for await (const property of current_classifier.attributes) {
                        if (
                            property.clazz.id() === current_classifier.id &&
                            property.association.has() &&
                            (await property.association.get()).is('Extension')
                        ) {
                            const meta_class_id = property.type.id();
                            for (const uml_type of hidden_uml_manager._types) {
                                if (uml_type.typeInfo.id === meta_class_id) {
                                    element_type_info.setBase(uml_type.typeInfo);
                                    break;
                                }
                            }
                            // TODO when we extend non uml elements
                        }
                    }

                    // maybe TODO warn or error if no extensions found???
                }

                for await (const generalization of current_classifier.generalizations) {
                    await umlClient.try_put(generalization);
                    const general = await generalization.general.get();

                    // add base to manager
                    await visitEl(general);

                    // add base data to element
                    await visit_classifier(general);
                    element_type_info.setBase(base_element.typeInfo);
                }
                
                base_element.typeInfo = element_type_info;

                const create_property = async (property) => {
                    if (element_type_info.getSet(property.id)) {
                        return;
                    }

                    // TODO check for bad names e.g. typeInfo, id

                    // check if it is a primitive type
                    const type = await property.type.get();
                    if (type && PRIMITIVE_TYPE_IDS.has(type.id)) {

                        // TODO figure out how to do below without referencing property.name

                        switch (type.id) {
                            case BOOL_ID: {
                                base_element.typeInfo.specialData.set(property.name, new BoolSpecialValue(base_element, property.name));
                                if (property.defaultValue.has()) {
                                    base_element[property.name] = (await property.defaultValue.get()).value;
                                }
                                break;
                            }
                            case STRING_ID: {
                                base_element.typeInfo.specialData.set(property.name, new StringSpecialValue(base_element, property.name));
                                if (property.defaultValue.has()) {
                                    base_element[property.name] = (await property.defaultValue.get()).value;
                                }
                                break;
                            }
                            case INT_ID: 
                            case REAL_ID: {
                                base_element.typeInfo.specialData.set(property.name, new NumberSpecialValue(base_element, property.name));
                                if (property.defaultValue.has()) {
                                    base_element[property.name] = (await property.defaultValue.get()).value;
                                }
                                break;
                            }
                        }

                        // don't perform set logic
                        return;
                    }

                    if (type) {
                        // add type to manager
                        await visitEl(type);
                    }

                    let upperVal = property.upper;
                    if (!upperVal) {
                        if (property.upperValue.has()) {
                            upperVal = (await property.upperValue.get()).value;
                        }
                    }

                    let created_set = undefined;

                    if (upperVal && upperVal === 1) {
                        // singleton
                        created_set = new Singleton(base_element, property.id, property.name);
                    } else {
                        // if (property.isOrdered) {
                        //     // TODO
                        //     
                        // } else {
                        created_set = new UmlSet(base_element, property.id, property.name);
                        // }
                    }

                    // subsets
                    for await (const subset of property.subsettedProperties) {
                        const subset_actual_set = element_type_info.getSet(subset.id);
                        if (!subset_actual_set) {
                            await create_property(subset);
                        }

                        created_set.subsets(element_type_info.getSet(subset.id));
                    }

                    // redefines
                    for await (const redefined_set of property.redefinedProperties) {
                        const redefined_actual_set = element_type_info.getSet(redefined_set.id);
                        if (!redefined_actual_set) {
                            await create_property(redefined_set);
                        }

                        created_set.redefines(element_type_info.getSet(redefined_set.id));
                    }

                    // readonly
                    if (property.readonly) {
                        created_set.readonly = true
                    }

                    // composition
                    created_set.composition = property.aggregation;

                    // set opposite
                    if (property.association.has()) {
                        const association = await property.association.get()
                        let oppositeEnd;
                        for await (const end of association.memberEnds) {
                            if (end.id !== property.id) {
                                oppositeEnd = end;
                                break;
                            }
                        }
                        if (oppositeEnd && oppositeEnd.owner.has() && !(await oppositeEnd.owner.get()).is('Association')) {
                            if (!oppositeEnd.name || oppositeEnd.name === '') {
                                console.warn('Warning, not setting opposite for property ' + property.name + ' because opposite does not have a name!');
                            } else {
                                created_set.opposite = oppositeEnd.id;
                                if (oppositeEnd.aggregation === 'composite') {
                                    created_set.composition = 'anticomposite';
                                }
                            }
                        }
                    }

                    if (property.name !== '') {
                        base_element[property.name] = created_set;
                    }
                }

                for await (const property of current_classifier.attributes) {
                    await umlClient.try_put(property);
                    await create_property(property);
                }
            }

            await visit_classifier(current_element);

            const populate_classifier_info = (created_element, type_info) => {
                const created_element_type_info = new TypeInfo(type_info.id, type_info.name);
                created_element_type_info.generated = true;
                if (type_info.is_stereotype) {
                    // add the base element's type info to the typeInfo graph
                    created_element_type_info.setBase(created_element.__proto__.typeInfo);
                    created_element_type_info.is_stereotype = true;
                }
                for (const base of type_info.base) {
                    if (!base.is_meta) {
                        continue;
                    }
                    populate_classifier_info(created_element, base);
                    created_element_type_info.setBase(created_element.typeInfo);
                }
                created_element.typeInfo = created_element_type_info;

                for (const set_pair of type_info.sets) {
                    const set = set_pair[1];
                    let created_set;
                    switch (set.setType()) {
                        case 'set':
                            created_set = new UmlSet(created_element, set.definingFeature, set.name, set.additionPolicy, set.removalPolicy);
                            break;
                        case 'singleton':
                            created_set = new Singleton(created_element, set.definingFeature, set.name, set.additionPolicy, set.removalPolicy);
                            break;
                        default:
                            throw Error('uh oh');
                    }
                    for (const subset of set.superSets) {
                        created_set.subsets(created_element_type_info.getSet(subset.definingFeature));
                    }
                    for (const redefinedSet of set.redefinedSets) {
                        created_set.redefines(created_element_type_info.getSet(redefinedSet.definingFeature));
                    }
                    created_set.opposite = set.opposite;
                    created_set.readonly = set.readonly;
                    created_set.composition = set.composition;
                    if (set.name !== '') {
                        created_element[set.name] = created_set;
                    }
                }
                for (const primitive of type_info.specialData) {
                    switch (primitive[1].type) {
                        case 'bool': {
                            created_element.typeInfo.specialData.set(primitive[0], new BoolSpecialValue(created_element, primitive[1].name));
                            break;
                        }
                        case 'string': {
                            created_element.typeInfo.specialData.set(primitive[0], new StringSpecialValue(created_element, primitive[1].name));
                            break;
                        }
                        case 'number' : {
                            created_element.typeInfo.specialData.set(primitive[0], new NumberSpecialValue(created_element, primitive[1].name));
                            break;
                        }
                    }
                    created_element[primitive[0]] = base_element[primitive[0]];
                }
            }

            const create = () => {
                const created_element = new BaseElement(ret);
                populate_classifier_info(created_element, base_element.typeInfo);
                created_element.typeInfo.create = create;
                ret._graph.set(created_element.id, created_element);
                return created_element;
            }
            base_element.typeInfo.create = create;

            if (current_element.is('Stereotype')) {
                const apply = (element) => {
                    if (!element._stereotype) {
                        element._stereotype = element;
                    }
                    class CustomStereotype {
                        constructor() {
                            this.__proto__ = element._stereotype; // add stereotype to chain
                            this.manager = ret;
                            this._stereotypeID = randomID();
                        }
                    }

                    const created_stereotype = new CustomStereotype();
                    populate_classifier_info(created_stereotype, base_element.typeInfo);
                    element._appliedStereotypes.push(created_stereotype);
                    element._stereotype = created_stereotype; // new head of chain
                    ret._graph.set(created_stereotype._stereotypeID, created_stereotype);
                    
                    return created_stereotype;
                }

                base_element.typeInfo.apply = apply;
            }

            ret._types.push(base_element);
        }


        if (current_element.is('Package')) {
            for await (const packaged_element of current_element.packagedElements) {
                await visitEl(packaged_element);
            }
        }
    }

    await visitEl(generation_root);

    ret.parseStereotype = (data, applying_element) => {
        for (const type of ret._types) {
            if (!type.typeInfo.is_stereotype) {
                continue;
            }
            const innerData = data[type.typeInfo.name];
            if (innerData !== undefined) {
                return type.typeInfo.apply(applying_element);
            }
            const innerDataID = data[type.typeInfo.id];
            if (innerDataID !== undefined) {
                return type.typeInfo.apply(applying_element);
            }
        }
    }

    // TODO manager api methods
    ret.post = async function(type, post_options) {
        const posted_data = ret.create(type);
        post_options = post_options || {
            id : randomID()
        }

        posted_data.id = post_options.id;
        umlClient._wsInterface.send(JSON.stringify({
            post: {
                manager: ret.id,
                type: type,
                id: posted_data.id
            }
        }));

        await umlClient.receiveDefaultResponse();

        return posted_data;
    }

    ret.get = async function(id) {
        const local_result = ret.getLocal(id);
        if (local_result) {
            return local_result;
        }

        if (!umlClient.initialized) {
            await umlClient.initialization;
        }

        return await new Promise((resolve_get_request) => {
            umlClient._wsInterface.send(JSON.stringify({
                get: id + '?manager='+ret.id
            }));
            umlClient._requestQueue.push(async (data) => {
                const el = await ret.parse(data);
                ret._graph.set(id, el.id);
                if (id === '')
                    ret._head = el;

                if (el._stereotype) {
                    resolve_get_request(el._stereotype);
                }

                resolve_get_request(el);
            });
        });
    }

    ret.put = async function(el) {
        if (!umlClient.initialized) {
            throw Error("Client is not initialized, please await the result of the UmlClient.initialization!");
        }

        if (el.typeInfo.is_stereotype || !el.typeInfo.generated) {
            umlClient._wsInterface.send(JSON.stringify({
                put: {
                    element: el.__proto__.emit()
                }
            }));
        } else {
            umlClient._wsInterface.send(JSON.stringify({
                put: {
                    manager: ret.id,
                    element: el.emit()
                }
            }));
        }

        await umlClient.receiveDefaultResponse();
    }

    ret.delete = async function(el) {
        if (!umlClient.initialized) {
            throw Error("Client is not initialized, please await the result of the UmlClient.initialization!");
        }
        Manager.prototype.delete.call(ret, el); // call super
        umlClient._wsInterface.send(JSON.stringify({
            delete: el.id + '?manager=' +ret.id
        }));

        await umlClient.receiveDefaultResponse();
    }

    ret.apply = async function(el, stereotype) {
        let created_stereotype = undefined;
        for (const type of ret._types) {
            if (type.typeInfo.name === stereotype || type.typeInfo.id === stereotype) {
                created_stereotype = type.typeInfo.apply(el);
                break;
            }
        }

        umlClient._wsInterface.send(JSON.stringify({
            post: {
                type: stereotype,
                applying_element: el.id,
                manager: ret.id,
                id: created_stereotype._stereotypeID
            }
        }));

        await umlClient.receiveDefaultResponse();

        return created_stereotype;
    }
    
    return ret;
}
