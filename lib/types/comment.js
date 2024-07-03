import Element, { emitEl, nullID } from "./element";
import UmlSet from "../set";
import { emitSet } from "../emit";

export default class Comment extends Element {
    body = "";
    constructor(manager) {
        super(manager);
        this.annotatedElements = new UmlSet(this);
        this.sets.set('annotatedElements', this.annotatedElements);
        this.elementTypes.add('Comment');
    }

    elementType() {
        return 'Comment';
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
            this.owner.set(undefined);
        }
    }
}

export function emitComment(data, alias, comment) {
    emitSet(data, alias, comment.annotatedElements, 'annotatedElements');
    if (comment.body !== "") {
        data[alias].body = comment.body;
    }
}
