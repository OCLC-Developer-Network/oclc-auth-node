let Hmac = require("../src/hmac.js");

describe("HMAC Hashing", function () {

    let hmac = new Hmac({
        "wskey": "7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOy5H3",
        "secret": "eUK5Qz9AdsZQrCPRRliBzQ==",
        "principalId": "wera9f92-3751-4r1c-r78a-d78d13df26b1",
        "principalIdns": "urn:oclc:wms:da"
    });

    it("Should generate a signature", function () {
        const expectedSignature = "T1ezmpr45tcm1kyGWnZdNNWOmXYNs5Yr54MbMleyEQA=";

        hmac.getSignature(
            {
                "method": "GET",
                "timeStamp": "1518554071",
                "nonce": "2d0b7d2a"
            }
            , function (signature) {
                expect(signature).toEqual(expectedSignature);
            });

    });
});