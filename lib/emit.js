import { nullID } from "./element";

export function emitSet(data, alias, set, setName) {
    if (set.size() > 0) {
        data[alias][setName] = [];
        for (let id of set.ids()) {
            data[alias][setName].push(id);
        }
    }
}

export function emitSingleton(data, alias, singleton, singletonName) {
    if (singleton.id() !== nullID()) {
        data[alias][singletonName] = singleton.id();
    }
}

export function emitOwner(data, singleton, singletonName) {
    if (singleton.id() !== nullID()) {
        data[singletonName] = singleton.id();
    }
}