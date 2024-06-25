import ValueSpecification from './valueSpecification';

export default class LiteralSpecification extends ValueSpecification {

}

export function isSubClassOfLiteralSpecification(elementType) {
    return elementType === 'literalSpecification';
}
