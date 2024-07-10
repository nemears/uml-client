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
            Profile: {}
        };
        emitEl(ret, 'Profile', this);
        emitNamedEl(ret, 'Profile', this);
        emitPackageableElement(ret, 'Profile', this);
        emitPackage(ret, 'Profile', this);
        return ret;
    }
}
