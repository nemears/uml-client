import DataType from "./dataType";
import { TypeInfo } from "./element";
import UmlSet from "../set.js"
import { ENUMERATION_ID, ENUMERATION_LITERAL_ENUMERATION_ID, ENUMERATION_OWNED_LITERALS_ID } from "../modelIds.js";

export default class Enumeration extends DataType {

    constructor(manager) {
        super(manager);
        this.typeInfo = new TypeInfo(ENUMERATION_ID, 'Enumeration');
        this.enumerationTypeInfo = this.typeInfo;
        this.typeInfo.setBase(this.dataTypeTypeInfo);
        this.typeInfo.create = () => new Enumeration(manager);
        this.ownedLiterals = new UmlSet(this, ENUMERATION_OWNED_LITERALS_ID, 'ownedLiterals');
        this.ownedLiterals.subsets(this.ownedMembers);
        this.ownedLiterals.opposite = ENUMERATION_LITERAL_ENUMERATION_ID;
    }
}
