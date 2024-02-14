import Abstraction from "./abstraction.js";
import Association from "./association.js";
import Class from "./class.js";
import Comment from "./comment.js";
import DataType from "./dataType.js";
import Dependency from "./dependency.js";
import Enumeration from "./enumeration.js";
import EnumerationLiteral from "./enumerationLiteral.js";
import Extension from "./extension.js";
import ExtensionEnd from "./extensionEnd.js";
import Generalization from "./generalization.js";
import InstanceSpecification from "./instanceSpecification.js";
import InstanceValue from "./instanceValue.js";
import LiteralBool from "./literalBool.js";
import LiteralInt from "./literalInt.js";
import LiteralNull from "./literalNull.js";
import LiteralReal from "./literalReal.js";
import LiteralString from "./literalString.js";
import LiteralUnlimitedNatural from "./literalUnlimitedNatural.js";
import Package from "./package.js";
import PrimitiveType from "./primitiveType.js";
import Profile from "./profile.js";
import Property from "./property.js";
import Realization from "./realization.js";
import Slot from "./slot.js";
import Stereotype from "./stereotype.js";
import Usage from "./usage.js";

export default function parse(data) {
    if (data.abstraction) {
        const ret = new Abstraction();
        parseElement(data, 'abstraction', ret);
        parseDependency(data, 'abstraction', ret);
        parseNamedElement(data, 'abstraction', ret);
        parsePackageableElement(data, 'abstraction', ret);
        return ret;
    } else if (data.association && !data.property) {
        const ret = new Association();
        parseElement(data, 'association', ret);
        parseNamedElement(data, 'association', ret);
        parsePackageableElement(data, 'association', ret);
        parseClassifier(data, 'association', ret);
        parseAssociation(data, 'association', ret);
        return ret;
    } else if (data.class && !data.property) {
        const ret = new Class();
        parseElement(data, 'class', ret);
        parseNamedElement(data, 'class', ret);
        parsePackageableElement(data, 'class', ret);
        parseClassifier(data, 'class', ret);
        parseClass(data, 'class', ret);
        return ret;
    } else if (data.comment) {
        const ret = new Comment();
        parseElement(data, 'comment', ret);
        parseComment(data, 'comment', ret);
        return ret;
    } else if (data.dataType && ! data.property) {
        const ret = new DataType();
        parseElement(data, 'dataType', ret);
        parseNamedElement(data, 'dataType', ret);
        parsePackageableElement(data, 'dataType', ret);
        parseClassifier(data, 'dataType', ret);
        parseDataType(data, 'dataType', ret);
        return ret;
    } else if (data.dependency) {
        const ret = new Dependency();
        parseElement(data, 'dependency', ret);
        parseDependency(data, 'dependency', ret);
        parseNamedElement(data, 'dependency', ret);
        parsePackageableElement(data, 'dependency', ret);
        return ret; 
    } else if (data.enumeration && !data.enumerationLiteral) {
        const ret = new Enumeration();
        parseElement(data, 'enumeration', ret);
        parseNamedElement(data, 'enumeration', ret);
        parsePackageableElement(data, 'enumeration', ret);
        parseClassifier(data, 'enumeration', ret);
        parseDataType(data, 'enumeration', ret);
        parseEnumeration(data, 'enumeration', ret);
        return ret;
    } else if (data.enumerationLiteral) {
        const ret = new EnumerationLiteral();
        parseElement(data, 'enumerationLiteral', ret);
        parseNamedElement(data, 'enumerationLiteral', ret);
        parsePackageableElement(data, 'enumerationLiteral', ret);
        parseInstanceSpecification(data, 'enumerationLiteral', ret);
        parseEnumerationLiteral(data, 'enumerationLiteral', ret);
        return ret;
 
    } else if (data.extension) {
        const ret = new Extension();
        parseElement(data, 'extension', ret);
        parseNamedElement(data, 'extension', ret);
        parsePackageableElement(data, 'extension', ret);
        parseClassifier(data, 'extension', ret);
        parseExtension(data, 'extension', ret);
        return ret;
    } else if (data.extensionEnd) {
        const ret = new ExtensionEnd();
        parseElement(data, 'extensionEnd', ret);
        parseNamedElement(data, 'extensionEnd', ret);
        parseTypedElement(data, 'extensionEnd', ret);
        parseMultiplicityElement(data, 'extensionEnd', ret);
        parseProperty(data, 'extensionEnd', ret);
        return ret;
    } else if (data.generalization) {
        const ret = new Generalization();
        parseElement(data, 'generalization', ret);
        parseGeneralization(data, 'generalization', ret);
        return ret;
    } else if (data.instanceSpecification) {
        const ret = new InstanceSpecification();
        parseElement(data, 'instanceSpecification', ret);
        parseNamedElement(data, 'instanceSpecification', ret);
        parsePackageableElement(data, 'instanceSpecification', ret);
        parseInstanceSpecification(data, 'instanceSpecification', ret);
        return ret;
    } else if (data.instanceValue) {
        const ret = new InstanceValue();
        parseElement(data, 'instanceValue', ret);
        parseNamedElement(data, 'instanceValue', ret);
        parsePackageableElement(data, 'instanceValue', ret);
        parseInstanceValue(data, 'instanceValue', ret);
        return ret;
    } else if (data.literalBool) {
        const ret = new LiteralBool();
        parseElement(data, 'literalBool', ret);
        parseNamedElement(data, 'literalBool', ret);
        parseTypedElement(data, 'literalBool', ret);
        parsePackageableElement(data, 'literalBool', ret);
        parseLiteralBool(data, 'literalBool', ret);
        return ret;
    } else if (data.literalInt) {
        const ret = new LiteralInt();
        parseElement(data, 'literalInt', ret);
        parseNamedElement(data, 'literalInt', ret);
        parseTypedElement(data, 'literalInt', ret);
        parsePackageableElement(data, 'literalInt', ret);
        parseLiteralInt(data, 'literalInt', ret);
        return ret;
    } else if (data.literalNull) {
        const ret = new LiteralNull();
        parseElement(data, 'literalNull', ret);
        parseNamedElement(data, 'literalNull', ret);
        parseTypedElement(data, 'literalNull', ret);
        parsePackageableElement(data, 'literalNull', ret);
        return ret; 
    } else if (data.literalReal) {
        const ret = new LiteralReal();
        parseElement(data, 'literalReal', ret);
        parseNamedElement(data, 'literalReal', ret);
        parseTypedElement(data, 'literalReal', ret);
        parsePackageableElement(data, 'literalReal', ret);
        parseLiteralReal(data, 'literalReal', ret);
        return ret;
    } else if (data.literalString) {
        const ret = new LiteralString();
        parseElement(data, 'literalString', ret);
        parseNamedElement(data, 'literalString', ret);
        parseTypedElement(data, 'literalString', ret);
        parsePackageableElement(data, 'literalString', ret);
        parseLiteralString(data, 'literalString', ret);
        return ret;
    } else if (data.literalUnlimitedNatural) {
        const ret = new LiteralUnlimitedNatural();
        parseElement(data, 'literalUnlimitedNatural', ret);
        parseNamedElement(data, 'literalUnlimitedNatural', ret);
        parseTypedElement(data, 'literalUnlimitedNatural', ret);
        parsePackageableElement(data, 'literalUnlimitedNatural', ret);
        parseLiteralUnlimitedNatural(data, 'literalUnlimitedNatural', ret);
        return ret;
    } else if (data.package) {
        const ret = new Package();
        parseElement(data, 'package', ret);
        parseNamedElement(data, 'package', ret);
        parsePackageableElement(data, 'package', ret);
        parsePackage(data, 'package', ret);
        return ret;
    } else if (data.primitiveType) {
        const ret = new PrimitiveType();
        parseElement(data, 'primitiveType', ret);
        parseNamedElement(data, 'primitiveType', ret);
        parsePackageableElement(data, 'primitiveType', ret);
        parseClassifier(data, 'primitiveType', ret);
        parseDataType(data, 'primitiveType', ret);
        return ret;
    } else if (data.profile) {
        const ret = new Profile();
        parseElement(data, 'profile', ret);
        parseNamedElement(data, 'profile', ret);
        parsePackageableElement(data, 'profile', ret);
        parsePackage(data, 'profile', ret);
        return ret;
    } else if (data.property) {
        const ret = new Property();
        parseElement(data, 'property', ret);
        parseNamedElement(data, 'property', ret);
        parseTypedElement(data, 'property', ret);
        parseMultiplicityElement(data, 'property', ret);
        parseProperty(data, 'property', ret);
        return ret;
    } else if (data.realization) {
        const ret = new Realization();
        parseElement(data, 'realization', ret);
        parseDependency(data, 'realization', ret);
        parseNamedElement(data, 'realization', ret);
        parsePackageableElement(data, 'realization', ret);
        return ret;
    } else if (data.slot) {
        const ret = new Slot();
        parseElement(data, 'slot', ret);
        parseSlot(data, 'slot', ret);
        return ret;
    } else if (data.stereotype) {
        const ret = new Stereotype();
        parseElement(data, 'stereotype', ret);
        parseNamedElement(data, 'stereotype', ret);
        parsePackageableElement(data, 'stereotype', ret);
        parseClassifier(data, 'stereotype', ret);
        parseClass(data, 'stereotype', ret);
        return ret;
    } else if (data.usage) {
        const ret = new Usage();
        parseElement(data, 'usage', ret);
        parseDependency(data, 'usage', ret);
        parseNamedElement(data, 'usage', ret);
        parsePackageableElement(data, 'usage', ret);
        return ret;
    }
}

