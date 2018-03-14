describe("HMAC Hashing", function () {

    const Wskey = require("../src/wskey.js");
    const User = require("../src/user.js");

    const user = new User({
        "principalID": "wera9f92-3751-4r1c-r78a-d78d13df26b1",
        "principalIDNS": "urn:oclc:wms:da",
        "authenticatingInstitutionID": "128807"
    });

    const wskey = new Wskey(
        "7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOyH3",
        "eUK5Qz9AdsZQrCPRRliBzQ==",
        {
            "contextInstitutionID": "128807",
            "redirectUri": "http://localhost/auth/",
            "services": ["WMS_CIRCULATION", "WMS_NCIP"],
            "user": user
        }
    );

    it("should sign a request", function () {

        const expectedAuthorizationHeader = 'http://www.worldcat.org/wskey/v2/hmac/v1 clientID="7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOyH3", timestamp="1518632079", nonce="a9bebe15", signature="OSiEqkmYyN8hECElYMNrQvg+qL6PbI05zwzdMS8ZAfg=", principalID="wera9f92-3751-4r1c-r78a-d78d13df26b1", principalIDNS="urn:oclc:wms:da"';

        const hmacSignature = wskey.getHMACSignature("GET",
            "https://128807.share.worldcat.org/circ/pulllist/129479?startIndex=1&itemsPerPage=1",
            {
                "timestamp": "1518632079",
                "nonce": "a9bebe15"
            });

        expect(hmacSignature).toEqual(expectedAuthorizationHeader);
    });


    it("should get a login url", function () {
        const authenticatingInstitutionId = "128807";
        const contextInstitutionId = "60000";

        const expectedLoginUrl = "https://authn.sd00.worldcat.org/oauth2/authorizeCode?client_id=7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOyH3&authenticatingInstitutionID=128807&contextInstitutionID=60000&redirect_uri=http%3A%2F%2Flocalhost%2Fauth%2F&response_type=code&scope=WMS_CIRCULATION%20WMS_NCIP";

        expect(wskey.getLoginURL(authenticatingInstitutionId, contextInstitutionId)).toEqual(expectedLoginUrl);
    });


    it("should get the query parameters", function () {

        expect(Wskey.getQueryParameters("http://www.tallgeorge.com")).toEqual("");
        expect(Wskey.getQueryParameters("http://www.tallgeorge.com?")).toEqual("");
        expect(Wskey.getQueryParameters("http://www.tallgeorge.com#stuffAfterTheHashMark")).toEqual("");
        expect(Wskey.getQueryParameters("http://www.tallgeorge.com?howTall=tooTall")).toEqual("howTall=tooTall\n");
        expect(Wskey.getQueryParameters("http://www.tallgeorge.com?howTall=tooTall#stuffAfterTheHashMark")).toEqual("howTall=tooTall\n");
        expect(Wskey.getQueryParameters("http://www.tallgeorge.com?howTall=tooTall&anotherOne=true"))
            .toEqual("anotherOne=true\nhowTall=tooTall\n")
    });

    it("should properly escape query parameters", function () {
        expect(Wskey.getQueryParameters("http://www.tallgeorge.com?q=:!'()* harry potter")).toEqual("q=%3A%21%27%28%29%2A%20harry%20potter\n");
    });


});
