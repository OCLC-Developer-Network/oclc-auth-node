const Wskey = require("../src/wskey.js");

describe("HMAC Hashing", function () {

    const wskey = new Wskey({
        "clientId": "7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOyH3",
        "secret": "eUK5Qz9AdsZQrCPRRliBzQ==",
        "principalId": "wera9f92-3751-4r1c-r78a-d78d13df26b1",
        "principalIdns": "urn:oclc:wms:da",
        "authenticatingInstitutionId": "128807",
        "contextInstitutionId": "128807",
        "redirectUri": "http://localhost/auth/",
        "responseType": "code",
        "scope": ["WMS_CIRCULATION", "WMS_NCIP"]
    });

    it("Should generate a signature",
        function () {
            const expectedSignature = "mntXkyX2fxGtd1Ool9G8MxbBG9Rx7R8MI5IK3hgYnZA=";

            wskey.getSignature(
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

        expect(wskey.getQueryParameters("http://www.tallgeorge.com")).toEqual("");
        expect(wskey.getQueryParameters("http://www.tallgeorge.com?")).toEqual("");
        expect(wskey.getQueryParameters("http://www.tallgeorge.com#stuffAfterTheHashMark")).toEqual("");
        expect(wskey.getQueryParameters("http://www.tallgeorge.com?howTall=tooTall")).toEqual("howTall=tooTall\n");
        expect(wskey.getQueryParameters("http://www.tallgeorge.com?howTall=tooTall#stuffAfterTheHashMark")).toEqual("howTall=tooTall\n");
        expect(wskey.getQueryParameters("http://www.tallgeorge.com?howTall=tooTall&anotherOne=true"))
            .toEqual("anotherOne=true\nhowTall=tooTall\n");
    });

    it("Should generate an Authorization Header", function () {

        const expectedAuthorizationHeader = 'http://www.worldcat.org/wskey/v2/hmac/v1 clientId="7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOyH3", timestamp="1518632079", nonce="a9bebe15", signature="OSiEqkmYyN8hECElYMNrQvg+qL6PbI05zwzdMS8ZAfg=", principalId="wera9f92-3751-4r1c-r78a-d78d13df26b1", principalIdns="urn:oclc:wms:da"';

        wskey.getAuthorizationHeader(
            {
                "url": "https://128807.share.worldcat.org/circ/pulllist/129479?startIndex=1&itemsPerPage=1",
                "method": "GET",
                "timeStamp": "1518632079",
                "nonce": "a9bebe15"
            }).then(function (authorizationHeader) {
            expect(authorizationHeader).toEqual(expectedAuthorizationHeader);
        });
    });

    it("should generate an authorization code url", function () {

        const expectedLoginURL = "https://authn.sd00.worldcat.org/oauth2/authorizeCode?client_id=7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOyH3&authenticatingInstitutionId=128807&contextInstitutionId=128807&redirect_uri=http%3A%2F%2Flocalhost%2Fauth%2F&response_type=code&scope=WMS_CIRCULATION%20WMS_NCIP";

        expect(wskey.getLoginURL()).toEqual(expectedLoginURL);
    });
});
