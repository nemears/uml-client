import PackageableElement, { deletePackageableElementData } from "./packageableElement";
import { assignTypedElementSets } from "./typedElement";

export default class ValueSpecification extends PackageableElement {
    constructor(manager) {
        super(manager);
        assignTypedElementSets(this);
        this.elementTypes.add('ValueSpecification');
    }

    async deleteData() {
        await deleteValueSpecificationData(this);
        deletePackageableElementData(this);
    }
}

export async function deleteValueSpecificationData(el) {
    const owner = await el.owner.get();
    if (owner && owner.is('Property') && owner.defaultValue.id() === el.id) {
        await owner.defaultValue.set(undefined);
    }
    if (owner && owner.is('Slot') && owner.values.contains(el.id)) {
        await owner.values.remove(el);
    }
}
