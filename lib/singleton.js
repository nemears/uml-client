export default class Singleton {
    constructor(el) {
        this.subSets = [];
        this.superSets = [];
        this.redefines = [];
        this.el = el;
        this.val = undefined;
    }

    subsets(set) {
        set.subSets.push(this);
        this.superSets.push(set);
    }

    set(val) {
        if (this.val) {
            // todo opposite
        }
        this.val = val;
        for (set in this.superSets) {
            sett.add(val);
        }
    }

    add(el) {
        set(el);
    }
}