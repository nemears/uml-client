import { randomID } from './types/element';
import Singleton from './singleton';
import UmlSet from './set';

export const STRING_ID = 'string_L&R5eAEq6f3LUNtUmzHzT';
export const BOOL_ID = 'bool_bzkcabSy3CiFd&HmJOtnVRK';
export const INT_ID = 'int_r9nNbBukx47IomXrT2raqtc4';
export const REAL_ID = 'real_aZG&w6yl61bXVWutgeyScN9';

export const PROXY_ELEMENT_ID = 'vGgiqnpfTQ19Ke9IXiz6Gf8xbW2F';
export const MODEL_ELEMENT_ID_ID = 'Ui4ikmeWG4d&PyRMsJqi2GC8rVnx';

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
            // check if it's already been made
            for (const propertyInfo of properties) {
                if (propertyInfo.id === property.id) {
                    return propertyInfo;
                }
            }

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
            properties.unshift(propertyInfo);

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
                propertyInfo.redefines.push(await createPropertyInfo(redefinedProperty));
            }

            // subsets
            propertyInfo.subsets = [];
            for await (const subsettedProperty of property.subsettedProperties) {
                propertyInfo.subsets.push(await createPropertyInfo(subsettedProperty));
            }

            // Create set / singleton based on multiplicity
            if (multiplicity.lowerValue !== undefined && multiplicity.upperValue !== undefined) {
                // we can check the multiplicity
                if (multiplicity.lowerValue === 1 && multiplicity.upperValue === 1) {
                    // TODO turn to reg javascript property eventuall but for now singleton for simplicity
                    propertyInfo.type = 'singleton';
                } else if (multiplicity.lowerValue === 0 && multiplicity.upperValue === 1) {
                    propertyInfo.type = 'singleton';
                } else {
                    propertyInfo.type = 'set';
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
            const existingSet = me.sets.get(propertyInfo.id);
            if (existingSet && existingSet.me == me && me[propertyInfo.name] !== undefined) {
                propertyInfo.set = existingSet;
                return propertyInfo
            }
            if (propertyInfo.name === 'id') {
                console.warn('Warning skipping over property with name id because that is a reserved prototype name for elements in the api');
                return undefined;
            }
            const fillOutSet = (propertySet) => {
                propertySet.definingFeature = propertyInfo.id;
                if (propertyInfo.opposite) {
                    propertySet.opposite = propertyInfo.opposite;
                }
                // TODO type
                for (let redefinedPropertyInfo of propertyInfo.redefines) {
                    if (!redefinedPropertyInfo.set) {
                        const createdProperty = createProperty(redefinedPropertyInfo, me);
                        if (createdProperty) {
                            redefinedPropertyInfo = createdProperty;
                        } else {
                            console.warn('Could not created redefined property, could not redefine property not created');
                        }
                    }
                    propertySet.redefines(redefinedPropertyInfo.set);
                }
                for (let subsettedPropertyInfo of propertyInfo.subsets) {
                    if (!subsettedPropertyInfo.set) {
                        const createdProperty = createProperty(subsettedPropertyInfo, me);
                        if (createdProperty) {
                            subsettedPropertyInfo = createdProperty;
                        }
                    }
                    propertySet.subsets(subsettedPropertyInfo.set);
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

            me.delete = async function() {
                for (const referencePair of me.references) {
                    let referencedElement = referencePair[1];
                    if (!referencedElement) {
                        referencedElement = await me.manager.get(referencePair[0]);
                    }
                    for (const setPair of referencedElement.sets) {
                        const set = setPair[1];
                        if (set.setType() === 'singleton') {
                            if (set.id() === me.id) {
                                await set.set(undefined);
                            }
                        } else if (set.setType() === 'set') {
                            if (set.contains(me.id)) {
                                await set.remove(me);
                            }
                        } else {
                            throw Error('bad set type for delete');
                        }
                    }
                    await me.manager.put(referencedElement);
                }
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
                            // get meta class
                            for await (const end of extension.memberEnds) {
                                if (end.id === extension.ownedEnd.id()) {
                                    continue;
                                }
                                metaClasses.push((await end.type.get()).name);
                                break;
                            }
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
                        propertyInfo.existingSet =  undefined;
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
        generationData.stereotypeIds = new Map();
        
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
                        curr.stereotypeIds.set(packagedElement.id, generatedElement);
                    }
                    curr = curr.parentData;
                } 
            }
        }

        // generate manager for package api
        ret[element.name + 'Manager'] = function(apiLocation) {
            this.graph = new Map();
            this.updateHandlers = [];
            this.apiLocation = apiLocation;
            const generatedManager = this;
            umlClient.updateHandlers.push(async function(newElement, oldElement) {
                if (newElement) {
                    if (newElement.id === generatedManager.apiLocation.id) {
                        generatedManager.apiLocation = newElement;
                    }
                    if (newElement.is('InstanceSpecification') && newElement.owner.id() === generatedManager.apiLocation.id) {
                        for (const id of newElement.classifiers.ids()) {
                            if (generationData.ids.get(id) && !generationData.stereotypeIds.get(id)) {
                                const oldApiElement = generatedManager.graph.get(newElement.id);
                                const newApiElement = await generatedManager.getFromServer(newElement.id);
                                generatedManager.graph.set(newElement.id, newApiElement);
                                for (const updateHandler of generatedManager.updateHandlers) {
                                    updateHandler(newApiElement, oldApiElement);
                                }
                            }
                        }
                    } else if (newElement.appliedStereotypes.size() > 0) {
                        for await (const stereotypeInstance of newElement.appliedStereotypes) {
                            for (const id of stereotypeInstance.classifiers.ids()) {
                                if (generationData.stereotypeIds.get(id)) {
                                    const oldApiElement = generatedManager.graph.get(newElement.id);
                                    const newApiElement = await generatedManager.getFromServer(newElement.id);
                                    generatedManager.graph.set(newElement.id, newApiElement);
                                    for (const updateHandler of generatedManager.updateHandlers) {
                                        updateHandler(newApiElement, oldApiElement);
                                    }
                                }
                            }
                        }    
                    }
                } else {
                    // todo run delete
                    if (oldElement.is('InstanceSpecification') && oldElement.owner.id() === generatedManager.apiLocation.id) {
                        for (const id of oldElement.classifiers.ids()) {
                            if (generationData.ids.get(id) && !generationData.stereotypeIds.get(id)) {
                                const oldApiElement = generatedManager.graph.get(oldElement.id);
                                for (const updateHandler of generatedManager.updateHandlers) {
                                    updateHandler(undefined, oldApiElement);
                                }
                                generatedManager.graph.delete(oldElement.id);
                            }
                        }
                    } else if (oldElement.appliedStereotypes.size() > 0) {
                        for await (const stereotypeInstance of oldElement.appliedStereotypes) {
                            for (const id of stereotypeInstance.classifiers.id()) {
                                if (generationData.stereotypeIds.get(id)) {
                                    const oldApiElement =  generatedManager.graph.get(oldElement.id);
                                    for (const updateHandler of generatedManager.updateHandlers) {
                                        updateHandler(undefined, oldApiElement);
                                    }
                                    generatedManager.graph.delete(oldElement.id);
                                }
                            }
                        }
                    }
                }
            });

            const createTypeInstance = async (typeID, postOptions) => {
                const instanceSpecification = umlClient.post('InstanceSpecification', postOptions);
                const typeClass = await umlClient.get(typeID);
                instanceSpecification.classifiers.add(typeClass);
                await generatedManager.apiLocation.packagedElements.add(instanceSpecification);
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
                        const slot = umlClient.post('Slot');
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
                            const defaultValue = umlClient.post(defaultValueType);
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
                umlClient.put(generatedManager.apiLocation);
                return instanceSpecification;
            };

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
                this.graph.set(ret.id, ret);
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
                generatedManager.graph.set(ret.id, ret);
                const instanceSpecification = await createTypeInstance(ret.modelID);
                await el.appliedStereotypes.add(instanceSpecification);
                for await (const slot of instanceSpecification.slots) {
                    const possibleExtension = await (await slot.definingFeature.get()).association.get();
                    if (possibleExtension && possibleExtension.is('Extension')) {
                        // create a proxy element
                        // TODO we can reuse proxy elements, may be more efficient, this is just creating a new instance for every stereotype
                        const proxyInstance = umlClient.post('InstanceSpecification');
                        proxyInstance.classifiers.add(PROXY_ELEMENT_ID);
                        await generatedManager.apiLocation.packagedElements.add(proxyInstance);
                        const modelElementIdSlot = umlClient.post('Slot');
                        modelElementIdSlot.definingFeature.set(MODEL_ELEMENT_ID_ID);
                        await proxyInstance.slots.add(modelElementIdSlot);
                        const modelElementIdValue = umlClient.post('LiteralString');
                        modelElementIdValue.value = el.id;
                        await modelElementIdSlot.values.add(modelElementIdValue);
                        const proxyElementValue = umlClient.post('InstanceValue');
                        await proxyElementValue.instance.set(proxyInstance);
                        await slot.values.add(proxyElementValue);
                        umlClient.put(modelElementIdSlot);
                        umlClient.put(modelElementIdValue);
                        umlClient.put(proxyInstance);
                        umlClient.put(proxyElementValue);
                        umlClient.put(slot);
                        break;
                    }
                }
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

                            if (property.association.has() && (await property.association.get()).is('Extension')) {
                                // Stereotype implementation, we can just leave this be
                                continue;
                            }

                            if (!slot) {
                                throw Error('Error bad state, contact dev! Could not find slot for property ' + property.name + ' in type ' + elClass.name + ' instance');
                            }

                            // get value of el we are putting
                            const elValue = el[property.name];

                            if (property.type.has()) {
                                // handle primitive types
                                const updatePrimitiveTypeProperty = async (literal) => {
                                    const createValue = async () => {
                                        const newValue = umlClient.post(literal);
                                        newValue.value = elValue;
                                        await slot.values.add(newValue);
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
                                                await slot.values.remove(currValue);
                                                await umlClient.deleteElement(currValue);
                                                await createValue();
                                            }
                                        } else if (slot.values.size() === 0) {
                                            await createValue();
                                        } else {
                                            await slot.values.clear();
                                            await createValue();
                                        }
                                    } else {
                                        await slot.values.clear();
                                    }
                                    umlClient.put(slot);
                                };

                                if (property.type.id() === STRING_ID) {
                                    await updatePrimitiveTypeProperty('LiteralString');
                                    continue;
                                } else if (property.type.id() === BOOL_ID) {
                                    await updatePrimitiveTypeProperty('LiteralBool');
                                    continue;
                                } else if (property.type.id() === INT_ID) {
                                    await updatePrimitiveTypeProperty('LiteralInt');
                                    continue;
                                } else if (property.type.id() === REAL_ID) {
                                    await updatePrimitiveTypeProperty('LiteralReal');
                                    continue;
                                }
                            } else {
                                // TODO warn
                            }

                            const multiplicity = await getMultiplicity(property);

                            // helper function to always get proper id despite it being either a stereotype or not
                            const getInstanceID = async (currVal) => {
                                let instanceID = currVal.id;
                                if (currVal.stereotypeIDs) {
                                    // TODO get instanceID from definingFeature info
                                    const definingFeature = await umlClient.get(elValue.definingFeature);
                                    const classifier = await definingFeature.featuringClassifier.get();
                                    let found = false;
                                    for await (const stereotypeInstance of currVal.appliedStereotypes) {
                                        const queue = [];
                                        for await (const stereotypeBase of stereotypeInstance.classifiers) {
                                            queue.push(stereotypeBase);
                                        }
                                        while (queue.length > 0) {
                                            const front = queue.shift();
                                            if (front.id === classifier.id) {
                                                instanceID = stereotypeInstance.id;
                                                found = true;
                                                break;
                                            }
                                            for await (const generalization of front.generalizations) {
                                                queue.push(await generalization.general.get());
                                            }
                                        }
                                    }
                                    if (!found) {
                                        throw Error('Bad state! Must not be a stereotype!');
                                    }
                                }
                                return instanceID;
                            };

                            if (multiplicity.lowerValue <= 1 && multiplicity.upperValue === 1) {
                                // singleton
                                if (elValue.has()) {
                                    const createValue = async () => {
                                        const currVal = await elValue.get();
                                        const instanceID = await getInstanceID(currVal);
                                        const newValue = umlClient.post('InstanceValue');
                                        newValue.instance.set(instanceID);
                                        slot.values.add(newValue);
                                        umlClient.put(newValue);
                                    };
                                    if (slot.values.size() === 1) {
                                        const currValue = await slot.values.front();
                                        if (currValue.is('InstanceValue')) {
                                            if (currValue.instance.has()) {
                                                const elApiID = await getInstanceID(await elValue.get())
                                                if (currValue.instance.id() !== elApiID) {
                                                    currValue.instance.set(elApiID);
                                                }
                                                umlClient.put(currValue);
                                            } else {
                                                throw Error('Bad stat putting an instance value with no instance');
                                            }
                                        } else {
                                            throw Error('weird state reached where not an instance value was in a singleton slot, contact dev');
                                        }
                                    } else if (slot.values.size() === 0) {
                                        await createValue();
                                    } else {
                                        console.warn('weird state reached where a singleton slot had more than one value! contact dev');
                                        await slot.values.clear();
                                        await createValue();
                                    }
                                } else {
                                    await slot.values.clear();
                                }
                                umlClient.put(slot);
                            } else {
                                // assume it is a set
                                // TODO check multiplicity
                                await slot.values.clear(); // may also want to delete them but backend has gc
                                for await (const instance of elValue) {
                                    if (instance.stereotypeIDs) {
                                        throw Error('Bad state, non instance set for instanceValue instance!');
                                    }
                                    const instanceID = await getInstanceID(instance);
                                    const instanceValue = umlClient.post('InstanceValue');
                                    await instanceValue.instance.set(instanceID);
                                    await slot.values.add(instanceValue);
                                    umlClient.put(instanceValue);
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
                    await localResult._apiPostPromise;
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
                        const set = ret.sets.get(definingFeature.id);
                        const setType = set.setType();
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
                                set.set(slotValue.instance.id());
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
                                const set = ret.sets.get(definingFeature.id);
                                if (!set.contains(slotValue.instance.id())) { // TODO this breaks ordered sets, just check subsets instead
                                    set.add(slotValue.instance.id());
                                }
                                // ret[definingFeature.name].add(slotValue.instance.id());
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
                        generatedManager.graph.set(ret.id, ret);
                        await fillOutType(ret, stereotypeInstance);
                    }
                    ret.manager = generatedManager;
                    return ret;
                } else if (instanceSpecification.is('InstanceSpecification')) {
                    // check if there is an extension slot, if there is we need to construct a stereotypedElement
                    for await (const slot of instanceSpecification.slots) {
                        const possibleExtension = await (await slot.definingFeature.get()).association.get();
                        if (possibleExtension && possibleExtension.is('Extension')) {
                            const proxyElementInstance = await (await slot.values.front()).instance.get();
                            const proxyElementId = (await (await proxyElementInstance.slots.front()).values.front()).value;

                            // return recursive call to the stereotyped element
                            const ret = await this.get(proxyElementId);
                            generatedManager.graph.set(id, ret);
                            return ret;
                        }
                    }
                    const typeConstructor = getConstructorOfInstance(instanceSpecification);
                    const ret = new typeConstructor();
                    ret.id = id;
                    ret.manager = this;
                    this.graph.set(id, ret);
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
                await el.delete();
                if (instanceSpecification) {
                    if (generatedManager.apiLocation.packagedElements.contains(instanceSpecification)) {
                        generatedManager.apiLocation.packagedElements.remove(instanceSpecification);
                    }
                    await umlClient.deleteElement(instanceSpecification);
                }
                umlClient.put(generatedManager.apiLocation);
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
