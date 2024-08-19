import Abstraction from "./types/abstraction.js";
import Association from "./types/association.js";
import Class from "./types/class.js";
import Comment from "./types/comment.js";
import DataType from "./types/dataType.js";
import Dependency from "./types/dependency.js";
import Enumeration from "./types/enumeration.js";
import EnumerationLiteral from "./types/enumerationLiteral.js";
import Extension from "./types/extension.js";
import ExtensionEnd from "./types/extensionEnd.js";
import Generalization from "./types/generalization.js";
import InstanceSpecification from "./types/instanceSpecification.js";
import InstanceValue from "./types/instanceValue.js";
import Interface from "./types/interface.js";
import LiteralBool from "./types/literalBool.js";
import LiteralInt from "./types/literalInt.js";
import LiteralNull from "./types/literalNull.js";
import LiteralReal from "./types/literalReal.js";
import LiteralString from "./types/literalString.js";
import LiteralUnlimitedNatural from "./types/literalUnlimitedNatural.js";
import Package from "./types/package.js";
import PrimitiveType from "./types/primitiveType.js";
import Profile from "./types/profile.js";
import Property from "./types/property.js";
import Realization from "./types/realization.js";
import Signal from "./types/signal.js";
import Slot from "./types/slot.js";
import Stereotype from "./types/stereotype.js";
import Usage from "./types/usage.js";
import { internalSet } from './singleton';

export function parseType(data) {
if (data.Abstraction) {
        return new Abstraction();
    } else if (data.Association) {
        return new Association();
    } else if (data.Class) {
        return new Class();
    } else if (data.Comment) {
        return new Comment();
    } else if (data.DataType) {
        return new DataType();
    } else if (data.Dependency) {
        return new Dependency();
    } else if (data.Enumeration) {
        return new Enumeration();
    } else if (data.EnumerationLiteral) {
        return new EnumerationLiteral();
    } else if (data.Extension) {
        return new Extension();
    } else if (data.ExtensionEnd) {
        return new ExtensionEnd();
    } else if (data.Generalization) {
        return new Generalization();
    } else if (data.InstanceSpecification) {
        return new InstanceSpecification();
    } else if (data.InstanceValue) {
        return new InstanceValue();
    } else if (data.LiteralBool) {
        return new LiteralBool();
    } else if (data.LiteralInt) {
        return new LiteralInt();
    } else if (data.LiteralNull) {
        return new LiteralNull();
    } else if (data.LiteralReal) {
        return new LiteralReal();
    } else if (data.LiteralString) {
        return new LiteralString();
    } else if (data.LiteralUnlimitedNatural) {
        return new LiteralUnlimitedNatural();
    } else if (data.Package) {
        return new Package();
    } else if (data.PrimitiveType) {
        return new PrimitiveType();
    } else if (data.Profile) {
        return new Profile();
    } else if (data.Property) {
        return new Property();
    } else if (data.Realization) {
        return new Realization();
    } else if (data.Slot) {
        return new Slot();
    } else if (data.Stereotype) {
        return new Stereotype();
    } else if (data.Usage) {
        return new Usage();
    } else if (data.Interface) {
        return new Interface();
    } else if (data.Signal) {
        return new Signal();
    }
}

