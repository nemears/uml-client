import { randomID } from "./types/element.js";
import Association from './types/association.js';
import Class from './types/class.js';
import Comment from './types/comment.js';
import DataType from './types/dataType.js';
import Dependency from './types/dependency.js';
import Generalization from './types/generalization.js';
import InstanceSpecification from './types/instanceSpecification.js';
import Package from './types/package.js';
import PrimitiveType from './types/primitiveType.js';
import Property from './types/property.js';
import LiteralBool from "./types/literalBool.js";
import LiteralInt from "./types/literalInt.js";
import LiteralNull from "./types/literalNull.js";
import LiteralReal from "./types/literalReal.js";
import LiteralString from "./types/literalString.js";
import LiteralUnlimitedNatural from "./types/literalUnlimitedNatural.js";
import { addToReadOnlySet } from "./set.js";
import Profile from "./types/profile.js";
import Extension from "./types/extension.js";
import ExtensionEnd from "./types/extensionEnd.js";
import Stereotype from "./types/stereotype.js";
import Enumeration from "./types/enumeration.js";
import EnumerationLiteral from "./types/enumerationLiteral.js";
import { internalSet } from "./singleton.js";
import Slot from "./types/slot.js";
import InstanceValue from "./types/instanceValue.js";
import Usage from './types/usage.js';
import Abstraction from './types/abstraction.js';
import Realization from './types/realization.js';

// this class is for local just javascript management of uml objects, no server connection needed
export class Manager {
    
    _graph = new Map();
    _types = [];
    id = randomID();

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
                        await internalSet(setData, set);
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
            new Abstraction(this),
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
            new Realization(this),
            new Slot(this),
            new Stereotype(this),
            new Usage(this)
        ];
    }
 }
