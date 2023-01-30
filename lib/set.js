export default class Set {
    constructor(el) {
        this.subSets = [];
        this.superSets = [];
        this.redefines = [];
        this.el = el;
        this.data = [];
        this.opposite = undefined;
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
        for (let set of this.superSets) {
            if (!set.contains(el)) {
                set.add(el);
            }
        }
        if (this.opposite !== undefined) {
            if (!el.sets[this.opposite].contains(this.el)) {
                el.sets[this.opposite].add(this.el);
            }
        } else {
            // check supersets todo
            let queue = [];
            for (let set in this.superSets) {
                queue.push(set);
            }
            while (queue.length !== 0) { // this can be handled better
                let front = queue[0];
                queue.splice(front, 1);
                if (front.opposite !== undefined) {
                    if (el.sets[this.opposite].contains(this.el)) {
                        el.sets[this.opposite].add(this.el);
                    }
                    break;
                }
                for (let set in front.superSets) {
                    queue.push(set);
                }
            }
        }
    }

    contains(el) {
        return this.data.find(e => el.id === e.id);
    }

    remove (el) {
        // TODO
    }
}