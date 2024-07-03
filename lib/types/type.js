import PackageableElement from "./packageableElement";

export default class Type extends PackageableElement {
    constructor(manager) {
        super(manager);
        this.elementTypes.add('Type');
    }
}