function parseSet(data, alias, set, setName) {
    if (data[alias][setName]) {
        for (let id of data[alias][setName]) {
            set.add(id);
        }
    }
}

function parseSingleton(data, alias, singleton, singletonName) {
    if (data[alias][singletonName]) {
        singleton.set(data[alias][singletonName]);
    }
}

function parseOwner(data, singleton, singletonName) {
    if (data[singletonName]) {
        singleton.set(data[singletonName]);
    }
}

function parseAssociation(data, alias, association) {
    if (data[alias].memberEnds) {
        for (let id of data[alias].memberEnds) {
            association.memberEnds.add(id);
        }
    }
    if (data[alias].ownedEnds) {
        for (let id of data[alias].ownedEnds) {
            association.ownedEnds.add(id);
        }
    }
    if (data[alias].navigableOwnedEnds) {
        for (let id of data[alias].navigableOwnedEnds) {
            association.navigableOwnedEnds.add(id);
        }
    }
}

function parseClass(data, alias, clazz) {
    if (data[alias].ownedAttributes) {
        for (let id of data[alias].ownedAttributes) {
            clazz.ownedAttributes.add(id);
        }
    }
}

function parseClassifier(data, alias, classifier) {
    if (data[alias].generalizations) {
        for (let id of data[alias].generalizations) {
            classifier.generalizations.add(id);
        }
    }
}

