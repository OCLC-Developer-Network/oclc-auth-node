const AccessToken = require("../src/accessToken.js");
const Wskey = require("../src/wskey.js");
const RefreshToken = require("../src/refreshToken.js");
const User = require("../src/user.js");

describe("Access Token methods", function () {

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

    it("should build a refresh_token token access url", function () {

        const refreshToken = new RefreshToken({
                "refreshToken": "rt_123456",
                "expiresIn": "15000",
                "expiresAt": "2018-01-01 00:00:01Z"
            }),
            accessToken = new AccessToken({
                "wskey": wskey,
                "grantType": "refresh_token",
                "refreshToken": refreshToken
            }),
            expectedAccessTokenURL = "https://authn.sd00.worldcat.org/oauth2/accessToken?" +
                "grant_type=refresh_token" +
                "&refresh_token=rt_123456";

        expect(accessToken.buildAccessTokenURL()).toEqual(expectedAccessTokenURL);
    });

    it("should build an authorization_code token access url", function () {

        const accessToken = new AccessToken({
                "wskey": wskey,
                "grantType": "authorization_code",
                "authorizationCode": "auth_Ztm8UjLSKpP5V0Gskgev3v2G21sfGx18vxtA"
            }),
            expectedAccessTokenURL = "https://authn.sd00.worldcat.org/oauth2/accessToken?" +
                "grant_type=authorization_code" +
                "&code=auth_Ztm8UjLSKpP5V0Gskgev3v2G21sfGx18vxtA" +
                "&authenticatingInstitutionId=128807" +
                "&contextInstitutionId=128807" +
                "&redirect_uri=http%3A%2F%2Flocalhost%2Fauth%2F";

        expect(accessToken.buildAccessTokenURL()).toEqual(expectedAccessTokenURL);
    });

    it("should build a client_credentials token access url", function () {

        const accessToken = new AccessToken({
                "wskey": wskey,
                "grantType": "client_credentials"
            }),
            expectedAccessTokenURL = "https://authn.sd00.worldcat.org/oauth2/accessToken?" +
                "grant_type=client_credentials" +
                "&authenticatingInstitutionId=128807" +
                "&contextInstitutionId=128807" +
                "&scope=WMS_CIRCULATION%20WMS_NCIP";

        expect(accessToken.buildAccessTokenURL()).toEqual(expectedAccessTokenURL);
    });

});