export default async function parse(data) {
    const ret = parseType(data);
    if (data.Abstraction) {
        await parseElement(data, 'Abstraction', ret);
        await parseDependency(data, 'Abstraction', ret);
        await parseNamedElement(data, 'Abstraction', ret);
        await parsePackageableElement(data, 'Abstraction', ret);
        return ret;
    } else if (data.Association) {
        await parseElement(data, 'Association', ret);
        await parseNamedElement(data, 'Association', ret);
        await parsePackageableElement(data, 'Association', ret);
        await parseClassifier(data, 'Association', ret);
        await parseAssociation(data, 'Association', ret);
        return ret;
    } else if (data.Class) {
        await parseElement(data, 'Class', ret);
        await parseNamedElement(data, 'Class', ret);
        await parsePackageableElement(data, 'Class', ret);
        await parseClassifier(data, 'Class', ret);
        await parseClass(data, 'Class', ret);
        return ret;
    } else if (data.Comment) {
        await parseElement(data, 'Comment', ret);
        await parseComment(data, 'Comment', ret);
        return ret;
    } else if (data.DataType) {
        await parseElement(data, 'DataType', ret);
        await parseNamedElement(data, 'DataType', ret);
        await parsePackageableElement(data, 'DataType', ret);
        await parseClassifier(data, 'DataType', ret);
        await parseDataType(data, 'DataType', ret);
        return ret;
    } else if (data.Dependency) {
        await parseElement(data, 'Dependency', ret);
        await parseDependency(data, 'Dependency', ret);
        await parseNamedElement(data, 'Dependency', ret);
        await parsePackageableElement(data, 'Dependency', ret);
        return ret; 
    } else if (data.Enumeration) {
        await parseElement(data, 'Enumeration', ret);
        await parseNamedElement(data, 'Enumeration', ret);
        await parsePackageableElement(data, 'Enumeration', ret);
        await parseClassifier(data, 'Enumeration', ret);
        await parseDataType(data, 'Enumeration', ret);
        await parseEnumeration(data, 'Enumeration', ret);
        return ret;
    } else if (data.EnumerationLiteral) {
        await parseElement(data, 'EnumerationLiteral', ret);
        await parseNamedElement(data, 'EnumerationLiteral', ret);
        await parsePackageableElement(data, 'EnumerationLiteral', ret);
        await parseInstanceSpecification(data, 'EnumerationLiteral', ret);
        await parseEnumerationLiteral(data, 'EnumerationLiteral', ret);
        return ret;
    } else if (data.Extension) {
        await parseElement(data, 'Extension', ret);
        await parseNamedElement(data, 'Extension', ret);
        await parsePackageableElement(data, 'Extension', ret);
        await parseClassifier(data, 'Extension', ret);
        await parseAssociation(data, 'Extension', ret);
        await parseExtension(data, 'Extension', ret);
        return ret;
    } else if (data.ExtensionEnd) {
        await parseElement(data, 'ExtensionEnd', ret);
        await parseNamedElement(data, 'ExtensionEnd', ret);
        await parseTypedElement(data, 'ExtensionEnd', ret);
        await parseMultiplicityElement(data, 'ExtensionEnd', ret);
        await parseProperty(data, 'ExtensionEnd', ret);
        return ret;
    } else if (data.Generalization) {
        await parseElement(data, 'Generalization', ret);
        await parseGeneralization(data, 'Generalization', ret);
        return ret;
    } else if (data.InstanceSpecification) {
        await parseElement(data, 'InstanceSpecification', ret);
        await parseNamedElement(data, 'InstanceSpecification', ret);
        await parsePackageableElement(data, 'InstanceSpecification', ret);
        await parseInstanceSpecification(data, 'InstanceSpecification', ret);
        return ret;
    } else if (data.InstanceValue) {
        await parseElement(data, 'InstanceValue', ret);
        await parseNamedElement(data, 'InstanceValue', ret);
        await parsePackageableElement(data, 'InstanceValue', ret);
        await parseInstanceValue(data, 'InstanceValue', ret);
        return ret;
    } else if (data.LiteralBool) {
        await parseElement(data, 'LiteralBool', ret);
        await parseNamedElement(data, 'LiteralBool', ret);
        await parseTypedElement(data, 'LiteralBool', ret);
        await parsePackageableElement(data, 'LiteralBool', ret);
        parseLiteralValue(data, 'LiteralBool', ret);
        return ret;
    } else if (data.LiteralInt) {
        await parseElement(data, 'LiteralInt', ret);
        await parseNamedElement(data, 'LiteralInt', ret);
        await parseTypedElement(data, 'LiteralInt', ret);
        await parsePackageableElement(data, 'LiteralInt', ret);
        parseLiteralValue(data, 'LiteralInt', ret);
        return ret;
    } else if (data.LiteralNull) {
        await parseElement(data, 'LiteralNull', ret);
        await parseNamedElement(data, 'LiteralNull', ret);
        await parseTypedElement(data, 'LiteralNull', ret);
        await parsePackageableElement(data, 'LiteralNull', ret);
        return ret; 
    } else if (data.LiteralReal) {
        await parseElement(data, 'LiteralReal', ret);
        await parseNamedElement(data, 'LiteralReal', ret);
        await parseTypedElement(data, 'LiteralReal', ret);
        await parsePackageableElement(data, 'LiteralReal', ret);
        parseLiteralValue(data, 'LiteralReal', ret);
        return ret;
    } else if (data.LiteralString) {
        await parseElement(data, 'LiteralString', ret);
        await parseNamedElement(data, 'LiteralString', ret);
        await parseTypedElement(data, 'LiteralString', ret);
        await parsePackageableElement(data, 'LiteralString', ret);
        parseLiteralValue(data, 'LiteralString', ret);
        return ret;
    } else if (data.LiteralUnlimitedNatural) {
        await parseElement(data, 'LiteralUnlimitedNatural', ret);
        await parseNamedElement(data, 'LiteralUnlimitedNatural', ret);
        await parseTypedElement(data, 'LiteralUnlimitedNatural', ret);
        await parsePackageableElement(data, 'LiteralUnlimitedNatural', ret);
        parseLiteralValue(data, 'LiteralUnlimitedNatural', ret);
        return ret;
    } else if (data.Package) {
        await parseElement(data, 'Package', ret);
        await parseNamedElement(data, 'Package', ret);
        await parsePackageableElement(data, 'Package', ret);
        await parsePackage(data, 'Package', ret);
        return ret;
    } else if (data.PrimitiveType) {
        await parseElement(data, 'PrimitiveType', ret);
        await parseNamedElement(data, 'PrimitiveType', ret);
        await parsePackageableElement(data, 'PrimitiveType', ret);
        await parseClassifier(data, 'PrimitiveType', ret);
        await parseDataType(data, 'PrimitiveType', ret);
        return ret;
    } else if (data.Profile) {
        await parseElement(data, 'Profile', ret);
        await parseNamedElement(data, 'Profile', ret);
        await parsePackageableElement(data, 'Profile', ret);
        await parsePackage(data, 'Profile', ret);
        return ret;
    } else if (data.Property) {
        await parseElement(data, 'Property', ret);
        await parseNamedElement(data, 'Property', ret);
        await parseTypedElement(data, 'Property', ret);
        await parseMultiplicityElement(data, 'Property', ret);
        await parseStructuralFeature(data, 'Property', ret);
        await parseFeature(data, 'Property', ret);
        await parseProperty(data, 'Property', ret);
        return ret;
    } else if (data.Realization) {
        await parseElement(data, 'Realization', ret);
        await parseDependency(data, 'Realization', ret);
        await parseNamedElement(data, 'Realization', ret);
        await parsePackageableElement(data, 'Realization', ret);
        return ret;
    } else if (data.Slot) {
        await parseElement(data, 'Slot', ret);
        await parseSlot(data, 'Slot', ret);
        return ret;
    } else if (data.Stereotype) {
        await parseElement(data, 'Stereotype', ret);
        await parseNamedElement(data, 'Stereotype', ret);
        await parsePackageableElement(data, 'Stereotype', ret);
        await parseClassifier(data, 'Stereotype', ret);
        await parseClass(data, 'Stereotype', ret);
        await parseStereotype(data, 'Stereotype', ret);
        return ret;
    } else if (data.Usage) {
        await parseElement(data, 'Usage', ret);
        await parseDependency(data, 'Usage', ret);
        await parseNamedElement(data, 'Usage', ret);
        await parsePackageableElement(data, 'Usage', ret);
        return ret;
    } else if (data.Interface) {
        await parseElement(data, 'Interface', ret);
        await parseNamedElement(data, 'Interface', ret);
        await parsePackageableElement(data, 'Interface', ret);
        await parseClassifier(data, 'Interface', ret);
        await parseInterface(data, 'Interface', ret);
        return ret;
    } else if (data.Signal) {
        await parseElement(data, 'Signal', ret);
        await parseNamedElement(data, 'Signal', ret);
        await parsePackageableElement(data, 'Signal', ret);
        await parseClassifier(data, 'Signal', ret);
        await parseSignal(data, 'Signal', ret);
        return ret;
    }
}

