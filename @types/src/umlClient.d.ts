import { UmlClient } from "../../src";

// export as namespace "uml-js";

export = UmlClient;

declare class UmlClient {
    constructor();
    randomID() : string;
    nullID() : string;
    sendMessage(msgString : string);
    async head() : Promise<any>;
    async get(id : string) : Promise<any>;
    async write(data : any);
}