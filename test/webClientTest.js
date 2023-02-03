import UmlWebClient from "../lib/umlClient.js";
import assert from 'assert';

describe("WebClientTest", function () {
    describe("postElement", function() {
        it("should connect to server and ask server to create package for it", async function() {
            let client = new UmlWebClient(); // i think this might only work in browser, TODO setup in browser
            let pckg = await client.post('package');
            assert.equal(pckg.id.length, 28);
        });
    });
});