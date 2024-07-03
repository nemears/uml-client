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
            extensionEnd: {}
        };
        emitEl(ret, 'extensionEnd', this);
        emitNamedEl(ret, 'extensionEnd', this);
        emitTypedElement(ret, 'extensionEnd', this);
        emitMultiplicityElement(ret, 'extensionEnd', this);
        emitProperty(ret, 'extensionEnd', this);
        return ret;
    }
}
