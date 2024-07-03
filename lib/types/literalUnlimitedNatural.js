import { emitEl } from "./element";
import { emitNamedEl } from "./namedElement";
import { emitPackageableElement } from "./packageableElement";
import { emitTypedElement } from "./typedElement";
import LiteralSpecification from './literalSpecification';

export default class LiteralUnlimitedNatural extends LiteralSpecification {
    constructor(manager) {
        super(manager);
        this.value = 0;
        this.elementTypes.add('LiteralUnlimitedNatural');
    }

    elementType() {
        return 'LiteralUnlimitedNatural';
    }

    emit() {
        const ret = {
            literalUnlimitedNatural: {}
        };
        emitEl(ret, 'literalUnlimitedNatural', this);
        emitNamedEl(ret, 'literalUnlimitedNatural', this);
        emitTypedElement(ret, 'literalUnlimitedNatural', this);
        emitPackageableElement(ret, 'literalUnlimitedNatural', this);
        emitLiteralUnlimitedNatural(ret, 'literalUnlimitedNatural', this);
        return ret;
    }
}

export function emitLiteralUnlimitedNatural(data, alias, literalUnlimitedNatural) {
    data[alias].value = literalUnlimitedNatural.value;
}
