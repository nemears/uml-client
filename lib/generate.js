import { randomID } from './types/element';
import Singleton from './singleton';
import UmlSet from './set';

export const STRING_ID = 'string_L&R5eAEq6f3LUNtUmzHzT';
export const BOOL_ID = 'bool_bzkcabSy3CiFd&HmJOtnVRK';
export const INT_ID = 'int_r9nNbBukx47IomXrT2raqtc4';
export const REAL_ID = 'real_aZG&w6yl61bXVWutgeyScN9';

const KERNEL_TYPES = new Set(['XI35viryLd5YduwnSbWpxSs3npcu', 'Ox30_bFSsGtPZorPYOkDTLeXquIN', 'zvAhfu&WNCI1cNXd3BkqhxywHAYY', '&ve0WKXZ2Hn47xMl&Dl&lXPTMHD9', 'pUg_kaODi6D0KMi6MXAJcMWMG3G_', 'OM2kyIbDJFpRNvNRhSNDTl_xetVp']);

export async function generate(element, umlClient, parentData) {
    const generationData = {
        id: element.id,
        parentData: parentData,
    };
    if (element.is('Classifier')) {
        // check if it has a name
        if (element.name === '') {
            throw Error('Error generating class ' + element.id + ', class must have name to generate!');
        }

        // create corresponding property sets
        const properties = [];
        const queue = [element];
        const elementTypes = new Set();

        const createPropertyInfo = async (property) => {
            // check if it has a name
            if (property.name === '') {
                throw Error('Error generating class ' + element.name + ', property ' + property.id + ' must have a name to generate!');
            }
            let propertyInfo = {
                name: property.name,
                id: property.id,
            };
            
            const multiplicity = await getMultiplicity(property);
            propertyInfo = { ...propertyInfo, ...multiplicity };

            // check if it is a special type
            if (property.type.has()) {
                const propertyType = await property.type.get();
                if (propertyType.id === STRING_ID) {
                    if (property.defaultValue.has()) {
                        const defaultValue = await property.defaultValue.get();
                        if (!defaultValue.is('LiteralString')) {
                            throw Error('Error generating class ' + element.name + ', property ' + property.name + ' specified as string but defaultValue was not string!');
                        }
                        propertyInfo.defaultValue = defaultValue.value;
                    }
                    propertyInfo.type = 'string';
                    properties.unshift(propertyInfo);
                    return propertyInfo;
                } else if (propertyType.id === BOOL_ID) {
                    if (property.defaultValue.has()) {
                        const defaultValue = await property.defaultValue.get();
                        if (!defaultValue.is('LiteralBool')) {
                            throw Error('Error generating class ' + element.name + ', property ' + property.name + ' specified as bool but defaultValue was not bool!');
                        }
                        propertyInfo.defaultValue = defaultValue.value;
                    }                    
                    propertyInfo.type = 'bool';
                    properties.unshift(propertyInfo);
                    return propertyInfo;
                } else if (propertyType.id === INT_ID) {
                    if (property.defaultValue.has()) {
                        const defaultValue = await property.defaultValue.get();
                        if (!defaultValue.is('LiteralInt')) {
                            throw Error('Error generating class ' + element.name + ', property ' + property.name + ' specified as int but defaultValue was not int!');
                        }
                        propertyInfo.defaultValue = defaultValue.value;
                    }                    
                    propertyInfo.type = 'bool';
                    properties.unshift(propertyInfo);
                    return propertyInfo;
                } else if (propertyType.id === REAL_ID) {
                    if (property.defaultValue.has()) {
                        const defaultValue = await property.defaultValue.get();
                        if (!defaultValue.is('LiteralReal')) {
                            throw Error('Error generating class ' + element.name + ', property ' + property.name + ' specified as real but defaultValue was not real!');
                        }
                        propertyInfo.defaultValue = defaultValue.value;
                    }                    
                    propertyInfo.type = 'real';
                    properties.unshift(propertyInfo);
                    return propertyInfo;
                }
            } else {
                console.warn('Warning generating class ' + element.name + ', property ' + property.name + ' does not have a type!');
            }

            // check if it has valid opposite
            let opposite;
            if (property.association.has()) {
                const association = await property.association.get()
                let oppositeEnd;
                for await (const end of association.memberEnds) {
                    if (end.id !== property.id) {
                        oppositeEnd = end;
                        break;
                    }
                }
                if (oppositeEnd.owner.has() && !(await oppositeEnd.owner.get()).is('Association')) {
                    if (!oppositeEnd.name || oppositeEnd.name === '') {
                        console.warn('Warning, not setting opposite for property ' + property.name + ' because opposite does not have a name!');
                    } else {
                        opposite = oppositeEnd.id;
                    }
                }
            }
            if (opposite) {
                propertyInfo.opposite = opposite;
            }

            // redefines
            propertyInfo.redefines = [];
            for await (const redefinedProperty of property.redefinedProperties) {
                let found = false;
                for (const propertyInfo of properties) {
                    if (propertyInfo.id === redefinedProperty.id) {
                        propertyInfo.redefines.push(propertyInfo);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    propertyInfo.redefines.push(await createPropertyInfo(redefinedProperty));
                }
            }

            // subsets
            propertyInfo.subsets = [];
            for await (const subsettedProperty of property.subsettedProperties) {
                let found = false;
                for (const propertyInfo of properties) {
                    if (propertyInfo.id === subsettedProperty.id) {
                        propertyInfo.subsets.push(propertyInfo);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    propertyInfo.subsets.push(await createPropertyInfo(subsettedProperty));
                }
            }

            // Create set / singleton based on multiplicity
            if (multiplicity.lowerValue !== undefined && multiplicity.upperValue !== undefined) {
                // we can check the multiplicity
                if (multiplicity.lowerValue === 0 && multiplicity.upperValue === 1) {
                    propertyInfo.type = 'singleton';
                    properties.unshift(propertyInfo);
                } else {
                    propertyInfo.type = 'set';
                    properties.unshift(propertyInfo);
                }
            } else {
                // TODO think about making it easy to generate, vs strict to make sure user gets 
                // the behavior they are thinking of.
                //
                // For now we are just assuming it is a set, I think users might appreciate this since
                // a set would most likely be more popular over a singleton and effectively can act as
                // singleton with some extra syntax
                console.warn('no multiplicity bounds detected on property ' + property.name + '!');
                propertyInfo.type = 'set';
                propertyInfo.lowerValue = 0;
                propertyInfo.upperValue = '*';
                properties.unshift(propertyInfo);
            }
            
            return propertyInfo;
        };

        while (queue.length !== 0) {
            const front = queue.shift();
            if (front.name) {
                elementTypes.add(front.name);
            }
            for await (const generalization of front.generalizations) {
                if (generalization.general.has()) {
                    const general = await generalization.general.get();
                    queue.push(general);
                } else {
                    console.warn('generalization without a general found while generating class ' + element.name);
                }
            }
            for await (const property of front.attributes) {
                await createPropertyInfo(property);
            }
        }
       
        // helper for stereotype and rest
        const createProperty = (propertyInfo, me) => {
            const existingSet = me.sets.get(propertyInfo.name);
            if (existingSet && me[propertyInfo.name] !== undefined) {
                console.warn('duplicate property in sets found ' + propertyInfo.name);
                propertyInfo.set = existingSet;
                return propertyInfo
            }
            if (me[propertyInfo.name] !== undefined) {
                console.warn('duplicate property in prototype found, property: ' + propertyInfo.name, + ', prototype: ' + element.name);
                return propertyInfo;
            }
            const fillOutSet = (propertySet) => {
                propertySet.definingFeature = propertyInfo.id;
                if (propertyInfo.opposite) {
                    propertySet.opposite = propertyInfo.opposite;
                }
                // TODO type
                for (let redefinedPropertyInfo of propertyInfo.redefines) {
                    if (!redefinedPropertyInfo.set) {
                        redefinedPropertyInfo = createProperty(redefinedPropertyInfo, me);
                    }
                    propertySet.redefines(redefinedPropertyInfo.set);
                }
                for (let subsettedPropertyInfo of propertyInfo.subsets) {
                    if (!subsettedPropertyInfo.set) {
                        subsettedPropertyInfo = createProperty(subsettedPropertyInfo, me);
                    }
                    propertySet.subsets(subsettedPropertyInfo.set);
                }
                if (me[propertyInfo.name]) {
                    console.warn('overriding class ' + element.id + ' property ' + propertyInfo.name + ' because there are two properties with the same name!');
                }
                me[propertyInfo.name] = propertySet;
                me.sets.set(propertyInfo.name, propertySet);
                me.sets.set(propertyInfo.id, propertySet);
                propertyInfo.set = propertySet;
            };
            switch (propertyInfo.type) {
                case 'bool': 
                case 'string':
                case 'int':
                case 'real': {
                    me[propertyInfo.name] = propertyInfo.defaultValue;
                    break;
                }
                case 'set': {
                    const propertySet = new UmlSet(me);
                    // TODO bounds
                    fillOutSet(propertySet);
                    break;
                }
                case 'singleton': {
                    const propertySingleton = new Singleton(me);
                    fillOutSet(propertySingleton);
                    break;
                }
                default: 
                    throw Error('Bad property type given bad state, contact dev!');
            }
            return propertyInfo;
        } 

        const classConstructor = (me) => {
            me.id = randomID();
            me.modelID = element.id;
            me.sets = new Map();
            me.references = new Map();
            me.elementTypes = elementTypes;

            for (const propertyInfo of properties) {
                createProperty(propertyInfo, me);
            }

            me.elementType = function() {
                return element.name;
            }
            
            me.is = function(type) {
                return me.elementTypes.has(type);
            }
        }

        if (element.is('Stereotype')) {
            // TODO generate a metaclass based on extension
            //
            // We need to think of the approach here, UML historically 
            // goes and does stuff using MOF (think tagged values from stereotypes)
            // but right now we are not doing things that way. 
            //
            // The case to do stereotypes
            // with MOF and accessing things through "tags" and creating stereotypes
            // through a factory would be good in the case that it is similar to other
            // modeling software and apis
            //
            // ... however those apis are notable frustrating to use, this could be a chance
            // to sort of break from the norms and have a lot more useful api to allow the
            // developer to have an easier time. In the end i feel that we may end up using 
            // sort of both. MOF may have to be implemented internally to allow for the 
            // interoperability between other tools, however i think to make this software
            // "better" than others in some way is to be different and simpler / easier for 
            // the user
            //
            // For now we are just using same api as classifiers, but we are also feeding
            // it into special manager methods called apply(el, stereotypeType) and getStereotype(el) // TODO
            //
            // WARN TODO implement this with MOF but for now we are skipping

            // get relevant extensions
            // TODO double check we need this, this just validates stuff before generating
            const metaClasses = [];
            const profile = await element.profile.get();
            const queue = [profile];
            while (queue.length > 0) {
                const front = queue.shift();
                if (front.is('Package')) {
                    for await (const packagedElement of front.packagedElements) {
                        queue.push(packagedElement);
                    }
                } else if (front.is('Extension')) {
                    // look to see if the type of the extensionEnd is the stereotype
                    const extension = front;
                    if (extension.ownedEnd.has()) {
                        if ((await extension.ownedEnd.get()).type.id() === element.id) {
                            metaClasses.push(extension.metaClass);
                        }
                    }
                }

            }

            if (metaClasses.length === 0) {
                console.warn('no extension found for stereotype ' + element.name + '!');
            }

            return function(applyingElement) {
                if (applyingElement) {
                    let valid = false;
                    if (metaClasses.length === 0) {
                        valid = true;
                    }
                    for (const metaClass of metaClasses) {
                        if (applyingElement.is(metaClass)) {
                            valid = true;
                            break;
                        }
                    }

                    if (!valid) {
                        throw Error('Invalid element type for applying stereotype ' + element.name + '!');
                    }

                    this.__proto__ = applyingElement;

                    for (const elementType of elementTypes) {
                        this.elementTypes.add(elementType);
                    }
                    
                    for (const propertyInfo of properties) {
                        createProperty(propertyInfo, this);
                    }

                        this.modelID = element.id; // idk

                    if (!this.stereotypeIDs) {
                        this.stereotypeIDs = [element.id];
                    } else {
                        this.stereotypeIDs.push(element.id);
                    }

                    this.sterotype = function() {
                        return element.name;
                    }
                } else {
                    throw Error('TODO');
                    // classConstructor(this);
                }
            };
        }

        // simple blank constructor
        return function() {
            classConstructor(this);
        }
    } else if (element.is('Package')) {
        // generate module for import
        if (element.name === '') {
            throw Error('Cannot generate package ' + element.id + ' because a name was not specified for it!');
        }

        generationData.name = element.name;
        generationData.ids = new Map();
        generationData.types = new Map();
        generationData.stereotypes = new Map();
        
        const ret = {};
        for await (const packagedElement of element.packagedElements) {
            const generateElement = async () => {
                const generatedElement = await generate(packagedElement, umlClient, generationData);
                ret[packagedElement.name] = generatedElement;
                return generatedElement;
            }
            if (packagedElement.is('Package')) {
                await generateElement();
            } else if (packagedElement.is('Classifier') && !packagedElement.is('Association')) {
                let generatedElement;
                try {
                    generatedElement = await generateElement();
                }
                catch (exception) {
                    console.warn('hit exception while parsing element' + exception);
                    continue;
                }
                const isStereotype = packagedElement.is('Stereotype');
                var curr = generationData;
                while (curr) {
                    var typeName = packagedElement.name;
                    var typeCurr = generationData;
                    while (typeCurr.id !== curr.id) {
                        typeName = typeCurr.name + '.' + typeName;
                        typeCurr = typeCurr.parentData;
                    }
                    curr.types.set(typeName, generatedElement);
                    curr.ids.set(packagedElement.id, generatedElement);
                    if (isStereotype) {
                        curr.stereotypes.set(typeName, generatedElement);
                    }
                    //console.log('created type ' + typeName + ' for Module ' + curr.name);
                    curr = curr.parentData;
                } 
            }
        }

        // TODO generate manager for package api
        ret[element.name + 'Manager'] = function(apiLocation) {
            this.onUpdate = function() {
                console.warn('overide ' + element.name + 'Manager.onUpdate(newElement, oldElement) to handle new api Elements being updated from other clients!');
            }
            const oldOnUpdate = umlClient.onUpdate;
            umlClient.onUpdate = function(newElement, oldElement) {
                oldOnUpdate(newElement, oldElement)
                if (newElement.is('InstanceSpecification')) {
                    for (const id of newElement.classifiers.ids()) {
                        if (generationData.ids.get(id)) {
                            const oldApiElement = this.graph.get(id);
                            const newApiElement = this.getFromServer(id);
                            this.graph.set(id, newApiElement);
                            this.onUpdate(newApiElement, oldApiElement);
                        }
                    }
                }
            }

            this.graph = new Map();

            const createTypeInstance = async (typeID, postOptions) => {
                const instanceSpecification = umlClient.post('instanceSpecification', postOptions);
                this.graph.set(ret.id, ret);
                const typeClass = await umlClient.get(typeID);
                instanceSpecification.classifiers.add(typeClass);
                await apiLocation.packagedElements.add(instanceSpecification);
                const queue = [typeClass];
                const slots = new Set();
                while (queue.length > 0) {
                    const front = queue.shift();
                    for await (const generalization of front.generalizations) {
                        if (generalization.general.has()) {
                            // make sure it isn't a kernel type
                            if (!KERNEL_TYPES.has(generalization.general.id())) {          
                                queue.push(await generalization.general.get());
                            }
                        }
                    }
                    for await (const property of front.attributes) {
                        // TODO take account of subsets and redefines
                        if (slots.has(property.id)) {
                            continue;
                        }
                        const slot = umlClient.post('slot');
                        await slot.definingFeature.set(property);
                        await slot.owningInstance.set(instanceSpecification);
                        slots.add(property.id);
                        for (const redefinedPropertyID of property.redefinedProperties.ids()) {
                            // we want to make sure redefined properties aren't set because we are redefining them
                            slots.add(redefinedPropertyID);
                        }
                        if (property.defaultValue.has()) {
                            const defaultValueOG = await property.defaultValue.get();
                            const defaultValueType = defaultValueOG.elementType();
                            const defaultValue = umlClient.post(defaultValueType.charAt(0).toLowerCase() + defaultValueType.slice(1));
                            if (defaultValue.is('LiteralSpecification')) {
                                defaultValue.value = defaultValueOG.value;
                            } else if (defaultValue.is('InstanceValue')) {
                                await defaultValue.instance.set(defaultValueOG.instance.id());
                            } else {
                                throw Error('Unhandled default value type! contact dev!');
                            }
                            await slot.values.add(defaultValue);
                        }
                    }
                }
                return instanceSpecification;
            };

            const generatedManager = this;
            this.post = function(type, options) {
                let postOptions = options || {
                    id: randomID()
                };
                const typeClassJS = generationData.types.get(type);
                if (!typeClassJS) {
                    throw Error('Manager does not know type ' + type + ' to instantiate!');
                }
                const ret = new typeClassJS();
                ret.id = postOptions.id;
                ret.manager = this;
                ret._apiPostPromise = createTypeInstance(ret.modelID, postOptions);
                ret.manager = generatedManager;
                return ret;
            };
            this.apply = async function(el, stereotype) {
                const stereotypeJS = generationData.stereotypes.get(stereotype);
                if (!stereotypeJS) {
                    throw Error('Could not apply stereotype ' + stereotype + ' because manager could not find that type!');
                }
                const ret = new stereotypeJS(el);
                ret.manager = generatedManager;
                const instanceSpecification = await createTypeInstance(ret.modelID);
                await el.appliedStereotypes.add(instanceSpecification);
                return ret;
            };
            this.put = async function(el) {
                const updateInstanceOfClass = async (elInstance, elClass) => {
                    const slots = new Set();
                    const queue = [elClass];
                    while (queue.length > 0) {
                        const front = queue.shift();
                        for await (const generalization of front.generalizations) {
                            if (generalization.general.has()) {
                                if (!KERNEL_TYPES.has(generalization.general.id())) {
                                    queue.push(await generalization.general.get());
                                }
                            }
                        }
                        for await (const property of front.attributes) {
                            // TODO take account of subsets and redefines
                            if (slots.has(property.id)) {
                                continue;
                            }
                            let slot;
                            for await (const currSlot of elInstance.slots) {
                                if (currSlot.definingFeature.id() === property.id) {
                                    slot = currSlot;
                                    break;
                                }
                            }
                            slots.add(property.id);
                            for (const redefinedPropertyID of property.redefinedProperties.ids()) {
                                slots.add(redefinedPropertyID);
                            }

                            if (!slot) {
                                throw Error('Error bad state, contact dev! Could not find slot for property ' + property.name + ' in type ' + elClass.name + ' instance');
                            }

                            // get value of el we are putting
                            const elValue = el[property.name];

                            if (property.type.has()) {
                                // handle primitive types
                                const updatePrimitiveTypeProperty = async (literal) => {
                                    const createValue = () => {
                                        const newValue = umlClient.post(literal);
                                        newValue.value = elValue;
                                        slot.values.add(newValue);
                                        umlClient.put(newValue);
                                    };
                                    if (elValue !== undefined) {
                                        if (slot.values.size() === 1) {
                                            const currValue = await slot.values.front();
                                            if (currValue.is(literal.charAt(0).toUpperCase() + literal.slice(1))) {
                                                // check if it has same value
                                                if (elValue !== currValue.value) {
                                                    currValue.value = elValue;
                                                    umlClient.put(currValue);
                                                }
                                            } else {
                                                console.warn('weird state reached, updating element to server but primitive type slot was not of right type, contact dev');
                                                slot.values.remove(currValue);
                                                await umlClient.deleteElement(currValue);
                                                createValue();
                                            }
                                        } else if (slot.values.size() === 0) {
                                            createValue();
                                        } else {
                                            slot.values.clear();
                                            createValue();
                                        }
                                    } else {
                                        await slot.values.clear();
                                    }
                                    umlClient.put(slot);
                                };

                                if (property.type.id() === STRING_ID) {
                                    await updatePrimitiveTypeProperty('literalString');
                                    continue;
                                } else if (property.type.id() === BOOL_ID) {
                                    await updatePrimitiveTypeProperty('literalBool');
                                    continue;
                                } else if (property.type.id() === INT_ID) {
                                    await updatePrimitiveTypeProperty('literalInt');
                                    continue;
                                } else if (property.type.id() === REAL_ID) {
                                    await updatePrimitiveTypeProperty('literalReal');
                                    continue;
                                }
                            } else {
                                // TODO warn
                            }

                            const multiplicity = await getMultiplicity(property);
                            if (multiplicity.lowerValue === 0 && multiplicity.upperValue === 1) {
                                // singleton
                                if (elValue.has()) {
                                    const createValue = () => {
                                        const newValue = umlClient.post('instanceValue');
                                        newValue.instance.set(elValue.id());
                                        slot.values.add(newValue);
                                        umlClient.put(newValue);
                                    };
                                    if (slot.values.size() === 1) {
                                        const currValue = await slot.values.front();
                                        if (currValue.is('InstanceValue')) {
                                            if (currValue.instance.has()) {
                                                if (currValue.instance.id() !== elValue.id()) {
                                                    currValue.instance.set(elValue.id());
                                                }
                                                umlClient.put(currValue);
                                            } else {
                                                throw Error('Bad stat putting an instance value with no instance');
                                            }
                                        } else {
                                            throw Error('weird state reached where not an instance value was in a singleton slot, contact dev');
                                            // console.warn('weird state reached where not an instance value was in a singleton slot, contact dev');
                                            // slot.values.clear();
                                            // createValue();
                                        }
                                    } else if (slot.values.size() === 0) {
                                        createValue();
                                    } else {
                                        console.warn('weird state reached where a singleton slot had more than one value! contact dev');
                                        slot.values.clear();
                                        createValue();
                                    }
                                } else {
                                    await slot.values.clear();
                                }
                                umlClient.put(slot);
                            } else {
                                // assume it is a set
                                // TODO check multiplicity
                                const valuesToDelete = new Set(); 
                                const valuesToAdd = new Set(); 
                                for (const id of elValue.ids()) {
                                    valuesToAdd.add(id);
                                }
                                for await (const value of slot.values) {
                                    if (value.is('InstanceValue')) {

                                        // sometimes this violates the uml spec, because the instance can be a UML element

                                        if (value.instance.has()) {
                                            if (valuesToAdd.has(value.instance.id())) {
                                                valuesToDelete.add(value);
                                            }
                                        } else {
                                            console.warn('weird state reched were a set value didnt have an instance');
                                            valuesToDelete.add(value);
                                        }
                                    }
                                }
                                for (const value of valuesToDelete) {
                                    slot.values.remove(value);
                                    await umlClient.deleteElement(value);
                                }
                                for (const id of valuesToAdd) {
                                    const value = umlClient.post('instanceValue');
                                    value.instance.set(id);
                                    slot.values.add(value);
                                    umlClient.put(value);
                                }
                            }
                            umlClient.put(slot);
                        }
                    }
                    umlClient.put(elInstance);
 
                };
                if (!el) {
                    throw Error('tried to put undefined value to server!');
                }
                await el._apiPostPromise; 
                const umlEl = await umlClient.get(el.id);
                if (umlEl.appliedStereotypes.size() === 0) {
                    if (!umlEl.is('InstanceSpecification')) {
                        throw Error('must put either an instance of the api, or a stereotyped element!');
                    }
                    const modelElement = umlClient.getLocal(el.modelID);
                    if (modelElement.is('Classifier')) {
                        const elClass = await umlClient.get(el.modelID);
                        await updateInstanceOfClass(umlEl, elClass);
                    } else {
                        throw Error('TODO contact dev for mutating not classes TODO!!!!!!');
                    }
                } else {
                    for await (const stereotypeInstance of umlEl.appliedStereotypes) {
                        for (const classifierID of stereotypeInstance.classifiers.ids()) {
                            if (el.stereotypeIDs.find((id) => id === classifierID)) {
                                const stereotype = await umlClient.get(classifierID);
                                await updateInstanceOfClass(stereotypeInstance, stereotype);
                                break;
                            }
                        }
                    }
                    umlClient.put(umlEl);
                }
            };
            this.get = async function(id) {
                const localResult = this.getLocal(id);
                if (localResult) {
                    // it was available locally
                    return localResult;
                } else {
                    return await this.getFromServer(id);
                }
            };
            this.getFromServer = async function(id) {
                const instanceSpecification = await umlClient.get(id);
                if (!instanceSpecification) {
                    return undefined;
                }

                const fillOutType = async (ret, instanceSpecification) => {
                    for await (const slot of instanceSpecification.slots) {
                        if (!slot.definingFeature.has()) {
                            throw Error('incomplete slot that has no defining feature encountered when getting element of id: ' + id);
                        }
                        const definingFeature = await slot.definingFeature.get();
                        if (definingFeature.name === '') {
                            throw Error('definingFeature does not have name!');
                        }
                        if (definingFeature.type.has()) {
                            // primitive types
                            const typeID = definingFeature.type.id();
                            if (typeID === STRING_ID ||
                                typeID === BOOL_ID ||
                                typeID === INT_ID ||
                                typeID === REAL_ID) 
                            {
                                if (slot.values.size() > 0) {
                                    ret[definingFeature.name] = (await slot.values.front()).value;
                                }
                                continue;
                            }
                        }
                        // TODO singletons and sets
                        const setType = ret[definingFeature.name].setType();
                        if (setType === 'singleton') {
                            if (slot.values.size() > 0) {
                                if (slot.values.size() > 1) {
                                    throw Error('bad state for singleton, too many slot values');
                                }
                                const slotValue = await slot.values.front();
                                if (!slotValue.is('InstanceValue')) {
                                    throw Error('bad state for singleton, slot value is not an instance value!');
                                } 
                                if (!slotValue.instance.has()) {
                                    throw Error('bad state for singleton, slot value does not have instance set!');
                                }
                                // const actualValue = await this.get(slotValue.instance.id()); // TODO watch out for opposite behavior
                                // ret[definingFeature.name].set(actualValue);
                                ret[definingFeature.name].set(slotValue.instance.id());
                            }
                        } else if (setType === 'set') {
                            for await (const slotValue of slot.values) {
                                if (!slotValue.is('InstanceValue')) {
                                    throw Error('bad state for singleton, slot value is not an instance value!');
                                } 
                                if (!slotValue.instance.has()) {
                                    throw Error('bad state for singleton, slot value does not have instance set!');
                                }
                                // const actualValue = await this.get(slotValue.instance.id()); // TODO watch out for opposite behavior
                                // ret[definingFeature.name].add(actualValue);
                                ret[definingFeature.name].add(slotValue.instance.id());
                            }
                        } else {
                            throw Error('bad state getting element, cannot get valid set type!');
                        }
                    }

                };

                const getConstructorOfInstance = (instance) => {
                    for (const classifierID of instance.classifiers.ids()) {
                        const hit = generationData.ids.get(classifierID);
                        if (hit) {
                            return hit;
                        }
                    }
                    throw Error('Could not find valid constructor for given instance');
                }

                if (instanceSpecification.appliedStereotypes.size() > 0) {
                    // we're making a stereotypedElement
                    const stereotypedElement = instanceSpecification;
                    var ret = stereotypedElement;
                    for await (const stereotypeInstance of stereotypedElement.appliedStereotypes) {
                        const stereotypeConstructor = getConstructorOfInstance(stereotypeInstance);
                        ret = new stereotypeConstructor(ret);
                        await fillOutType(ret, stereotypeInstance);
                    }
                    ret.manager = generatedManager;
                    return ret;
                } else if (instanceSpecification.is('InstanceSpecification')) {
                    const typeConstructor = getConstructorOfInstance(instanceSpecification);
                    const ret = new typeConstructor();
                    ret.id = id;
                    ret.manager = this;
                    await fillOutType(ret, instanceSpecification);
                    ret.manager = generatedManager;
                    return ret;
                } else {
                    throw Error('Can only get types that have been defined in classifiers for now, contact dev if interested');
                }
            };
            this.getLocal = function(id) {
                return this.graph.get(id);
            };
            this.delete = async function(el) {
                const instanceSpecification = await umlClient.get(el.id);
                apiLocation.packagedElements.remove(instanceSpecification);
                await umlClient.deleteElement(instanceSpecification);
            };
        };
        
        return ret;
    }
    const ret = {};
    return ret;
}

async function getMultiplicity(property) {
    const multiplicity = {};
    if (property.lowerValue.has() && property.upperValue.has()) {
        // we can check the multiplicity
        const lowerValueElement = await property.lowerValue.get();
        if (!lowerValueElement.is('LiteralInt')) {
            throw Error('Lower for property ' + property.name + ' is improper type, all property Lower Values must be a Literal Integer');
        }
        multiplicity.lowerValue = lowerValueElement.value;
        const upperValueElement = await property.upperValue.get();
        if (upperValueElement.is('LiteralInt') && upperValueElement.is('LiteralUnlimitedNatural')) {
            throw Error('Upper value for property ' + property.name + ' is an improper type, all property upper values must be either a Literal Integer or a Literal Unlimited Natural');
        }
        multiplicity.upperValue = upperValueElement.value;
        if (multiplicity.lowerValue < 0) {
            throw Error('Lower value for property ' + property.name + ' is a negative number which is an invalid lower end for a set!');
        } 
        if (multiplicity.upperValue !== '*') {
            if (multiplicity.upperValue < multiplicity.lowerValue) {
                throw Error('Upper value for property ' + property.name + ' is less than the lower value!');
            }
        }
    } else {
        console.warn('no multiplicity bounds detected on property ' + property.name + '!');
    }
    return multiplicity;
}
