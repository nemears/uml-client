import { emitEl } from "./element";
import { emitMultiplicityElement } from "./multiplicityElement";
import { emitNamedEl } from "./namedElement";
import Property, { emitProperty } from "./property";
import { emitTypedElement } from "./typedElement";

export default class ExtensionEnd extends Property {
    
    constructor(manager) {
        super(manager);
        this.elementTypes.add('ExtensionEnd');
    }

    elementType() {
        return 'ExtensionEnd';
    }

    emit() {
        const ret = {
            ExtensionEnd: {}
        };
        emitEl(ret, 'ExtensionEnd', this);
        emitNamedEl(ret, 'ExtensionEnd', this);
        emitTypedElement(ret, 'ExtensionEnd', this);
        emitMultiplicityElement(ret, 'ExtensionEnd', this);
        emitProperty(ret, 'ExtensionEnd', this);
        return ret;
    }
}
