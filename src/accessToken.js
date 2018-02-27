module.exports = class AccessToken {

    constructor(options) {
        this.wskey = options.wskey;
        this.refreshToken = options.refreshToken;
        this.grantType = options.grantType;
        this.authorizationCode = options.authorizationCode;
        this.params = {
            "accessToken": null,
            "expiresAt": null,
            "authenticatingInstitutionId": null,
            "errorCode": null,
            "principalId": null,
            "contextInstitutionId": null,
            "tokenType": null,
            "expiresIn": null,
            "principalIdns": null
        };
        const Config = require("./config.js");
        this.config = new Config();
    };

    getAccessToken() {

    }

    refresh() {
    }

    createAccessToken() {
        let context = this;
        let accessTokenURL = context.buildAccessTokenURL();
        return context.requestAccessToken(accessTokenURL)
            .then(function (response) {
                let jsonResponse = JSON.parse(response);
                context.params.accessToken = jsonResponse["access_token"];
                context.params.expiresAt = jsonResponse["expires_at"];
                context.params.authenticatingInstitutionId = jsonResponse["authenticating_institution_id"];
                context.params.errorCode = jsonResponse["error_code"];
                context.params.principalId = jsonResponse["principalID"];
                context.params.contextInstitutionId = jsonResponse["context_institution_id"];
                context.params.tokenType = jsonResponse["token_type"];
                context.params.expiresIn = jsonResponse["expires_in"];
                context.params.principalIdns = jsonResponse["principalIDNS"];
                return context;
            });
    }

    requestAccessToken(accessTokenURL) {
        let context = this;

        return new Promise(function (resolve, reject) {
            return context.wskey.getAuthorizationHeader({
                "method": "POST",
                "url": accessTokenURL,
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

        const Util = require("./util.js");
        let util = new Util();

        let accessToken = this.config.AUTHORIZATION_SERVER + "/accessToken?grant_type=" + this.grantType;

        switch (this.grantType) {
            case "refresh_token":
                accessToken += "&refresh_token=" + this.refreshToken.refreshToken;
                break;
            case "authorization_code":
                accessToken += "&code=" + this.authorizationCode
                    + "&authenticatingInstitutionId=" + this.wskey.authParams.authenticatingInstitutionId
                    + "&contextInstitutionId=" + this.wskey.authParams.contextInstitutionId
                    + "&redirect_uri=" + encodeURIComponent(this.wskey.authParams.redirectUri);
                break;
            case "client_credentials":
                accessToken +=
                    "&authenticatingInstitutionId=" + this.wskey.authParams.authenticatingInstitutionId
                    + "&contextInstitutionId=" + this.wskey.authParams.contextInstitutionId
                    + "&scope=" + encodeURIComponent(util.normalizeScope(this.wskey.authParams.scope));
                break;
            default:
                accessToken = null;
        }
        return accessToken;
    }
};