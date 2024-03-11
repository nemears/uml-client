import PackageableElement from "./packageableElement";

export default class Type extends PackageableElement {
    constructor(manager) {
        super(manager);
    }
}

export function isSubClassOfType(elementType) {
    return elementType === 'type' || elementType === 'TYPE';
}