import parse from "./parse";
import { randomID } from "./types/element";

// this class is for local just javascript management of uml objects, no server connection needed
export default class UmlManager {
    
    #graph = {};
    
    constructor() {

    }

    create(type, options) {
        let id = randomID();
        if (options && options['id']) {
            id = options['id'];
        }
        let json = {};
        json[type] = {
            id: id
        };
        let ret = parse(json);
        ret.manager = this;
        this.#graph[id] = ret;
        return ret;
    }

    add(el) {
        el.manager = this;
        this.#graph[el.id] = el;
    }

    getLocal(id) {
        return this.#graph[id];
    }

    async get(id) {
        return this.#graph[id];
    }

    async deleteElement(el) {
        await el.deleteData();
        delete this.#graph[el.id];
    }
}
