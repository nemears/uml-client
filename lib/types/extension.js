import Association from "./association.js";
import { TypeInfo } from "./element.js";
import Singleton from "../singleton.js";
import { ABSTRACTION_ID, EXTENSION_ID, EXTENSION_OWNED_END_ID } from "../modelIds.js";

export default class Extension extends Association {
    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(EXTENSION_ID, 'Extension');
        this.extensionTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.associationTypeInfo);
        this.typeInfo.create = () => new Extension(manager);
        this.ownedEnd = new Singleton(this, EXTENSION_OWNED_END_ID, 'ownedEnd');
        this.ownedEnd.subsets(this.ownedEnds);
    }
}

export async function create_extension(stereotype, meta_class_identifier) {
    // find meta class
    let meta_class = undefined;
    for (const type of stereotype.manager._types) {
        if (
            type.typeInfo.id === meta_class_identifier ||
            type.typeInfo.name === meta_class_identifier
        ) {
            meta_class = await stereotype.manager.get(type.typeInfo.id);
            break;
        }
    }
    if (!meta_class) {
        throw new Error('Could not create extension, could not find meta class ' + meta_class_identifier);
    }

    const extension = await stereotype.manager.post('Extension');
    const extensionEnd = await stereotype.manager.post('ExtensionEnd');
    const stereotypeProperty = await stereotype.manager.post('Property');
    await extensionEnd.type.set(stereotype);
    await stereotypeProperty.type.set(meta_class);
    stereotypeProperty.name = '_stereotypedElement';
    await extension.ownedEnd.set(extensionEnd);
    await extension.memberEnds.add(stereotypeProperty);
    await stereotype.ownedAttributes.add(stereotypeProperty);
    const profile = await stereotype.profile.get();
    await profile.packagedElements.add(extension);
    await stereotype.manager.put(extensionEnd);
    await stereotype.manager.put(stereotypeProperty);
    await stereotype.manager.put(extension);
    await stereotype.manager.put(stereotype);
    await stereotype.manager.put(profile);

    return extension;
}
