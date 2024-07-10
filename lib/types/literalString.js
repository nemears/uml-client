import { emitEl } from "./element";
import { emitNamedEl } from "./namedElement";
import { emitPackageableElement } from "./packageableElement";
import { emitTypedElement } from "./typedElement";
import LiteralSpecification from './literalSpecification';

export default class LiteralString extends LiteralSpecification {
    constructor(manager) {
        super(manager);
        this.value = '';
        this.elementTypes.add('LiteralString');
    }

    elementType() {
        return 'LiteralString';
    }

    emit() {
        let ret = {
            LiteralString: {}
        }
        emitEl(ret, 'LiteralString', this);
        emitNamedEl(ret, 'LiteralString', this);
        emitTypedElement(ret, 'LiteralString', this);
        emitPackageableElement(ret, 'LiteralString', this);
        emitLiteralString(ret, 'LiteralString', this);
        return ret;
    }
}

export function emitLiteralString(data, alias, literalString) {
    if (literalString.value !== '') {
        data[alias].value = literalString.value;
    }
}
