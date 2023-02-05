import Class from "./class.js";
import Package from "./package.js";

export default function parse(data) {
    if (data.class) {
        let ret = new Class();
        // TODO
        parseClass(data.class, ret);
        return ret;
    } else if (data.package) {
        let ret = new Package();
        parsePackage(data.package, ret);
        return ret;
    }
}

function parsePackage(data, pckg) {
    parseNamespace(data, pckg);
    if (data.packagedElements) {
        for (let id of data.packagedElements) {
            // TODO
            throw Error("TODO, add to set when parsed");
        }
    }
}

function parseClass(data, clazz) {
    parseNamedElement(data, clazz);
}

function parseNamespace(data, nmspc) {
    parseNamedElement(data, nmspc);
}

function parseNamedElement(data, el) {
    parseElement(data, el);
    if (data.name) {
        el.name = data.name;
    }
}

function parseElement(data, el) {
    if (data.id) {
        el.id = data.id;
    } else {
        throw Error("data must have id!");
    }
}