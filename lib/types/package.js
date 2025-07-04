import { TypeInfo } from './element.js';
import PackageableElement  from "./packageableElement.js";
import { assignNamespaceSets } from "./namespace.js";
import UmlSet, { addToReadOnlySet, removeFromReadOnlySet } from "../set.js";
import { internalSet } from '../singleton.js';
import { 
    PACKAGEABLE_ELEMENT_OWNING_PACKAGE_ID, 
    PACKAGE_ID,
    PACKAGE_PACKAGED_ELEMENTS_ID, 
    PACKAGE_OWNED_STEREOTYPES_ID 
} from '../modelIds.js';

export default class Package extends PackageableElement {
    constructor(manager) {
        super(manager);
        assignNamespaceSets(this);
        this.typeInfo = new TypeInfo(PACKAGE_ID, 'Package');
        this.packageTypeInfo = this.typeInfo;
        this.typeInfo.create = () => new Package(manager);
        this.typeInfo.setBase(this.packageableElementTypeInfo);
        this.typeInfo.setBase(this.namespaceTypeInfo);
        this.packagedElements = new UmlSet(
            this, 
            PACKAGE_PACKAGED_ELEMENTS_ID, 
            'packagedElements',
            async (el, me) => {
                if (el.is('Stereotype') && !me.ownedStereotypes.contains(el)) {
                    addToReadOnlySet(el, me.ownedStereotypes);
                }
            },
            async (el, me) => {
                if (el.is('Sterotype') && me.ownedStereotypes.contains(el.id)) {
                    removeFromReadOnlySet(el, me.ownedStereotypes);
                }
            }
        );
        this.packagedElements.subsets(this.ownedMembers);
        this.packagedElements.opposite = PACKAGEABLE_ELEMENT_OWNING_PACKAGE_ID;
        this.ownedStereotypes = new UmlSet(this, PACKAGE_OWNED_STEREOTYPES_ID, 'ownedStereotypes', async (el, me) => {
            var curr = me;
            while (!curr.is('Profile')) {

                curr = await curr.owningPackage.get()
            }
            if (!curr) {
                throw Error('Stereotype not added to any subpackage of any profile!')
            }
            await internalSet(curr, el.profile);
        }, async (el) => {
            await internalSet(undefined, el.profile);
        });
        this.ownedStereotypes.readonly = true;
        this.ownedStereotypes.subsets(this.packagedElements);
    }
}
