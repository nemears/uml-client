import Association, { emitAssociation } from "./association";
import { emitClassifier } from "./classifier";
import { emitEl, nullID } from "./element";
import { emitNamedEl } from "./namedElement";
import { emitPackageableElement } from "./packageableElement";
import Singleton from "../singleton";

export default class Extension extends Association {
    constructor(manager) {
        super(manager);
        this.ownedEnd = new Singleton(this);
        this.ownedEnd.subsets(this.ownedEnds);
        this.sets.set('ownedEnd', this.ownedEnds);
        this.elementTypes.add('Extension');
    }

    elementType() {
        return 'Extension';
    }

    emit() {
        const ret = {
            Extension: {}
        };
        emitEl(ret, 'Extension', this);
        emitNamedEl(ret, 'Extension', this);
        emitPackageableElement(ret, 'Extension', this);
        emitClassifier(ret, 'Extension', this);
        // emitAssociation(ret, 'Extension', this);
        emitExtension(ret, 'Extension', this);
        return ret;
    }
}

export function emitExtension(data, alias, extension) {
    const memberEndsData = [];
    for (const memberEndID of extension.memberEnds.ids()) {
        if (memberEndID !== extension.ownedEnd.id()) {
            memberEndsData.push(memberEndID);
        }
    }
    if (memberEndsData.length > 0) {
        data[alias]['memberEnds'] = memberEndsData;
    }
    if (extension.ownedEnd.id() != nullID()) {
        data[alias].ownedEnd = extension.ownedEnd.id();
    }
}