function parseComment(data, alias, comment) {
    parseSet(data, alias, comment.annotatedElements, 'annotatedElements');
    if (data[alias].body) {
        comment.body = data[alias].body;
    }
}

function parseDataType(data, alias, dataType) {
    if (data[alias].ownedAttributes) {
        for (let id of data[alias].ownedAttributes) {
            dataType.ownedAttributes.add(id);
        }
    }
}

function parseDependency(data, alias, dependency) {
    parseSet(data, alias, dependency.clients, 'clients');
    parseSet(data, alias, dependency.suppliers, 'suppliers');
}

function parseElement(data, alias, el) {
    if (data[alias].id) {
        el.id = data[alias].id;
    } else {
        throw Error("data must have id!");
    }
    if (data.owner) {
        el.owner.add(data.owner);
    }
    parseSet(data, alias, el.appliedStereotypes, 'appliedStereotypes');
    parseSet(data, alias, el.ownedComments, 'ownedComments');
}

function parseEnumeration(data, alias, enumeration) {
    if (data[alias].ownedLiterals) {
        for (const id of data[alias].ownedLiterals) {
            enumeration.ownedLiterals.add(id);
        }
    }
}

function parseEnumerationLiteral(data, alias, enumerationLiteral) {
    if (data.enumeration) {
        enumerationLiteral.enumeration.set(data.enumeration);
    }
}

