import { emitEl, isSubClassOfElement } from "./element";
import { emitNamedEl, isSubClassOfNamedElement } from "./namedElement";
import { isSubClassOfNamespace } from "./namespace";
import Package, { emitPackage, isSubClassOfPackage } from "./package";
import { emitPackageableElement, isSubClassOfPackageableElement } from "./packageableElement";

export default class Profile extends Package {
    elementType() {
        return 'profile';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfProfile(elementType);
        if (!ret) {
            ret = isSubClassOfPackage(elementType);
        }
        if (!ret) {
            ret = isSubClassOfPackageableElement(elementType);
        }
        if (!ret) {
            ret = isSubClassOfNamespace(elementType);
        }
        if (!ret) {
            ret = isSubClassOfNamedElement(elementType);
        }
        if (!ret) {
            ret = isSubClassOfElement(elementType);
        }

        return ret;
    }

    emit() {
        const ret = {
            profile: {}
        };
        emitEl(ret, 'profile', this);
        emitNamedEl(ret, 'profile', this);
        emitPackageableElement(ret, 'profile', this);
        emitPackage(ret, 'profile', this);
        return ret;
    }
}

export function isSubClassOfProfile(elementType) {
    return elementType === 'profile' || elementType === 'PROFILE';
}