async function parseSet(data, alias, set, setName) {
    if (data[alias][setName]) {
        for (let id of data[alias][setName]) {
            await set.add(id);
        }
    }
}

async function parseSingleton(data, alias, singleton, singletonName) {
    if (data[alias][singletonName]) {
        await singleton.set(data[alias][singletonName]);
    }
}

async function parseOwner(data, singleton, singletonName) {
    if (data[singletonName]) {
        await singleton.set(data[singletonName]);
    }
}

async function parseAssociation(data, alias, association) {
    if (data[alias].memberEnds) {
        for (let id of data[alias].memberEnds) {
            await association.memberEnds.add(id);
        }
    }
    if (data[alias].ownedEnds) {
        for (let id of data[alias].ownedEnds) {
            await association.ownedEnds.add(id);
        }
    }
    if (data[alias].navigableOwnedEnds) {
        for (let id of data[alias].navigableOwnedEnds) {
            await association.navigableOwnedEnds.add(id);
        }
    }
}

async function parseClass(data, alias, clazz) {
    if (data[alias].ownedAttributes) {
        for (let id of data[alias].ownedAttributes) {
            await clazz.ownedAttributes.add(id);
        }
    }
}

async function parseClassifier(data, alias, classifier) {
    if (data[alias].generalizations) {
        for (let id of data[alias].generalizations) {
            await classifier.generalizations.add(id);
        }
    }
}

