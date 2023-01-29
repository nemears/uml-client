import Element from './element'
import Singleton from './singleton';

export default class NamedElement extends Element {
    constructor() {
        this.name = "";
        this.namespace = new Singleton(this);
        this.namespace.subsets(this.owner);
    }
}