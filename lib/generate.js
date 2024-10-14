import { extendBaseElement, randomID, TypeInfo } from './types/element';
import Singleton from './singleton';
import UmlSet from './set';
import { KERNEL_TYPES } from './modelIds';
import { restoreReferences } from './umlClient';

export const STRING_ID = 'string_L&R5eAEq6f3LUNtUmzHzT';
export const BOOL_ID = 'bool_bzkcabSy3CiFd&HmJOtnVRK';
export const INT_ID = 'int_r9nNbBukx47IomXrT2raqtc4';
export const REAL_ID = 'real_aZG&w6yl61bXVWutgeyScN9';

export const PROXY_ELEMENT_ID = 'vGgiqnpfTQ19Ke9IXiz6Gf8xbW2F';
export const MODEL_ELEMENT_ID_ID = 'Ui4ikmeWG4d&PyRMsJqi2GC8rVnx';

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
        const elementTypes = new Map();

        const createPropertyInfo = async (property, info) => {
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
                typeInfo: info
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
                    propertyInfo.type = 'int';
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
                } else {
                    // assume it is a set / singleton
                    if (property.defaultValue.has()) {
                        const defaultValue = await property.defaultValue.get();
                        if (!defaultValue.is('InstanceValue')) {
                            throw Error('default value not an instanceValue!');
                        }
                        if (!defaultValue.instance.has()) {
                            throw Error('no instance for instanceValue!');
                        }
                        propertyInfo.defaultValue = defaultValue.instance.id();
                    }
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
                        if (opposite.aggregation === 'composite') {
                            propertyInfo.composition = 'anticomposite';
                        }
                    }
                }
            }
            if (opposite) {
                propertyInfo.opposite = opposite;
            }

            // redefines
            propertyInfo.redefines = [];
            for await (const redefinedProperty of property.redefinedProperties) {
                propertyInfo.redefines.push(await createPropertyInfo(redefinedProperty, await createTypeInfo(await redefinedProperty.featuringClassifier.get())));
            }

            // subsets
            propertyInfo.subsets = [];
            for await (const subsettedProperty of property.subsettedProperties) {
                propertyInfo.subsets.push(await createPropertyInfo(subsettedProperty, await createTypeInfo(await subsettedProperty.featuringClassifier.get())));
            }

            //composition
            if (property.aggregation === 'composite') {
                propertyInfo.composition === 'composite';
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

        const createTypeInfo = async (currType) => {
            let currTypeInfo = elementTypes.get(currType.id);
            if (!currTypeInfo) {
                currTypeInfo = new TypeInfo(currType.id, currType.name);
                currTypeInfo.id = currType.id;
            }
            elementTypes.set(currType.id, currTypeInfo);
            for await (const generalization of currType.generalizations) {
                if (generalization.general.has()) {
                    const general = await generalization.general.get();
                    if (KERNEL_TYPES.has(general.id)) {
                        // TypeInfo link will be created when instantiating stereotype
                        continue;
                    }
                    let generalTypeInfo = elementTypes.get(general.id);
                    if (!generalTypeInfo) {
                        generalTypeInfo = await createTypeInfo(general);
                    }
                    currTypeInfo.setBase(generalTypeInfo);
                } else {
                    console.warn('generalization without a general found while generating class ' + element.name);
                }
            }
            for await (const property of currType.attributes) {
                await createPropertyInfo(property, currTypeInfo);
            }
            return currTypeInfo;
        };

        const typeInfo = await createTypeInfo(element);

        // while (queue.length !== 0) {
        //     const front = queue.shift();
        //     if (!front.name) {
        //         console.warn("creating TypeInfo without name during generation, add name to element or else is method won't work");
        //     } else {
        //         elementTypes.set(front.id, new TypeInfo(front.name))
        //     }
        //     for await (const generalization of front.generalizations) {
        //         if (generalization.general.has()) {
        //             const general = await generalization.general.get();
        //             queue.push(general);
        //         } else {
        //             console.warn('generalization without a general found while generating class ' + element.name);
        //         }
        //     }
        //     for await (const property of front.attributes) {
        //         await createPropertyInfo(property);
        //     }
        // }
       
        // helper for stereotype and rest
        
        // a map to hold the types that have been copied for the class contructors
        const copiedTypes = new Map();

        const createProperty = (propertyInfo, me) => {
            me.typeInfo = copiedTypes.get(propertyInfo.typeInfo.id);
            const existingSet = me.typeInfo.getSet(propertyInfo.id);
            if (existingSet/** && existingSet.me == me && me[propertyInfo.name] !== undefined**/) {
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
                //
                if (propertyInfo.composition) {
                    propertySet.composition = propertyInfo.composition;
                }
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
                propertyInfo.set = propertySet;
            };
            switch (propertyInfo.type) {
                case 'bool': {
                    me.typeInfo.specialData.set(propertyInfo.name, {
                        getData() {
                            return me[propertyInfo.name];
                        },
                        setData(val) {
                            if (typeof val === 'string') {
                                if (val === 'true') {
                                    me[propertyInfo.name] = true;
                                } else if (val === 'false') {
                                    me[propertyInfo.name] = false;
                                } else {
                                    throw Error('bad serialization!');
                                }
                            } else {
                                me[propertyInfo.name] = val;
                            }
                        },
                        type: 'bool'
                    });
                    me[propertyInfo.name] = propertyInfo.defaultValue;
                    break;
                }
                case 'string': {
                    me.typeInfo.specialData.set(propertyInfo.name, {
                        getData() {
                            return me[propertyInfo.name];
                        },
                        setData(val) {
                            me[propertyInfo.name] = val;
                        },
                        type: 'string'
                    });
                    me[propertyInfo.name] = propertyInfo.defaultValue;
                    break;
                }
                case 'int': 
                case 'real': {
                    me.typeInfo.specialData.set(propertyInfo.name, {
                        getData() {
                            if (me[propertyInfo.name]) {
                                return me[propertyInfo.name].toString();
                            }
                            return '';
                        },
                        setData(val) {
                            if (typeof val === 'string') {
                                val = parseFloat(val);
                            }
                            me[propertyInfo.name] = val;

                        },
                        type: 'number'
                    });
                    me[propertyInfo.name] = propertyInfo.defaultValue;
                    break;
                }
                case 'set': {
                    const propertySet = new UmlSet(me, propertyInfo.id, propertyInfo.name);
                    // TODO bounds
                    fillOutSet(propertySet);
                    break;
                }
                case 'singleton': {
                    const propertySingleton = new Singleton(me, propertyInfo.id, propertyInfo.name);
                    fillOutSet(propertySingleton);
                    if (propertyInfo.defaultValue) {
                        propertySingleton.set(propertyInfo.defaultValue);
                    }
                    break;
                }
                default: 
                    throw Error('Bad property type given bad state, contact dev!');
            }
            return propertyInfo;
        } 

        const createTypeInfoAndProperties = (me) => {
            me.modelID = element.id;

            const copyTypeInfo = (typeInfoToCopy) => {
               let currTypeInfo = copiedTypes.get(typeInfoToCopy.id);
                if (!currTypeInfo) {
                    currTypeInfo = new TypeInfo(typeInfoToCopy.id, typeInfoToCopy.name);
                } else {
                    return currTypeInfo;
                }
                copiedTypes.set(typeInfoToCopy.id, currTypeInfo);
                for (const base of typeInfoToCopy.base) {
                    const baseInfo = copyTypeInfo(base);
                    currTypeInfo.setBase(baseInfo);
                } 
                return currTypeInfo;
            }

            copyTypeInfo(typeInfo);

            for (const propertyInfo of properties) {
                createProperty(propertyInfo, me);
            }

            me.typeInfo = copiedTypes.get(typeInfo.id);
            copiedTypes.clear();
            for (const propertyInfo of properties) {
                propertyInfo.set = undefined;
            }
        }

        const classConstructor = (me, manager) => {
            extendBaseElement(me, manager);
            createTypeInfoAndProperties(me);
            
            // override baseElement::delete by semantics
            me.delete = async function() {
                for (const referencePair of me.references) {
                    let referencedElement = referencePair[1];
                    if (!referencedElement) {
                        referencedElement = await me.manager.get(referencePair[0]);
                    }
                    const queue = [referencedElement.typeInfo];
                    const visited = new Set();
                    while (queue.length > 0) {
                        const front = queue.shift();
                        if (visited.has(front)) {
                            continue;
                        }
                        visited.add(front);
                        for (const setPair of front.sets) {
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
                        for (const base of front.base) {
                            queue.push(base);
                        }
                    }
                    try {
                        await me.manager.put(referencedElement);
                    } catch (exception) {
                        console.warn('could not put reference after deleting, exception\n:' + exception);
                    }
                }
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

            return function(applyingElement, manager) {
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
                    this.manager = manager;
                    createTypeInfoAndProperties(this);
                    this.typeInfo.setBase(applyingElement.typeInfo);

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
        return function(manager) {
            classConstructor(this, manager);
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
        const generatePackageData = async (pckg) => {
            for await (const packagedElement of pckg.packagedElements) {
                const generateElement = async () => {
                    const generatedElement = await generate(packagedElement, umlClient, generationData);
                    ret[packagedElement.name] = generatedElement;
                    return generatedElement;
                }
                if (packagedElement.is('Package')) {
                    try {
                    await generateElement();
                    } catch (exception) {
                        console.warn('hit exception while parsing element ' + exception);
                        continue;
                    }
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
        }
        await generatePackageData(element);

        // generate manager for package api
        ret[element.name + 'Manager'] = function(apiLocation) {
            this.id = randomID();
            this.graph = new Map();
            this.updateHandlers = [];
            this.apiLocation = apiLocation;
            const generatedManager = this;
            umlClient.updateHandlers.push(async function(newElement, oldElement) {
                if (newElement) {
                    if (newElement.id === generatedManager.apiLocation.id) {
                        generatedManager.apiLocation = newElement;
                    }
                    if (newElement.id === element.id) {
                        // TODO regenerate api / hotfix instances
                        // await generatePackageData(newElement);
                        // TODO eventually just don't know how to implement without being very expensive
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
                            umlClient.put(defaultValue);
                        }
                        umlClient.put(slot);
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
                const ret = new typeClassJS(generatedManager);
                ret.id = postOptions.id;
                this.graph.set(ret.id, ret);
                ret._apiPostPromise = createTypeInstance(ret.modelID, postOptions);
                return ret;
            };
            this.apply = async function(el, stereotype) {
                let stereotypeJS;
                if (typeof stereotype === 'string') {
                    stereotypeJS = generationData.stereotypes.get(stereotype);
                } else {
                    stereotypeJS = generationData.ids.get(stereotype.id);
                }
                if (!stereotypeJS) {
                    throw Error('Could not apply stereotype ' + stereotype + ' because manager could not find that type!');
                }
                const ret = new stereotypeJS(el, generatedManager);
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
            this.remove = async function(el, stereotypeInstance) {
                await el.appliedStereotypes.remove(stereotypeInstance);
                
                // TODO destroy instance based on classifier and property aggregation
                const destroyInstance = async (instance) => {
                    for await (const slot of instance.slots) {
                        const definingFeature = await slot.definingFeature.get();
                        if (definingFeature.aggregation === 'composite') {
                            // delete  value and value instance;
                            for await (const value of slot.values) {
                                if (value.is('InstanceValue')) {
                                    await destroyInstance(await value.instance.get());
                                }
                                await umlClient.delete(value);
                            }
                        } else {
                            for await (const value of slot.values) {
                                await umlClient.delete(value);
                            }
                        }
                    }
                }
                await destroyInstance(stereotypeInstance);
                umlClient.put(el);
            }
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
                                                await umlClient.delete(currValue);
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
                if (!umlEl) {
                    throw Error('Could not get uml element corresponding to meta element from server!');
                }
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

                const fillOutType = async (typeToFill, instanceSpecification) => {
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
                                    typeToFill[definingFeature.name] = (await slot.values.front()).value;
                                }
                                continue;
                            }
                        }
                        // TODO singletons and sets
                        const set = typeToFill.typeInfo.getSet(definingFeature.id);
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
                                await set.set(slotValue.instance.id());
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
                                const set = typeToFill.typeInfo.getSet(definingFeature.id);
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
                
                const oldElement = this.graph.get(id);

                if (instanceSpecification.appliedStereotypes.size() > 0) {
                    // we're making a stereotypedElement
                    const stereotypedElement = instanceSpecification;
                    var ret = stereotypedElement;
                    for await (const stereotypeInstance of stereotypedElement.appliedStereotypes) {
                        const stereotypeConstructor = getConstructorOfInstance(stereotypeInstance);
                        ret = new stereotypeConstructor(ret, generatedManager);
                        generatedManager.graph.set(ret.id, ret);
                        if (oldElement) {
                            restoreReferences(oldElement, ret);
                        }
                        await fillOutType(ret, stereotypeInstance);
                    }
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
                            if (oldElement) {
                                restoreReferences(oldElement, ret);
                            }
                            return ret;
                        }
                    }
                    const typeConstructor = getConstructorOfInstance(instanceSpecification);
                    const ret = new typeConstructor(generatedManager);
                    ret.id = id;
                    this.graph.set(id, ret);
                    await fillOutType(ret, instanceSpecification);
                    if (oldElement) {
                        restoreReferences(oldElement, ret);
                    }
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
                    await umlClient.delete(instanceSpecification);
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
        if (typeof multiplicity.lowerValue === 'string') {
            multiplicity.lowerValue = parseInt(multiplicity.lowerValue);
        }
        const upperValueElement = await property.upperValue.get();
        if (upperValueElement.is('LiteralInt') && upperValueElement.is('LiteralUnlimitedNatural')) {
            throw Error('Upper value for property ' + property.name + ' is an improper type, all property upper values must be either a Literal Integer or a Literal Unlimited Natural');
        }
        multiplicity.upperValue = upperValueElement.value;
        if (typeof multiplicity.upperValue === 'string' && multiplicity.upperValue !== '*') {
            multiplicity.upperValue = parseInt(multiplicity.upperValue);
        }
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
