let Hmac = require("../src/hmac.js");

describe("HMAC Hashing", function () {

    const hmac = new Hmac({
        "wskey": "7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOy5H3",
        "secret": "eUK5Qz9AdsZQrCPRRliBzQ==",
        "principalId": "wera9f92-3751-4r1c-r78a-d78d13df26b1",
        "principalIdns": "urn:oclc:wms:da"
    });

    it("Should generate a signature",
        function () {
            const expectedSignature = "T1ezmpr45tcm1kyGWnZdNNWOmXYNs5Yr54MbMleyEQA=";

            hmac.getSignature(
                {
                    "method": "GET",
                    "timeStamp": "1518554071",
                    "nonce": "2d0b7d2a",
                    "queryParameters": "",
                    "bodyHash": ""
                }
                , function (signature) {
                    expect(signature.signature).toEqual(expectedSignature);
                    expect(signature.timeStamp).toEqual("1518554071");
                    expect(signature.nonce).toEqual("2d0b7d2a");
                });

        });

    it("Should get the query parameters", function () {
        expect(hmac.getQueryParameters("http://www.tallgeorge.com")).toEqual("");
        expect(hmac.getQueryParameters("http://www.tallgeorge.com?")).toEqual("");
        expect(hmac.getQueryParameters("http://www.tallgeorge.com#stuffAfterTheHashMark")).toEqual("");
        expect(hmac.getQueryParameters("http://www.tallgeorge.com?howTall=tooTall")).toEqual("howTall=tooTall\n");
        expect(hmac.getQueryParameters("http://www.tallgeorge.com?howTall=tooTall#stuffAfterTheHashMark")).toEqual("howTall=tooTall\n");
        expect(hmac.getQueryParameters("http://www.tallgeorge.com?howTall=tooTall&anotherOne=true"))
            .toEqual("anotherOne=true\nhowTall=tooTall\n");
    });

    it("Should generate an Authorization Header", function () {
        const expectedAuthorizationHeader = 'http://www.worldcat.org/wskey/v2/hmac/v1 clientId="7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOy5H3", timestamp="1518632079", nonce="a9bebe15", signature="VcK+9RyCHOVRCHxO7J6DzoYDQfkz56d5z4nFBKgtNts=", principalId="wera9f92-3751-4r1c-r78a-d78d13df26b1", principalIdns="urn:oclc:wms:da"';

        hmac.getAuthorizationHeader(
            {
                "url": "https://128807.share.worldcat.org/circ/pulllist/129479?startIndex=1&itemsPerPage=1",
                "method": "GET",
                "timeStamp": "1518632079",
                "nonce": "a9bebe15"
            },
            function (authorizationHeader) {
                expect(authorizationHeader).toEqual(expectedAuthorizationHeader);
            });
    });
});
