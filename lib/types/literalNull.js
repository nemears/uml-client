import { emitEl } from "./element";
import { emitNamedEl } from "./namedElement";
import { emitTypedElement } from "./typedElement";
import LiteralSpecification from './literalSpecification';

export default class LiteralNull extends LiteralSpecification {

    constructor(manager) {
        super(manager);
        this.elementTypes.add('LiteralNull');
    }

    elementType() {
        return 'LiteralNull';
    }

    emit() {
        const ret = {
            LiteralNull: {}
        };
        emitEl(ret, 'LiteralNull', this)
        emitNamedEl(ret, 'LiteralNull', this);
        emitTypedElement(ret, 'LiteralNull', this);
        return ret;
    }
}
