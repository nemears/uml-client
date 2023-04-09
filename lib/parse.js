import Class from "./class.js";
import DataType from "./dataType.js";
import Generalization from "./generalization.js";
import LiteralInt from "./literalInt.js";
import LiteralString from "./literalString.js";
import Package from "./package.js";
import PrimitiveType from "./primitiveType.js";
import Property from "./property.js";
import Stereotype from "./stereotype.js";

export default function parse(data) {
    if (data.class && !data.property) {
        const ret = new Class();
        parseElement(data, 'class', ret);
        parseNamedElement(data, 'class', ret);
        parsePackageableElement(data, 'class', ret);
        parseClassifier(data, 'class', ret);
        parseClass(data, 'class', ret);
        return ret;
    } else if (data.dataType && ! data.property) {
        const ret = new DataType();
        parseElement(data, 'dataType', ret);
        parseNamedElement(data, 'dataType', ret);
        parsePackageableElement(data, 'dataType', ret);
        parseClassifier(data, 'dataType', ret);
        parseDataType(data, 'dataType', ret);
        return ret;
    } else if (data.generalization) {
        const ret = new Generalization();
        parseElement(data, 'generalization', ret);
        parseGeneralization(data, 'generalization', ret);
        return ret;
    } else if (data.literalInt) {
        const ret = new LiteralInt();
        parseElement(data, 'literalInt', ret);
        parseNamedElement(data, 'literalInt', ret);
        parseTypedElement(data, 'literalInt', ret);
        parsePackageableElement(data, 'literalInt', ret);
        parseLiteralInt(data, 'literalInt', ret);
        return ret;
    } else if (data.literalString) {
        const ret = new LiteralString();
        parseElement(data, 'literalString', ret);
        parseNamedElement(data, 'literalString', ret);
        parseTypedElement(data, 'literalString', ret);
        parsePackageableElement(data, 'literalString', ret);
        parseLiteralString(data, 'literalString', ret);
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
    } else if (data.property) {
        const ret = new Property();
        parseElement(data, 'property', ret);
        parseNamedElement(data, 'property', ret);
        parseTypedElement(data, 'property', ret);
        parseMultiplicityElement(data, 'property', ret);
        parseProperty(data, 'property', ret);
        return ret;
    } else if (data.stereotype) {
        const ret = new Stereotype();
        parseElement(data, 'stereotype', ret);
        parseNamedElement(data, 'stereotype', ret);
        parsePackageableElement(data, 'stereotype', ret);
        parseClassifier(data, 'stereotype', ret);
        parseClass(data, 'stereotype', ret);
        return ret;
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

function parseDataType(data, alias, dataType) {
    if (data[alias].ownedAttributes) {
        for (let id of data[alias].ownedAttributes) {
            dataType.ownedAttributes.add(id);
        }
    }
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
}

function parseGeneralization(data, alias, generalization) {
    if (data.specific) {
        generalization.specific.set(data.specific);
    }
    if (data[alias].general) {
        generalization.general.set(data[alias].general);
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
}

function parsePackage(data, alias, pckg) {
    if (data[alias].packagedElements) {
        for (let id of data[alias].packagedElements) {
            pckg.packagedElements.add(id);
        }
    }
}

function parsePackageableElement(data, alias, packageableElement) {
    if (data.owningPackage) {
        packageableElement.owningPackage.set(data.owningPackage);
    }
}

function parseProperty(data, alias, property) {
    if (data.class) {
        property.clazz.set(data.class);
    }
}

function parseTypedElement(data, alias, typedElement) {
    if (data[alias].type) {
        typedElement.type.set(data[alias].type);
    }
}