async function parseComment(data, alias, comment) {
    await parseSet(data, alias, comment.annotatedElements, 'annotatedElements');
    if (data[alias].body) {
        comment.body = data[alias].body;
    }
}

async function parseDataType(data, alias, dataType) {
    if (data[alias].ownedAttributes) {
        for (let id of data[alias].ownedAttributes) {
            await dataType.ownedAttributes.add(id);
        }
    }
    if (data[alias].ownedOperations) {
        for (let id of data[alias].ownedOperations) {
            await dataType.ownedOperations.add(id);
        }
    }
}

async function parseDependency(data, alias, dependency) {
    await parseSet(data, alias, dependency.clients, 'clients');
    await parseSet(data, alias, dependency.suppliers, 'suppliers');
}

async function parseElement(data, alias, el) {
    if (data[alias].id) {
        el.id = data[alias].id;
    } else {
        throw Error("data must have id!");
    }
    if (data.owner) {
        await el.owner.add(data.owner);
    }
    await parseSet(data, alias, el.appliedStereotypes, 'appliedStereotypes');
    await parseSet(data, alias, el.ownedComments, 'ownedComments');
}

async function parseEnumeration(data, alias, enumeration) {
    if (data[alias].ownedLiterals) {
        for (const id of data[alias].ownedLiterals) {
            await enumeration.ownedLiterals.add(id);
        }
    }
}

async function parseEnumerationLiteral(data, alias, enumerationLiteral) {
    if (data.enumeration) {
        await enumerationLiteral.enumeration.set(data.enumeration);
    }
}

async function parseExtension(data, alias, extension) {
    if (data[alias].ownedEnd) {
        await extension.ownedEnd.set(data[alias].ownedEnd);
    }
}

async function parseGeneralization(data, alias, generalization) {
    if (data.specific) {
        await generalization.specific.set(data.specific);
    }
    if (data[alias].general) {
        await generalization.general.set(data[alias].general);
    }
}

