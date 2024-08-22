export default class AbstractSet {
    constructor(el, additionPolicy, removalPolicy) {
        this.subSets = new Set();
        this.superSets = new Set();
        this.redefinedSets = new Set();
        this.rootRedefinedSet = this;
        this.el = el;
        this.manager = el.manager;
        this.readonly = false;
        this.opposite = undefined;
        this._size = 0;
        this.subSetsWithData = new Set();
        this.additionPolicy = additionPolicy;
        this.removalPolicy = removalPolicy;
    }
    
    subsets(set) {
        const me = this.rootRedefinedSet;
        set = set.rootRedefinedSet;
        set.subSets.add(me);
        me.superSets.add(set);
    }

    redefines(set) {
        const redefinedSet = set.rootRedefinedSet;
        redefinedSet.rootRedefinedSet = this;
        for (const redefinedSetOfSet of redefinedSet.redefinedSets) {
            redefinedSetOfSet.rootRedefinedSet = this;
            this.redefinedSets.add(redefinedSetOfSet);
        }
        redefinedSet.redefinedSets.clear();
        for (const subSet of redefinedSet.subSets) {
            subSet.superSets.remove(redefinedSet);
            subSet.superSets.add(this);
            this.subSets.add(subSet);
        }
        for (const superSet of redefinedSet.superSets) {
            superSet.subSets.remove(redefinedSet);
            superSet.subSets.add(this);
            this.superSets.add(superSet);
        }
    }
}
