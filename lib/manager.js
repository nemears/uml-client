import { parseType } from "./parse";
import { randomID } from "./types/element";

// this class is for local just javascript management of uml objects, no server connection needed
export default class UmlManager {
    
    _graph = {};
    
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
        let ret = parseType(json, this);
        ret.id = id;
        this._graph[id] = ret;
        return ret;
    }

    add(el) {
        el.setManager(this);
        this._graph[el.id] = el;
    }

    getLocal(id) {
        return this._graph[id];
    }

    get(id) {
        return this._graph[id];
    }

    async deleteElement(el) {
        await el.deleteData();
        delete this._graph[el.id];
    }
}
