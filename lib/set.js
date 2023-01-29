export default class Set {
    constructor(el) {
        this.subSets = [];
        this.superSets = [];
        this.redefines = [];
        this.el = el;
        this.data = [];
    }

    subsets(set) {
        set.subSets.push(this);
        this.superSets.push(set);
    }

    add(el) {
        if (this.data.find(entry => el.id === entry.id)) {
            throw Error("duplicate element added to set!");
        }
        this.data.push(el);
        for (set in this.superSets) {
            if (!set.data.find(entry => el.id === entry.id)) {
                set.add(el);
            }
        }
    }

    remove (el) {
        // TODO
    }
}