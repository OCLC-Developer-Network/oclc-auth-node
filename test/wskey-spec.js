const WSKey = require("../src/wskey.js");
const User = require("../src/user.js");

describe("HMAC Hashing", function () {

    const wskey = new WSKey({
        "clientId": "7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOyH3",
        "secret": "eUK5Qz9AdsZQrCPRRliBzQ==",
        "contextInstitutionId": "128807",
        "redirectUri": "http://localhost/auth/",
        "responseType": "code",
        "scope": ["WMS_CIRCULATION", "WMS_NCIP"]
    });

    const user = new User({
        "principalId": "wera9f92-3751-4r1c-r78a-d78d13df26b1",
        "principalIdns": "urn:oclc:wms:da",
        "authenticatingInstitutionId": "128807"
    });

    it("should generate a signature",
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

    it("should get the query parameters", function () {

        expect(wskey.getQueryParameters("http://www.tallgeorge.com")).toEqual("");
        expect(wskey.getQueryParameters("http://www.tallgeorge.com?")).toEqual("");
        expect(wskey.getQueryParameters("http://www.tallgeorge.com#stuffAfterTheHashMark")).toEqual("");
        expect(wskey.getQueryParameters("http://www.tallgeorge.com?howTall=tooTall")).toEqual("howTall=tooTall\n");
        expect(wskey.getQueryParameters("http://www.tallgeorge.com?howTall=tooTall#stuffAfterTheHashMark")).toEqual("howTall=tooTall\n");
        expect(wskey.getQueryParameters("http://www.tallgeorge.com?howTall=tooTall&anotherOne=true"))
            .toEqual("anotherOne=true\nhowTall=tooTall\n")
    });

    it("should properly escape query parameters", function () {
        expect(wskey.getQueryParameters("http://www.tallgeorge.com?q=:!'()* harry potter")).toEqual("q=%3A%21%27%28%29%2A%20harry%20potter\n");
    });

    it("should generate an Authorization Header", function (done) {

        const expectedAuthorizationHeader = 'http://www.worldcat.org/wskey/v2/hmac/v1 clientId="7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOyH3", timestamp="1518632079", nonce="a9bebe15", signature="OSiEqkmYyN8hECElYMNrQvg+qL6PbI05zwzdMS8ZAfg=", principalId="wera9f92-3751-4r1c-r78a-d78d13df26b1", principalIdns="urn:oclc:wms:da"';

        wskey.getAuthorizationHeader(
            {
                url: "https://128807.share.worldcat.org/circ/pulllist/129479?startIndex=1&itemsPerPage=1",
                method: "GET",
                timeStamp: "1518632079",
                nonce: "a9bebe15",
                user: user
            })
            .then(
                function (authorizationHeader) {
                    expect(authorizationHeader).toEqual(expectedAuthorizationHeader);
                    done();
                }
            )
            .catch(
                function (error) {
                    fail(error);
                    done();
                }
            );
    });

    it("should generate an authorization code url", function () {

        const expectedLoginURL = "https://authn.sd00.worldcat.org/oauth2/authorizeCode?client_id=7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOyH3&authenticatingInstitutionId=128807&contextInstitutionId=128807&redirect_uri=http%3A%2F%2Flocalhost%2Fauth%2F&response_type=code&scope=WMS_CIRCULATION%20WMS_NCIP";

        expect(wskey.getLoginURL({user: user})).toEqual(expectedLoginURL);
    });
});
