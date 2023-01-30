export default class Singleton {
    constructor(el) {
        this.subSets = [];
        this.superSets = [];
        this.redefines = [];
        this.el = el;
        this.val = undefined;
        this.opposite = undefined;
    }

    subsets(set) {
        set.subSets.push(this);
        this.superSets.push(set);
    }

    set(val) {
        if (this.val) {
            // todo remove
            // todo opposite
        }
        if (val === undefined || val === null) {
            this.val = undefined;
        }
        this.val = val;
        for (let set of this.superSets) {
            if (!set.contains(val)) {
                set.add(val);
            }
        }
        if (this.opposite !== undefined && val !== undefined && val !== null) {
            if (!val.sets[this.opposite].contains(this.el)) {
                val.sets[this.opposite].add(this.el);
            }
        } else {
            let queue = [];
            for (let set in this.superSets) {
                queue.push(set);
            }
            while (queue.length !== 0) { // this can be handled better
                let front = queue[0];
                queue.splice(front, 1);
                if (front.opposite !== undefined) {
                    el.sets[this.opposite].add(this.el);
                    break;
                }
                for (let set in front.superSets) {
                    queue.push(set);
                }
            }
        }
    }

    contains(el) {
        if (this.val === undefined || this.val === null) {
            return false;
        }
        return this.val.id === el.id;
    }

    add(el) {
        this.set(el);
    }
}