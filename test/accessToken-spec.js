const AccessToken = require("../src/accessToken.js");
const Wskey = require("../src/wskey.js");
const RefreshToken = require("../src/refreshToken.js");
const User = require("../src/user.js");

describe("Access Token", function () {

    const key = "7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOyH3";
    const secret = "eUK5Qz9AdsZQrCPRRliBzQ==";
    const authenticatingInstitutionId = "128807";
    const contextInstitutionId = "128807";

    const user = new User("128807");

    const wskey = new Wskey(key, secret,
        {
            "redirectUri": "http://localhost/auth/",
            "services": ["WMS_CIRCULATION", "WMS_NCIP"],
        });

    it("should build a refresh_token token access url", function () {

        const refreshToken = new RefreshToken({
                "refreshToken": "rt_123456",
                "expiresIn": "15000",
                "expiresAt": "2018-01-01 00:00:01Z"
            }),
            accessToken = new AccessToken("refresh_token", {
                "wskey": wskey,
                "refreshToken": refreshToken,
                "user": user
            }),
            expectedAccessTokenURL = "https://authn.sd00.worldcat.org/oauth2/accessToken?" +
                "grant_type=refresh_token" +
                "&refresh_token=rt_123456";

        expect(accessToken.buildAccessTokenURL()).toEqual(expectedAccessTokenURL);
    });

    it("should build an authorization_code token access url", function () {

        const accessToken = new AccessToken("authorization_code", {
                wskey: wskey,
                code: "auth_Ztm8UjLSKpP5V0Gskgev3v2G21sfGx18vxtA",
                user: user,
                contextInstitutionId: contextInstitutionId
            }),
            expectedAccessTokenURL = "https://authn.sd00.worldcat.org/oauth2/accessToken?" +
                "grant_type=authorization_code" +
                "&code=auth_Ztm8UjLSKpP5V0Gskgev3v2G21sfGx18vxtA" +
                "&authenticatingInstitutionId=128807" +
                "&contextInstitutionId=128807" +
                "&redirect_uri=http://localhost/auth/";

        expect(accessToken.buildAccessTokenURL()).toEqual(expectedAccessTokenURL);
    });

    it("should build a client_credentials token access url", function () {

        const accessToken = new AccessToken("client_credentials", {
                wskey: wskey,
                user: user,
                contextInstitutionId: contextInstitutionId
            }),
            expectedAccessTokenURL = "https://authn.sd00.worldcat.org/oauth2/accessToken?" +
                "grant_type=client_credentials" +
                "&authenticatingInstitutionId=128807" +
                "&contextInstitutionId=128807" +
                "&scope=WMS_CIRCULATION WMS_NCIP";

        expect(accessToken.buildAccessTokenURL()).toEqual(expectedAccessTokenURL);
    });

    it("should return the user", function () {
        const accessToken = new AccessToken("authorization_code", {
            wskey: wskey,
            authorizationCode: "auth_Ztm8UjLSKpP5V0Gskgev3v2G21sfGx18vxtA",
            user: user
        });

        expect(accessToken.getUser()).toEqual(user);
    });

    it("should detect if the token is expired", function () {
        const accessToken = new AccessToken({});

        // No token - .expiresAt is null
        expect(accessToken.isExpired()).toBeTruthy();

        // Token is expired - date before now
        accessToken.expiresAt = "2017-01-01 13:00:00Z";
        expect(accessToken.isExpired()).toBeTruthy();

        // Token is not expired, date later than now
        accessToken.expiresAt = "2038-01-01 13:00:00Z";
        expect(accessToken.isExpired()).not.toBeTruthy();

    });

});