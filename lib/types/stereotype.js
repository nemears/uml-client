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
            Stereotype : {}
        };
        emitEl(ret, 'Stereotype', this);
        emitNamedEl(ret, 'Stereotype', this);
        emitPackageableElement(ret, 'Stereotype', this);
        emitClassifier(ret, 'Stereotype', this);
        emitStructuredClassifier(ret, 'Stereotype', this);
        return ret;
    }
}
