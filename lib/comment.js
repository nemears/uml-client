import Element, {isSubClassOfElement, emitEl, nullID} from "./element";
import Set from "./set";
import { emitSet } from "./emit";

export default class Comment extends Element {
    body = "";
    constructor(manager) {
        super(manager);
        this.annotatedElements = new Set(this);
        this.sets['annotatedElements'] = this.annotatedElements;
    }

    elementType() {
        return 'comment';
    }

    isSubClassOf(elementType) {
        let ret = isSubClassOfComment(elementType);
        if (!ret) {
            ret = isSubClassOfElement(elementType);
        }
        return ret;
    }

    emit() {
        let ret = {
            comment: {}
        };
        emitEl(ret, 'comment', this);
        emitComment(ret, 'comment', this);
        return ret;
    }

    async deleteData() {
        if (this.owner.id() !== nullID()) {
            this.owner.set(null);
        }
    }
}

export function isSubClassOfComment(elementType) {
    return elementType === 'comment' || elementType === 'COMMENT';
}

export function emitComment(data, alias, comment) {
    emitSet(data, alias, comment.annotatedElements, 'annotatedElements');
    if (comment.body !== "") {
        data[alias].body = comment.body;
    }
}