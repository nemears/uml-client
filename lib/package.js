import PackageableElement from "./packageableElement.js";
import {assignNamespaceSets} from "./namespace.js";
import { emitEl } from "./element.js";
import { emitNamedEl } from "./namedElement.js";
import Set from "./set.js";

export default class Package extends PackageableElement {
    constructor() {
        super();
        assignNamespaceSets(this);
        this.packagedElements = new Set(this);
        this.packagedElements.subsets(this.ownedMembers);
        this.packagedElements.opposite = "owningPackage";
        this.sets["packagedElements"] = this.packagedElements;
    }

    emit() {
        let ret = {};
        emitEl(ret, this);
        emitNamedEl(ret, this);
        emitPackage(ret, this);
        return ret;
    }
}

export function emitPackage(data, pckg) {
    if (pckg.packagedElements.size() > 0) {
        data.packagedElements = [];
        for (let el of pckg.packagedElements) {
            data.packagedElements.push(el.id + ".yml");
        }
    }
}