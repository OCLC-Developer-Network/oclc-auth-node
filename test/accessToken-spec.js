const AccessToken = require("../src/accessToken.js");
const Wskey = require("../src/wskey.js");
const RefreshToken = require("../src/refreshToken.js");
const User = require("../src/user.js");

describe("Access Token", function () {

    const wskey = new Wskey({
        "clientId": "7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOyH3",
        "secret": "eUK5Qz9AdsZQrCPRRliBzQ==",
        "contextInstitutionId": "128807",
        "redirectUri": "http://localhost/auth/",
        "responseType": "code",
        "scope": ["WMS_CIRCULATION", "WMS_NCIP"]
    });

    const user = new User({
        "authenticatingInstitutionId": "128807",
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
                "refreshToken": refreshToken,
                "user": user
            }),
            expectedAccessTokenURL = "https://authn.sd00.worldcat.org/oauth2/accessToken?" +
                "grant_type=refresh_token" +
                "&refresh_token=rt_123456";

        expect(accessToken.buildAccessTokenURL()).toEqual(expectedAccessTokenURL);
    });

    it("should build an authorization_code token access url", function () {

        const accessToken = new AccessToken({
                wskey: wskey,
                grantType: "authorization_code",
                authorizationCode: "auth_Ztm8UjLSKpP5V0Gskgev3v2G21sfGx18vxtA",
                user: user
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

        const accessToken = new AccessToken({
                wskey: wskey,
                grantType: "client_credentials",
                user: user
            }),
            expectedAccessTokenURL = "https://authn.sd00.worldcat.org/oauth2/accessToken?" +
                "grant_type=client_credentials" +
                "&authenticatingInstitutionId=128807" +
                "&contextInstitutionId=128807" +
                "&scope=WMS_CIRCULATION WMS_NCIP";

        expect(accessToken.buildAccessTokenURL()).toEqual(expectedAccessTokenURL);
    });

    it("should return the user", function () {
        const accessToken = new AccessToken({
            wskey: wskey,
            grantType: "authorization_code",
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
        accessToken.params.expiresAt = "2017-01-01 13:00:00Z";
        expect(accessToken.isExpired()).toBeTruthy();

        // Token is not expired, date later than now
        accessToken.params.expiresAt = "2038-01-01 13:00:00Z";
        expect(accessToken.isExpired()).not.toBeTruthy();

    });

    it("should detect if the refresh token is expired",function(){

        const wskey = new Wskey({
            "clientId": "7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOyH3",
            "secret": "eUK5Qz9AdsZQrCPRRliBzQ==",
            "contextInstitutionId": "128807",
            "redirectUri": "http://localhost/auth/",
            "responseType": "code",
            "scope": ["WMS_CIRCULATION", "WMS_NCIP", "refresh_token"]
        });
        const accessToken = new AccessToken({wskey:wskey});

        // useRefreshTokens is true but there is no token
        expect(accessToken.isRefreshTokenExpired()).toBeTruthy();

        // useRefreshTokens is true but there is no refresh token
        accessToken.params.accessToken = "tk_aprcZaw2cx67G4RPyCaeqiRBvqlVTU4Cfufj";
        accessToken.useRefreshTokens = true;
        expect(accessToken.isRefreshTokenExpired()).toBeTruthy();

        // useRefreshTokens is true and there is a refresh token that is expired
        accessToken.params.refreshToken = {
            "refreshToken": "rt_bJTBHFohtNEWlcLGe9iYMzxGxndq7hQsVm62",
            "expiresIn": 604799,
            "expiresAt": "2017-01-01 15:00:00Z"
        };
        expect(accessToken.isRefreshTokenExpired()).toBeTruthy();

        // useRefreshTokens is true and there is a refresh token that is not expired
        accessToken.params.refreshToken = {
            "refreshToken": "rt_bJTBHFohtNEWlcLGe9iYMzxGxndq7hQsVm62",
            "expiresIn": 604799,
            "expiresAt": "2030-01-01 15:00:00Z"
        };

        expect(accessToken.isRefreshTokenExpired()).not.toBeTruthy();
    });

});