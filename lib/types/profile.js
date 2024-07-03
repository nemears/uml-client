import { emitEl } from "./element";
import { emitNamedEl } from "./namedElement";
import Package, { emitPackage } from "./package";
import { emitPackageableElement } from "./packageableElement";

export default class Profile extends Package {

    constructor(manager) {
        super(manager);
        this.elementTypes.add('Profile');
    }

    elementType() {
        return 'Profile';
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
