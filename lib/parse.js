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
if (data.abstraction) {
        return new Abstraction();
    } else if (data.association && !data.property) {
        return new Association();
    } else if (data.class && !data.property) {
        return new Class();
    } else if (data.comment) {
        return new Comment();
    } else if (data.dataType && ! data.property) {
        return new DataType();
    } else if (data.dependency) {
        return new Dependency();
    } else if (data.enumeration && !data.enumerationLiteral) {
        return new Enumeration();
    } else if (data.enumerationLiteral) {
        return new EnumerationLiteral();
    } else if (data.extension) {
        return new Extension();
    } else if (data.extensionEnd) {
        return new ExtensionEnd();
    } else if (data.generalization) {
        return new Generalization();
    } else if (data.instanceSpecification) {
        return new InstanceSpecification();
    } else if (data.instanceValue) {
        return new InstanceValue();
    } else if (data.literalBool) {
        return new LiteralBool();
    } else if (data.literalInt) {
        return new LiteralInt();
    } else if (data.literalNull) {
        return new LiteralNull();
    } else if (data.literalReal) {
        return new LiteralReal();
    } else if (data.literalString) {
        return new LiteralString();
    } else if (data.literalUnlimitedNatural) {
        return new LiteralUnlimitedNatural();
    } else if (data.package) {
        return new Package();
    } else if (data.primitiveType) {
        return new PrimitiveType();
    } else if (data.profile) {
        return new Profile();
    } else if (data.property) {
        return new Property();
    } else if (data.realization) {
        return new Realization();
    } else if (data.slot) {
        return new Slot();
    } else if (data.stereotype) {
        return new Stereotype();
    } else if (data.usage) {
        return new Usage();
    } else if (data.interface) {
        return new Interface();
    } else if (data.signal) {
        return new Signal();
    }
}

