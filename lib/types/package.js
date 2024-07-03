import PackageableElement, { deletePackageableElementData, emitPackageableElement } from "./packageableElement.js";
import { assignNamespaceSets } from "./namespace.js";
import { emitEl } from "./element.js";
import { emitNamedEl } from "./namedElement.js";
import UmlSet, { subsetContains } from "../set.js";

export default class Package extends PackageableElement {
    constructor(manager) {
        super(manager);
        assignNamespaceSets(this);
        this.packagedElements = new UmlSet(this);
        this.packagedElements.subsets(this.ownedMembers);
        this.packagedElements.opposite = "owningPackage";
        this.ownedStereotypes = new UmlSet(this, async (el, me) => {
            var curr = me;
            while (!curr.isSubClassOf('profile')) {
                curr = await curr.packageElements.get()
            }
            if (!curr) {
                throw Error('Stereotype not added to any subpackage of any profile!')
            }
            el.profile.set(curr);
        }, (el) => {
            el.profile.set(undefined);
        });
        this.ownedStereotypes.subsets(this.packagedElements);
        this.sets.set("packagedElements", this.packagedElements);
        this.sets.set('ownedStereotypes', this.ownedStereotypes);
        this.elementTypes.add('Package');
    }

    elementType() {
        return 'Package';
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
            this.packagedElements.remove(el);
        }
        deletePackageableElementData(this);
    }
}

export function emitPackage(data, alias, pckg) {
    if (pckg.packagedElements.size() > 0) {
        let emitSet = false;
        for (let id of pckg.packagedElements.ids()) {
            if (!subsetContains(pckg.ownedStereotypes, id)) {
                emitSet = true;
                break;
            }
        }
        if (emitSet) {
            data[alias].packagedElements = [];
            for (let el of pckg.packagedElements.ids()) {
                data[alias].packagedElements.push(el);
            }
        }
    }
    if (pckg.ownedStereotypes.size() > 0) {
        data[alias].ownedStereotypes = [];
        for (let el of pckg.ownedStereotypes.ids()) {
            data[alias].ownedStereotypes.push(el);
        } 
    }
}