function parseExtension(data, alias, extension) {
    if (data[alias].ownedEnd) {
        extension.ownedEnd.set(data[alias].ownedEnd);
    }
    if (data[alias].metaClass) {
        extension.metaClass = data[alias].metaClass;
    }
}

function parseGeneralization(data, alias, generalization) {
    if (data.specific) {
        generalization.specific.set(data.specific);
    }
    if (data[alias].general) {
        generalization.general.set(data[alias].general);
    }
}

function parseInstanceSpecification(data, alias, instanceSpecification) {
    parseSet(data, alias, instanceSpecification.classifiers, 'classifiers');
    parseSet(data, alias, instanceSpecification.slots, 'slots');
    parseSingleton(data, alias, instanceSpecification.specification, 'specification');
}

function parseInstanceValue(data, alias, instanceValue) {
    parseSingleton(data, alias, instanceValue.instance, 'instance');
}

function parseLiteralBool(data, alias, literalBool) {
    if (data[alias].value) {
        literalBool.value = data[alias].value;
    }
}

function parseLiteralInt(data, alias, literalInt) {
    if (data[alias].value) {
        literalInt.value = data[alias].value;
    }
}

function parseLiteralString(data, alias, literalString) {
    if (data[alias].value) {
        literalString.value = data[alias].value;
    }
}

function parseLiteralReal(data, alias, literalReal) {
    if (data[alias].value) {
        literalReal.value = data[alias].value;
    }
}

function parseLiteralUnlimitedNatural(data, alias, literalUnlimitedNatural) {
    if (data[alias].value) {
        literalUnlimitedNatural.value = data[alias].value;
    }
}

function parseMultiplicityElement(data, alias, multiplicityElement) {
    if (data[alias].lowerValue) {
        multiplicityElement.lowerValue.set(data[alias].lowerValue);
    }
    if (data[alias].upperValue) {
        multiplicityElement.upperValue.set(data[alias].upperValue);
    }
}

function parseNamedElement(data, alias, el) {
    if (data[alias].name) {
        el.name = data[alias].name;
    }
    parseSet(data, alias, el.clientDependencies, 'clientDependencies');
}

function parsePackage(data, alias, pckg) {
    if (data[alias].packagedElements) {
        for (let id of data[alias].packagedElements) {
            pckg.packagedElements.add(id);
        }
    }
    if (data[alias].ownedStereotypes) {
        for (let id of data[alias].ownedStereotypes) {
            pckg.ownedStereotypes.add(id);
        }
    }
}

function parsePackageableElement(data, alias, packageableElement) {
    if (data.owningPackage) {
        packageableElement.owningPackage.set(data.owningPackage);
    }
}

function parseProperty(data, alias, property) {
    parseOwner(data, property.clazz, 'class');
    parseOwner(data, property.dataType, 'dataType');
    parseOwner(data, property.owningAssociation, 'owningAssociation');

    if (data[alias].aggregation) {
        property.aggregation = data[alias].aggregation;
    }
    parseSingleton(data, alias, property.association, 'association');
    parseSingleton(data, alias, property.defaultValue, 'defaultValue');
}

function parseSlot(data, alias, slot) {
    parseSet(data, alias, slot.values, 'values');
    parseSingleton(data, alias, slot.definingFeature, 'definingFeature');
    parseOwner(data, slot.owningInstance, 'owningInstance');
}

function parseTypedElement(data, alias, typedElement) {
    if (data[alias].type) {
        typedElement.type.set(data[alias].type);
    }
}
