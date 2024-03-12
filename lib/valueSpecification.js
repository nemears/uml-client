import PackageableElement, { deletePackageableElementData } from "./packageableElement";
import { assignTypedElementSets } from "./typedElement";

export default class ValueSpecification extends PackageableElement {
    constructor(manager) {
        super(manager);
        assignTypedElementSets(this);
    }

    async deleteData() {
        await deleteValueSpecificationData(this);
        deletePackageableElementData(this);
    }
}

export async function deleteValueSpecificationData(el) {
    const owner = await el.owner.get();
    if (owner && owner.isSubClassOf('property') && owner.defaultValue.id() === el.id) {
        owner.defaultValue.set(null);
    }
    if (owner && owner.isSubClassOf('slot') && owner.values.contains(el.id)) {
        owner.values.remove(el);
    }
}

export function isSubClassOfValueSpecification(elementType) {
    return elementType === 'valueSpecification' || elementType === 'VALUE_SPECIFICATION';
}
