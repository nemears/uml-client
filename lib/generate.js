import { randomID } from './element';
import Singleton from './singleton';
import Set from './set';

export const STRING_ID = 'string_L&R5eAEq6f3LUNtUmzHzT';
export const BOOL_ID = 'bool_bzkcabSy3CiFd&HmJOtnVRK';
export const INT_ID = 'int_r9nNbBukx47IomXrT2raqtc4';
export const REAL_ID = 'real_aZG&w6yl61bXVWutgeyScN9';

export async function generate(element, umlClient, parentData) {
    const generationData = {
        id: element.id,
        parentData: parentData,
    };
    if (element.isSubClassOf('classifier')) {
        // check if it has a name
        if (element.name === '') {
            throw Error('Error generating class ' + element.id + ', class must have name to generate!');
        }

        // create corresponding property sets
        const properties = [];
        const queue = [element];

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
                        if (defaultValue.elementType() !== 'literalString') {
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
                        if (defaultValue.elementType() !== 'literalBool') {
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
                        if (defaultValue.elementType() !== 'literalInt') {
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
                        if (defaultValue.elementType() !== 'literalReal') {
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
                if (oppositeEnd.owner.has() && !(await oppositeEnd.owner.get()).isSubClassOf('association')) {
                    if (!oppositeEnd.name || oppositeEnd.name === '') {
                        console.warn('Warning, not setting opposite for property ' + property.name + ' because opposite does not have a name!');
                    } else {
                        opposite = oppositeEnd.name;
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
        return function() {
            this.id = randomID();
            this.modelID = element.id;
            this.sets = {};
            this.references = new Map();
            const createProperty = (propertyInfo) => {
                const fillOutSet = (propertySet) => {
                    if (propertyInfo.opposite) {
                        propertySet.opposite = propertyInfo.opposite;
                    }
                    // TODO type
                    for (let redefinedPropertyInfo of propertyInfo.redefines) {
                        if (!redefinedPropertyInfo.set) {
                            redefinedPropertyInfo = createProperty(redefinedPropertyInfo);
                        }
                        propertySet.redefines(redefinedPropertyInfo.set);
                    }
                    for (let subsettedPropertyInfo of propertyInfo.subsets) {
                        if (!subsettedPropertyInfo.set) {
                            subsettedPropertyInfo = createProperty(subsettedPropertyInfo);
                        }
                        propertySet.subsets(subsettedPropertyInfo.set);
                    }
                    if (this[propertyInfo.name]) {
                        console.warn('overriding class ' + element.id + ' property ' + propertyInfo.name + ' because there are two properties with the same name!');
                    }
                    this[propertyInfo.name] = propertySet;
                    this.sets[propertyInfo.name] = propertySet;
                    propertyInfo.set = propertySet;
                };
                switch (propertyInfo.type) {
                    case 'bool': 
                    case 'string':
                    case 'int':
                    case 'real': {
                        this[propertyInfo.name] = propertyInfo.defaultValue;
                        break;
                    }
                    case 'set': {
                        const propertySet = new Set(this);
                        // TODO bounds
                        fillOutSet(propertySet);
                        break;
                    }
                    case 'singleton': {
                        const propertySingleton = new Singleton(this);
                        fillOutSet(propertySingleton);
                        break;
                    }
                    default: 
                        throw Error('Bad property type given bad state, contact dev!');
                }
                return propertyInfo;
            }
            for (const propertyInfo of properties) {
                createProperty(propertyInfo);
            }

            this.elementType = function() {
                return element.name;
            }
            // TODO isSubClassOf
        }
    } else if (element.isSubClassOf('package')) {
        // generate module for import
        if (element.name === '') {
            throw Error('Cannot generate package ' + element.id + ' because a name was not specified for it!');
        }

        generationData.name = element.name;
        generationData.ids = new Map();
        generationData.types = new Map();
        
        const ret = {};
        for await (const packagedElement of element.packagedElements) {
            const generateElement = async () => {
                const generatedElement = await generate(packagedElement, umlClient, generationData);
                ret[packagedElement.name] = generatedElement;
                return generatedElement;
            }
            if (packagedElement.isSubClassOf('package')) {
                await generateElement();
            } else if (packagedElement.isSubClassOf('classifier') && !packagedElement.isSubClassOf('association')) {
                let generatedElement;
                try {
                    generatedElement = await generateElement();
                }
                catch (exception) {
                    console.warn('hit exception while parsing element' + exception);
                    continue;
                }
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
                if (newElement.isSubClassOf('instanceSpecification')) {
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
            this.post = function(type, options) {
                let postOptions = options || {
                    id: randomID()
                };
                const typeClassJS = generationData.types.get(type);
                if (!typeClassJS) {
                    throw Error('Manager does not know type ' + type + ' to instantiate!');
                }
                const ret = new typeClassJS();
                ret.manager = this;
                const instanceSpecification = umlClient.post('instanceSpecification', postOptions);
                this.graph.set(ret.id, ret);
                instanceSpecification.classifiers.add(ret.modelID);
                apiLocation.packagedElements.add(instanceSpecification);
                const doLater = async () => {
                    const typeClass = await umlClient.get(ret.modelID);
                    const queue = [typeClass];
                    while (queue.length > 0) {
                        const front = queue.shift();
                        for await (const generalization of front.generalizations) {
                            if (generalization.general.has()) {
                                queue.push(await generalization.general.get());
                            }
                        }
                        for await (const property of front.attributes) {
                            // TODO take account of subsets and redefines
                            const slot = umlClient.post('slot');
                            slot.definingFeature.set(property);
                            slot.owningInstance.set(instanceSpecification);
                            if (property.defaultValue.has()) {
                                const defaultValueOG = await property.defaultValue.get();
                                const defaultValue = umlClient.post(defaultValueOG.elementType());
                                if (defaultValue.isSubClassOf('literalSpecification')) {
                                    defaultValue.value = defaultValueOG.value;
                                } else if (defaultValue.isSubClassOf('instanceValue')) {
                                    defaultValue.instance.set(defaultValueOG.instance.id());
                                } else {
                                    throw Error('Unhandled default value type! contact dev!');
                                }
                            }
                        }
                    }
                };
                doLater();
                return ret;
            };
            this.put = function(el) {

                const modelElement = umlClient.getLocal(el.modelID);
                if (modelElement.isSubClassOf('classifier')) {
                    const doLater = async () => {
                        const elClass = await umlClient.get(el.modelID);
                        const elInstance = await umlClient.get(el.id);
                        const queue = [elClass];
                        while (queue.length > 0) {
                            const front = queue.shift();
                            for await (const generalization of front.generalizations) {
                                if (generalization.general.has()) {
                                    queue.push(await generalization.general.get());
                                }
                            }
                            for await (const property of front.attributes) {
                                // TODO take account of subsets and redefines
                                let slot;
                                for await (const currSlot of elInstance.slots) {
                                    if (currSlot.definingFeature.id() === property.id) {
                                        slot = currSlot;
                                        break;
                                    }
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
                                            umlClient.put(slot);
                                        };
                                        if (elValue) {
                                            if (slot.values.size() === 1) {
                                                const currValue = await slot.values.front();
                                                if (currValue.isSubClassOf(literal)) {
                                                    // check if it has same value
                                                    if (elValue !== currValue.value) {
                                                        currValue.value = elValue;
                                                        umlClient.put(currValue);
                                                        umlClient.put(slot);
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
                                            slot.values.clear();
                                            umlClient.put(slot);
                                        }
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
                                        };
                                        if (slot.values.size() === 1) {
                                            const currValue = await slot.values.front();
                                            if (currValue.isSubClassOf('instanceValue')) {
                                                if (currValue.instance.has()) {
                                                    if (currValue.instance.id() !== elValue.id()) {
                                                        currValue.instance.set(elValue.id());
                                                        umlClient.put(currValue);
                                                    }
                                                }
                                            } else {
                                                console.warn('weird state reached where not an instance value was in a singleton slot, contact dev');
                                                slot.values.clear();
                                                createValue();
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
                                    const valuesToDelete = [];
                                    const valuesToAdd = [];
                                    for (const id of elValue.ids()) {
                                        valuesToAdd.push(id);
                                    }
                                    for await (const value of slot.values) {
                                        if (value.isSubClassOf('instanceValue')) {
                                            if (value.instance.has()) {
                                                if (!valuesToAdd.find((id) => id === value.instance.id())) {
                                                    valuesToDelete.push(value);
                                                }
                                            } else {
                                                console.warn('weird state reched were a set value didnt have an instance');
                                                valuesToDelete.push(value);
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
                                    umlClient.put(slot);
                                }
                            }
                        }
                        umlClient.put(elInstance);
                    };
                    doLater();
                } else {
                    throw Error('TODO contact dev for mutating not classes TODO!!!!!!');
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
                // TODO
                const instanceSpecification = await umlClient.get(id);
                if (!instanceSpecification) {
                    return undefined;
                }
                if (instanceSpecification.isSubClassOf('instanceSpecification')) {
                    for (const classifierID of instanceSpecification.classifiers.ids()) {
                        const hit = generationData.ids.get(classifierID);
                        if (hit) {
                            const ret = new hit();
                            ret.id = id;
                            
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
                                        ret[definingFeature.name] = (await slot.values.front()).value;
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
                                        if (!slotValue.isSubClassOf('instanceValue')) {
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
                                        if (!slotValue.isSubClassOf('instanceValue')) {
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

                            return ret;
                        }
                    }
                    throw Error('could not identify a type in this manager for any of the classifiers for the instance corresponding to the id given!')
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
        if (lowerValueElement.elementType() !== 'literalInt') {
            throw Error('Lower for property ' + property.name + ' is improper type, all property Lower Values must be a Literal Integer');
        }
        multiplicity.lowerValue = lowerValueElement.value;
        const upperValueElement = await property.upperValue.get();
        const upperValueType = upperValueElement.elementType();
        if (upperValueType !== 'literalInt' && upperValueType !== 'literalUnlimitedNatural') {
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