async function parseInstanceSpecification(data, alias, instanceSpecification) {
    await parseSet(data, alias, instanceSpecification.classifiers, 'classifiers');
    await parseSet(data, alias, instanceSpecification.slots, 'slots');
    await parseSingleton(data, alias, instanceSpecification.specification, 'specification');
}

async function parseInstanceValue(data, alias, instanceValue) {
    await parseSingleton(data, alias, instanceValue.instance, 'instance');
}

function parseLiteralValue(data, alias, el) {
    const value = data[alias].value;
    if (value !== undefined && value !== null) {
        el.value = value;
    }
}

async function parseMultiplicityElement(data, alias, multiplicityElement) {
    if (data[alias].isOrdered) {
        multiplicityElement.isOrdered = true;
    }
    if (data[alias].isUnique === false) {
        multiplicityElement.isUnique = false;
    }
    if (data[alias].lowerValue) {
        await multiplicityElement.lowerValue.set(data[alias].lowerValue);
    }
    if (data[alias].upperValue) {
        await multiplicityElement.upperValue.set(data[alias].upperValue);
    }
}

async function parseNamedElement(data, alias, el) {
    if (data[alias].name) {
        el.name = data[alias].name;
    }
    await parseSet(data, alias, el.clientDependencies, 'clientDependencies');
}

async function parsePackage(data, alias, pckg) {
    if (data[alias].packagedElements) {
        for (let id of data[alias].packagedElements) {
            await pckg.packagedElements.add(id);
        }
    }
    if (data[alias].ownedStereotypes) {
        for (let id of data[alias].ownedStereotypes) {
            await pckg.ownedStereotypes.add(id);
        }
    }
}

async function parsePackageableElement(data, alias, packageableElement) {
    if (data.owningPackage) {
        await packageableElement.owningPackage.set(data.owningPackage);
    }
}

async function parseProperty(data, alias, property) {
    await parseOwner(data, property.clazz, 'class');
    await parseOwner(data, property.dataType, 'dataType');
    await parseOwner(data, property.owningAssociation, 'owningAssociation');

    if (data[alias].aggregation) {
        property.aggregation = data[alias].aggregation;
    }
    await parseSingleton(data, alias, property.association, 'association');
    await parseSingleton(data, alias, property.defaultValue, 'defaultValue');
    await parseSet(data, alias, property.subsettedProperties, 'subsettedProperties');
    await parseSet(data, alias, property.redefinedProperties, 'redefinedProperties');
}

async function parseSlot(data, alias, slot) {
    await parseSet(data, alias, slot.values, 'values');
    await parseSingleton(data, alias, slot.definingFeature, 'definingFeature');
    await parseOwner(data, slot.owningInstance, 'owningInstance');
}

async function parseTypedElement(data, alias, typedElement) {
    if (data[alias].type) {
        await typedElement.type.set(data[alias].type);
    }
}

async function parseInterface(data, alias, interfaceEl) {
    if (data[alias].ownedAttributes) {
        for (let id of data[alias].ownedAttributes) {
            await interfaceEl.ownedAttributes.add(id);
        }
    }
    if (data[alias].ownedOperations) {
        for (let id of data[alias].ownedOperations) {
            await interfaceEl.ownedOperations.add(id);
        }
    }
}

async function parseSignal(data, alias, signal) {
    if (data[alias].ownedAttributes) {
        for (let id of data[alias].ownedAttributes) {
            await signal.ownedAttributes.add(id);
        }
    }
}

async function parseStereotype(data, alias, stereotype) {
    if (data[alias].profile) {
        await internalSet(data[alias].profile, stereotype.profile);
    }
}

function parseStructuralFeature(data, alias, structuralFeature) {
    if (data[alias].isReadOnly) {
        structuralFeature.isReadOnly = data[alias].isReadOnly;
    }
}

function parseFeature(data, alias, feature) {
    if (data[alias].isStatic) {
        feature.isStatic = data[alias].isStatic;
    }
}
