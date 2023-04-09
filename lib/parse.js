import Class from "./class.js";
import DataType from "./dataType.js";
import Generalization from "./generalization.js";
import Package from "./package.js";
import PrimitiveType from "./primitiveType.js";
import Property from "./property.js";

export default function parse(data) {
    if (data.class && !data.property) {
        let ret = new Class();
        parseClass(data, 'class', ret);
        return ret;
    } else if (data.dataType && ! data.property) {
        let ret = new DataType();
        parseDataType(data, 'dataType', ret);
        return ret;
    } else if (data.generalization) {
        let ret = new Generalization();
        parseGeneralization(data, 'generalization', ret);
        return ret;
    } else if (data.package) {
        let ret = new Package();
        parsePackage(data, 'package', ret);
        return ret;
    } else if (data.primitiveType) {
        let ret = new PrimitiveType();
        parsePrimitiveType(data, 'primitiveType', ret);
        return ret;
    } else if (data.property) {
        let ret = new Property();
        parseProperty(data, 'property', ret);
        return ret;
    }
}

function parseClass(data, alias, clazz) {
    parseClassifier(data, alias, clazz);
    if (data[alias].ownedAttributes) {
        for (let id of data[alias].ownedAttributes) {
            clazz.ownedAttributes.add(id);
        }
    }
}

function parseClassifier(data, alias, classifier) {
    parsePackageableElement(data, alias, classifier);
    if (data[alias].generalizations) {
        for (let id of data[alias].generalizations) {
            classifier.generalizations.add(id);
        }
    }
}

function parseDataType(data, alias, dataType) {
    parseClassifier(data, alias, dataType);
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
}

function parseGeneralization(data, alias, generalization) {
    parseElement(data, alias, generalization);
    if (data.specific) {
        generalization.specific.set(data.specific);
    }
    if (data[alias].general) {
        generalization.general.set(data[alias].general);
    }
}

function parseNamedElement(data, alias, el) {
    parseElement(data, alias, el);
    if (data[alias].name) {
        el.name = data[alias].name;
    }
}

function parsePackage(data, alias, pckg) {
    parsePackageableElement(data, alias, pckg);
    if (data[alias].packagedElements) {
        for (let id of data[alias].packagedElements) {
            pckg.packagedElements.add(id);
        }
    }
}

function parsePackageableElement(data, alias, packageableElement) {
    parseNamedElement(data, alias, packageableElement);
    if (data.owningPackage) {
        packageableElement.owningPackage.set(data.owningPackage);
    }
}

function parsePrimitiveType(data, alias, primitiveType) {
    parseDataType(data, alias, primitiveType);
}

function parseProperty(data, alias, property) {
    parseNamedElement(data, alias, property);
    if (data.class) {
        property.clazz.set(data.class);
    }
}