export default async function parse(data) {
    const ret = parseType(data);
    if (data.abstraction) {
        await parseElement(data, 'abstraction', ret);
        await parseDependency(data, 'abstraction', ret);
        await parseNamedElement(data, 'abstraction', ret);
        await parsePackageableElement(data, 'abstraction', ret);
        return ret;
    } else if (data.association && !data.property) {
        await parseElement(data, 'association', ret);
        await parseNamedElement(data, 'association', ret);
        await parsePackageableElement(data, 'association', ret);
        await parseClassifier(data, 'association', ret);
        await parseAssociation(data, 'association', ret);
        return ret;
    } else if (data.class && !data.property) {
        await parseElement(data, 'class', ret);
        await parseNamedElement(data, 'class', ret);
        await parsePackageableElement(data, 'class', ret);
        await parseClassifier(data, 'class', ret);
        await parseClass(data, 'class', ret);
        return ret;
    } else if (data.comment) {
        await parseElement(data, 'comment', ret);
        await parseComment(data, 'comment', ret);
        return ret;
    } else if (data.dataType && ! data.property) {
        await parseElement(data, 'dataType', ret);
        await parseNamedElement(data, 'dataType', ret);
        await parsePackageableElement(data, 'dataType', ret);
        await parseClassifier(data, 'dataType', ret);
        await parseDataType(data, 'dataType', ret);
        return ret;
    } else if (data.dependency) {
        await parseElement(data, 'dependency', ret);
        await parseDependency(data, 'dependency', ret);
        await parseNamedElement(data, 'dependency', ret);
        await parsePackageableElement(data, 'dependency', ret);
        return ret; 
    } else if (data.enumeration && !data.enumerationLiteral) {
        await parseElement(data, 'enumeration', ret);
        await parseNamedElement(data, 'enumeration', ret);
        await parsePackageableElement(data, 'enumeration', ret);
        await parseClassifier(data, 'enumeration', ret);
        await parseDataType(data, 'enumeration', ret);
        await parseEnumeration(data, 'enumeration', ret);
        return ret;
    } else if (data.enumerationLiteral) {
        await parseElement(data, 'enumerationLiteral', ret);
        await parseNamedElement(data, 'enumerationLiteral', ret);
        await parsePackageableElement(data, 'enumerationLiteral', ret);
        await parseInstanceSpecification(data, 'enumerationLiteral', ret);
        await parseEnumerationLiteral(data, 'enumerationLiteral', ret);
        return ret;
    } else if (data.extension) {
        await parseElement(data, 'extension', ret);
        await parseNamedElement(data, 'extension', ret);
        await parsePackageableElement(data, 'extension', ret);
        await parseClassifier(data, 'extension', ret);
        await parseExtension(data, 'extension', ret);
        return ret;
    } else if (data.extensionEnd) {
        await parseElement(data, 'extensionEnd', ret);
        await parseNamedElement(data, 'extensionEnd', ret);
        await parseTypedElement(data, 'extensionEnd', ret);
        await parseMultiplicityElement(data, 'extensionEnd', ret);
        await parseProperty(data, 'extensionEnd', ret);
        return ret;
    } else if (data.generalization) {
        await parseElement(data, 'generalization', ret);
        await parseGeneralization(data, 'generalization', ret);
        return ret;
    } else if (data.instanceSpecification) {
        await parseElement(data, 'instanceSpecification', ret);
        await parseNamedElement(data, 'instanceSpecification', ret);
        await parsePackageableElement(data, 'instanceSpecification', ret);
        await parseInstanceSpecification(data, 'instanceSpecification', ret);
        return ret;
    } else if (data.instanceValue) {
        await parseElement(data, 'instanceValue', ret);
        await parseNamedElement(data, 'instanceValue', ret);
        await parsePackageableElement(data, 'instanceValue', ret);
        await parseInstanceValue(data, 'instanceValue', ret);
        return ret;
    } else if (data.literalBool) {
        await parseElement(data, 'literalBool', ret);
        await parseNamedElement(data, 'literalBool', ret);
        await parseTypedElement(data, 'literalBool', ret);
        await parsePackageableElement(data, 'literalBool', ret);
        parseLiteralValue(data, 'literalBool', ret);
        return ret;
    } else if (data.literalInt) {
        await parseElement(data, 'literalInt', ret);
        await parseNamedElement(data, 'literalInt', ret);
        await parseTypedElement(data, 'literalInt', ret);
        await parsePackageableElement(data, 'literalInt', ret);
        parseLiteralValue(data, 'literalInt', ret);
        return ret;
    } else if (data.literalNull) {
        await parseElement(data, 'literalNull', ret);
        await parseNamedElement(data, 'literalNull', ret);
        await parseTypedElement(data, 'literalNull', ret);
        await parsePackageableElement(data, 'literalNull', ret);
        return ret; 
    } else if (data.literalReal) {
        await parseElement(data, 'literalReal', ret);
        await parseNamedElement(data, 'literalReal', ret);
        await parseTypedElement(data, 'literalReal', ret);
        await parsePackageableElement(data, 'literalReal', ret);
        parseLiteralValue(data, 'literalReal', ret);
        return ret;
    } else if (data.literalString) {
        await parseElement(data, 'literalString', ret);
        await parseNamedElement(data, 'literalString', ret);
        await parseTypedElement(data, 'literalString', ret);
        await parsePackageableElement(data, 'literalString', ret);
        parseLiteralValue(data, 'literalString', ret);
        return ret;
    } else if (data.literalUnlimitedNatural) {
        parseElement(data, 'literalUnlimitedNatural', ret);
        parseNamedElement(data, 'literalUnlimitedNatural', ret);
        parseTypedElement(data, 'literalUnlimitedNatural', ret);
        parsePackageableElement(data, 'literalUnlimitedNatural', ret);
        await parseLiteralValue(data, 'literalUnlimitedNatural', ret);
        return ret;
    } else if (data.package) {
        await parseElement(data, 'package', ret);
        await parseNamedElement(data, 'package', ret);
        await parsePackageableElement(data, 'package', ret);
        await parsePackage(data, 'package', ret);
        return ret;
    } else if (data.primitiveType) {
        await parseElement(data, 'primitiveType', ret);
        await parseNamedElement(data, 'primitiveType', ret);
        await parsePackageableElement(data, 'primitiveType', ret);
        await parseClassifier(data, 'primitiveType', ret);
        await parseDataType(data, 'primitiveType', ret);
        return ret;
    } else if (data.profile) {
        await parseElement(data, 'profile', ret);
        await parseNamedElement(data, 'profile', ret);
        await parsePackageableElement(data, 'profile', ret);
        await parsePackage(data, 'profile', ret);
        return ret;
    } else if (data.property) {
        await parseElement(data, 'property', ret);
        await parseNamedElement(data, 'property', ret);
        await parseTypedElement(data, 'property', ret);
        await parseMultiplicityElement(data, 'property', ret);
        await parseStructuralFeature(data, 'property', ret);
        await parseFeature(data, 'property', ret);
        await parseProperty(data, 'property', ret);
        return ret;
    } else if (data.realization) {
        await parseElement(data, 'realization', ret);
        await parseDependency(data, 'realization', ret);
        await parseNamedElement(data, 'realization', ret);
        await parsePackageableElement(data, 'realization', ret);
        return ret;
    } else if (data.slot) {
        await parseElement(data, 'slot', ret);
        await parseSlot(data, 'slot', ret);
        return ret;
    } else if (data.stereotype) {
        await parseElement(data, 'stereotype', ret);
        await parseNamedElement(data, 'stereotype', ret);
        await parsePackageableElement(data, 'stereotype', ret);
        await parseClassifier(data, 'stereotype', ret);
        await parseClass(data, 'stereotype', ret);
        await parseStereotype(data, 'stereotype', ret);
        return ret;
    } else if (data.usage) {
        await parseElement(data, 'usage', ret);
        await parseDependency(data, 'usage', ret);
        await parseNamedElement(data, 'usage', ret);
        await parsePackageableElement(data, 'usage', ret);
        return ret;
    } else if (data.interface) {
        await parseElement(data, 'interface', ret);
        await parseNamedElement(data, 'interface', ret);
        await parsePackageableElement(data, 'interface', ret);
        await parseClassifier(data, 'interface', ret);
        await parseInterface(data, 'interface', ret);
        return ret;
    } else if (data.signal) {
        await parseElement(data, 'signal', ret);
        await parseNamedElement(data, 'signal', ret);
        await parsePackageableElement(data, 'signal', ret);
        await parseClassifier(data, 'signal', ret);
        await parseSignal(data, 'signal', ret);
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
    if (data[alias].metaClass) {
        extension.metaClass = data[alias].metaClass;
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
