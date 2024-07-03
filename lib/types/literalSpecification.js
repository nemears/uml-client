import ValueSpecification from './valueSpecification';

export default class LiteralSpecification extends ValueSpecification {
    constructor(manager) {
        super(manager);
        this.elementTypes.add('LiteralSpecification');
    }
}
