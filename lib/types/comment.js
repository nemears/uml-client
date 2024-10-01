import Element, { TypeInfo } from "./element";
import UmlSet from "../set";
import { COMMENT_ID, COMMENT_ANNOTATED_ELEMENTS_ID } from '../modelIds';

export default class Comment extends Element {
    body = "";
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(COMMENT_ID, 'Comment');
        this.commentTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.elementTypeInfo);
        this.typeInfo.create = () => new Comment(manager);
        const me = this;
        this.typeInfo.specialData.set('body', {
            getData() {
                return me.body;
            },
            setData(val) {
                me.body = val;
            }
        });
        this.annotatedElements = new UmlSet(this, COMMENT_ANNOTATED_ELEMENTS_ID, 'annotatedElements');
    }
}
