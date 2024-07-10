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
            LiteralUnlimitedNatural: {}
        };
        emitEl(ret, 'LiteralUnlimitedNatural', this);
        emitNamedEl(ret, 'LiteralUnlimitedNatural', this);
        emitTypedElement(ret, 'LiteralUnlimitedNatural', this);
        emitPackageableElement(ret, 'LiteralUnlimitedNatural', this);
        emitLiteralUnlimitedNatural(ret, 'LiteralUnlimitedNatural', this);
        return ret;
    }
}

export function emitLiteralUnlimitedNatural(data, alias, literalUnlimitedNatural) {
    data[alias].value = literalUnlimitedNatural.value;
}
