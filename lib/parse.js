import Class from "./class.js";
import Package from "./package.js";
import PrimitiveType from "./primitiveType.js";
import Property from "./property.js";

export default function parse(data) {
    if (data.class && !data.property) {
        let ret = new Class();
        // TODO
        parseClass(data, 'class', ret);
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

function parsePackage(data, alias, pckg) {
    parsePackageableElement(data, alias, pckg);
    if (data[alias].packagedElements) {
        for (let id of data[alias].packagedElements) {
            pckg.packagedElements.add(id.slice(0, 28));
        }
    }
}

function parsePackageableElement(data, alias, packageableElement) {
    parseNamedElement(data, alias, packageableElement);
    if (data.owningPackage) {
        packageableElement.owningPackage.set(data.owningPackage);
    }
}

function parseClass(data, alias, clazz) {
    parsePackageableElement(data, alias, clazz);
    if (data[alias].ownedAttributes) {
        for (let id of data[alias].ownedAttributes) {
            clazz.ownedAttributes.add(id.slice(0, 28));
        }
    }
}

function parsePrimitiveType(data, alias, primitiveType) {
    parsePackageableElement(data, alias, primitiveType);
}

function parseNamedElement(data, alias, el) {
    parseElement(data, alias, el);
    if (data[alias].name) {
        el.name = data[alias].name;
    }
}

function parseElement(data, alias, el) {
    if (data[alias].id) {
        el.id = data[alias].id;
    } else {
        throw Error("data must have id!");
    }
}

function parseProperty(data, alias, property) {
    parseNamedElement(data, alias, property);
    if (data.class) {
        property.clazz.set(data.class);
    }
}