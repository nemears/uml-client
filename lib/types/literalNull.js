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
            literalNull: {}
        };
        emitEl(ret, 'literalNull', this)
        emitNamedEl(ret, 'literalNull', this);
        emitTypedElement(ret, 'literalNull', this);
        return ret;
    }
}
