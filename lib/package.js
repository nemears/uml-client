import PackageableElement, { deletePackageableElementData, emitPackageableElement } from "./packageableElement.js";
import { assignNamespaceSets } from "./namespace.js";
import { emitEl } from "./element.js";
import { emitNamedEl } from "./namedElement.js";
import Set from "./set.js";

export default class Package extends PackageableElement {
    constructor(manager) {
        super(manager);
        assignNamespaceSets(this);
        this.packagedElements = new Set(this);
        this.packagedElements.subsets(this.ownedMembers);
        this.packagedElements.opposite = "owningPackage";
        this.sets["packagedElements"] = this.packagedElements;
    }

    elementType() {
        return 'package';
    }

    emit() {
        let ret = {
            package : {}
        };
        emitEl(ret, 'package', this);
        emitNamedEl(ret, 'package', this);
        emitPackageableElement(ret, 'package', this);
        emitPackage(ret, 'package', this);
        return ret;
    }

    async deleteData() {
        let elsToDelete = [];
        for await (let el of this.packagedElements) {
            elsToDelete.push(el);
        }
        for (let el of elsToDelete) {
            el.packagedElements.remove(el);
        }
        deletePackageableElementData(this);
    }
}

export function emitPackage(data, alias, pckg) {
    if (pckg.packagedElements.size() > 0) {
        data[alias].packagedElements = [];
        for (let el of pckg.packagedElements.ids()) {
            data[alias].packagedElements.push(el + ".yml");
        }
    }
}