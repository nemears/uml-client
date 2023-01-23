import { UmlClient } from "../../src";

// export as namespace "uml-js";

export = UmlClient;

declare class UmlClient {
    constructor();
    randomID() : string;
    nullID() : string;
    sendMessage(msgString : string);
    head() : Promise<any>;
    get(id : string) : Promise<any>;
    write(data : any);
}