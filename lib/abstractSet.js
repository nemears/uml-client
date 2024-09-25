export default class AbstractSet {
    constructor(el, id, name, additionPolicy, removalPolicy) {
        this.subSets = new Set();
        this.superSets = new Set();
        this.redefinedSets = new Set();
        this.rootRedefinedSet = this;
        this.el = el;
        this.manager = el.manager;
        this.definingFeature = id;
        this.el.typeInfo.sets.set(id, this);
        this.name = name;
        if (name) {
            this.el.typeInfo.sets.set(name, this);
        } else {
            this.name = "";
        }
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
            subSet.superSets.delete(redefinedSet);
            subSet.superSets.add(this);
            this.subSets.add(subSet);
        }
        for (const superSet of redefinedSet.superSets) {
            superSet.subSets.delete(redefinedSet);
            superSet.subSets.add(this);
            this.superSets.add(superSet);
        }
    }
}
