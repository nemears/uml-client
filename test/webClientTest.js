import UmlWebClient from "../lib/umlClient.js";
import assert from 'assert';

describe("WebClientTest", function () {
    describe("postElement", function() {
        it("should connect to server and ask server to create package for it", async function() {
            let client = new UmlWebClient();
            let pckg = await client.post('package');
            assert.equal(pckg.id.length, 28);
        });
    });
});