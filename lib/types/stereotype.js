import Class from "./class";
import { emitClassifier } from "./classifier";
import { emitEl } from "./element";
import { emitNamedEl } from "./namedElement";
import { emitPackageableElement } from "./packageableElement";
import { emitStructuredClassifier } from "./structuredClassifier";
import Singleton from '../singleton';

export default class Stereotype extends Class {

    constructor() {
        super();
        this.profile = new Singleton(this);
        this.profile.readonly = true;
        this.sets.set('profile', this.profile);
        this.elementTypes.add('Stereotype');
    }

    elementType() {
        return 'Stereotype';
    }

    emit() {
        const ret = {
            stereotype : {}
        };
        emitEl(ret, 'stereotype', this);
        emitNamedEl(ret, 'stereotype', this);
        emitPackageableElement(ret, 'stereotype', this);
        emitClassifier(ret, 'stereotype', this);
        emitStructuredClassifier(ret, 'stereotype', this);
        return ret;
    }
}
