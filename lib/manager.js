import { randomID } from "./types/element";
import Association from './types/association';
import Class from './types/class';
import Comment from './types/comment';
import DataType from './types/dataType';
import Dependency from './types/dependency';
import Generalization from './types/generalization';
import InstanceSpecification from './types/instanceSpecification';
import Package from './types/package';
import PrimitiveType from './types/primitiveType';
import Property from './types/property';
import LiteralBool from "./types/literalBool";
import LiteralInt from "./types/literalInt";
import LiteralNull from "./types/literalNull";
import LiteralReal from "./types/literalReal";
import LiteralString from "./types/literalString";
import LiteralUnlimitedNatural from "./types/literalUnlimitedNatural";
import { addToReadOnlySet } from "./set";
import Profile from "./types/profile";
import Extension from "./types/extension";
import ExtensionEnd from "./types/extensionEnd";
import Stereotype from "./types/stereotype";
import Enumeration from "./types/enumeration";
import EnumerationLiteral from "./types/enumerationLiteral";
import { internalSet } from "./singleton";
import Slot from "./types/slot";
import InstanceValue from "./types/instanceValue";

// this class is for local just javascript management of uml objects, no server connection needed
export class Manager {
    
    _graph = new Map();
    _types = [];

    parseType(data) {
        for (const type of this._types) {
            const innerData = data[type.typeInfo.name];
            if (innerData !== undefined) {
                return type.typeInfo.create();
            }
        }
    }

    async parse(data) {
        const ret = this.parseType(data);
        const innerData = data[ret.typeInfo.name];

        if (innerData.id) {
            ret.id = innerData.id;
        }

        const visited = new Set();
        const queue = [ret.typeInfo];
        while (queue.length > 0) {
            const front = queue.shift();
            if (visited.has(front)) {
                continue;
            }
            visited.add(front);
            for (const dataPair of front.specialData) {
                const dataName = dataPair[0];
                const dataPolicy = dataPair[1];
                const dataValue = innerData[dataName];
                if (dataValue !== undefined) {
                    dataPolicy.setData(dataValue);
                }
            }
            for (const setPair of front.sets) {
                const set = setPair[1];
                if (!set.rootSet()) {
                    continue;
                }
                if (set.composition === 'anticomposite') {
                    if (set.setType() != 'singleton') {
                        throw Error('anticomposite set must be a singleton!');
                    }
                    const setData = data[set.name];
                    if (setData) {
                        await set.set(setData);
                    }
                } else {
                    const setData = innerData[set.name];
                    if (setData) {
                        const setType = set.setType();
                        switch (setType) {
                            case 'set': {
                                for (const val of setData) {
                                    await addToReadOnlySet(val, set);
                                }
                                break;
                            }
                            case 'singleton': {
                                await internalSet(setData, set);
                                break;
                            }
                            default: {
                                throw Error('bad state cannot handle setType' + setType);
                            }
                        }
                    }
                }
            }
            for (const base of front.base) {
                queue.push(base);
            }
        }
        this._graph.set(ret.id, ret);
        return ret;
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
        let ret = this.parseType(json);
        ret.id = id;
        this._graph.set(id, ret);
        return ret;
    }

    add(el) {
        el.setManager(this);
        this._graph(el.id, el);
    }

    getLocal(id) {
        return this._graph.get(id);
    }

    get(id) {
        return this._graph.get(id);
    }

    async delete(el) {
        await el.delete();
        delete this._graph.delete(el.id);
    }
}
 export default class UmlManager extends Manager {
    constructor() {
        super();
        this._types = [
            new Association(this), 
            new Class(this), 
            new Comment(this), 
            new DataType(this), 
            new Dependency(this),
            new Enumeration(this),
            new EnumerationLiteral(this),
            new Extension(this),
            new ExtensionEnd(this),
            new Generalization(this), 
            new InstanceSpecification(this),
            new InstanceValue(this),
            new LiteralBool(this),
            new LiteralInt(this),
            new LiteralNull(this),
            new LiteralReal(this),
            new LiteralString(this),
            new LiteralUnlimitedNatural(this),
            new Package(this),
            new PrimitiveType(this),
            new Profile(this),
            new Property(this),
            new Slot(this),
            new Stereotype(this)
        ];
    }
 }