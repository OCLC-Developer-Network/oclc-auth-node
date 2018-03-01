module.exports = class AccessToken {

    constructor(options) {
        this.RefreshToken = require("./refreshToken.js");
        this.User = require("./user.js");
        this.user = options.user ? options.user : new this.User();
        this.wskey = options.wskey;
        this.refreshToken = options.refreshToken;
        this.grantType = options.grantType;
        this.authorizationCode = options.authorizationCode;
        this.params = {
            "accessToken": null,
            "expiresAt": null,
            "errorCode": null,
            "contextInstitutionId": null,
            "tokenType": null,
            "expiresIn": null,
            "refreshToken": {},
            "user": new this.User()
        };
        const Config = require("./config.js");
        this.config = new Config();
    };

    getAccessToken() {

    }

    refresh() {
        const context = this;

        let newAccessToken = new AccessToken({
            wskey: this.wskey,
            refreshToken: this.params.refreshToken,
            grantType: "refresh_token",
        });
        const accessTokenURL = newAccessToken.buildAccessTokenURL();
        return newAccessToken.requestAccessToken(accessTokenURL)
            .then(function (response) {
                let jsonResponse = JSON.parse(response);
                newAccessToken.params.accessToken = jsonResponse["access_token"];
                newAccessToken.params.expiresAt = jsonResponse["expires_at"];
                newAccessToken.params.errorCode = jsonResponse["error_code"];
                newAccessToken.params.contextInstitutionId = jsonResponse["context_institution_id"];
                newAccessToken.params.tokenType = jsonResponse["token_type"];
                newAccessToken.params.expiresIn = jsonResponse["expires_in"];
                newAccessToken.params.user.principalId = jsonResponse["principalID"];
                newAccessToken.params.user.principalIdns = jsonResponse["principalIDNS"];
                newAccessToken.params.user.authenticatingInstitutionId = jsonResponse["authenticating_institution_id"];
                if (jsonResponse["refresh_token"]) {
                    newAccessToken.params.refreshToken = new context.RefreshToken({
                        refreshToken: jsonResponse["refresh_token"],
                        expiresIn: jsonResponse["refresh_token_expires_in"],
                        expiresAt: jsonResponse["refresh_token_expires_at"]
                    })
                }
                return newAccessToken;
            });
    }

    createAccessToken() {
        const context = this;
        let accessTokenURL = context.buildAccessTokenURL();
        return context.requestAccessToken(accessTokenURL)
            .then(function (response) {
                let jsonResponse = JSON.parse(response);
                context.params.accessToken = jsonResponse["access_token"];
                context.params.expiresAt = jsonResponse["expires_at"];
                context.params.errorCode = jsonResponse["error_code"];
                context.params.contextInstitutionId = jsonResponse["context_institution_id"];
                context.params.tokenType = jsonResponse["token_type"];
                context.params.expiresIn = jsonResponse["expires_in"];
                context.params.user.principalId = jsonResponse["principalID"];
                context.params.user.principalIdns = jsonResponse["principalIDNS"];
                context.params.user.authenticatingInstitutionId = jsonResponse["authenticating_institution_id"];
                if (jsonResponse["refresh_token"]) {
                    context.params.refreshToken = new context.RefreshToken({
                        refreshToken: jsonResponse["refresh_token"],
                        expiresIn: jsonResponse["refresh_token_expires_in"],
                        expiresAt: jsonResponse["refresh_token_expires_at"]
                    })
                }
            });
    }

    requestAccessToken(accessTokenURL) {
        let context = this;

        return new Promise(function (resolve, reject) {
            return context.wskey.getAuthorizationHeader({
                method: "POST",
                url: accessTokenURL,
                user: context.user
            }).then(function (authorization) {
                const options = {
                    "url": accessTokenURL,
                    "method": "POST",
                    "headers": {
                        "authorization": authorization
                    }
                };
                const rp = require('request-promise-native');
                return rp(options)
                    .then(function (response, body) {
                        resolve(response);
                    }).catch(function (err) {
                        reject(err);
                    });
            }).catch(function (err) {
                reject(err);
            });
        })
    }

    buildAccessTokenURL() {

        const context = this;
        const Util = require("./util.js");
        let util = new Util();

        let accessToken = this.config.AUTHORIZATION_SERVER + "/accessToken?grant_type=" + this.grantType;

        switch (this.grantType) {
            case "refresh_token":
                accessToken += "&refresh_token=" + this.refreshToken.refreshToken;
                break;
            case "authorization_code":
                accessToken += "&code=" + this.authorizationCode
                    + "&authenticatingInstitutionId=" + context.user.authenticatingInstitutionId
                    + "&contextInstitutionId=" + this.wskey.authParams.contextInstitutionId
                    + "&redirect_uri=" + encodeURIComponent(this.wskey.authParams.redirectUri);
                break;
            case "client_credentials":
                accessToken +=
                    "&authenticatingInstitutionId=" + context.user.authenticatingInstitutionId
                    + "&contextInstitutionId=" + this.wskey.authParams.contextInstitutionId
                    + "&scope=" + encodeURIComponent(util.normalizeScope(this.wskey.authParams.scope));
                console.log(accessToken);
                break;
            default:
                accessToken = null;
        }
        return accessToken;
    }
};