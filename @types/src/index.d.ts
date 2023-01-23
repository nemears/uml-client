declare class UmlClient {
    constructor();
    randomID() : string;
    nullID() : string;
    sendMessage(msgString : string);
    head() : Promise<any>;
    get(id : string) : Promise<any>;
    write(data : any);
}
export = UmlClient;