module.exports = class AccessToken {

    constructor(options) {
        this.RefreshToken = require("./refreshToken.js");
        this.User = require("./user.js");
        this.Util = require("./util.js");

        this.wskey = options ? options.wskey : null;

        this.params = {
            "accessToken": null,
            "authorizationCode": options ? options.authorizationCode : null,
            "contextInstitutionId": null,
            "errorCode": null,
            "expiresAt": null,
            "expiresIn": null,
            "grantType": options ? options.grantType : null,
            "refreshToken": options ? options.refreshToken : new this.RefreshToken(),
            "tokenType": null,
            "user": options && options.user ? options.user : new this.User()
        };
    };

    getAccessToken() {
        let context = this;

        if (context.isExpired()) {
            if (context.params.refreshToken.refreshToken) {
                return context.refresh();
            } else {
                return context.createAccessToken();
            }
        } else {
            return new Promise(function (resolve) {
                resolve(context);
            })
        }
    }

    getValue() {
        return this.params.accessToken;
    }

    getAuthorizationCode() {
        return this.params.authorizationCode;
    }

    setAuthorizationCode(authorizationCode) {
        this.params.authorizationCode = authorizationCode;
    }

    getContextInstitutionId() {
        return this.params.contextInstitutionId;
    }

    getErrorCode() {
        return this.params.errorCode;
    }

    getExpiresAt() {
        return this.params.expiresAt;
    }

    getExpiresIn() {
        return this.params.expiresIn;
    }

    getGrantType() {
        return this.params.grantType;
    }

    setGrantType(grantType) {
        this.params.grantType = grantType;
    }

    getUser() {
        return this.params.user;
    }

    setUser(user) {
        this.params.user = user;
    }

    getRefreshToken() {
        return this.params.refreshToken;
    }

    getTokenType() {
        return this.params.tokenType;
    }

    isExpired() {
        if (this.params.expiresAt) {
            return new Date(this.params.expiresAt) - new Date() <= 0;
        }
        return true;
    }

    isRefreshTokenExpired() {
        if (this.Util.scopeContainsRefreshToken(this.wskey.getScope())
            && this.params.accessToken && this.params.refreshToken
            && this.params.refreshToken.refreshToken) {
            return new Date(this.params.refreshToken.expiresAt) - new Date() <= 0;
        }
        return true;
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
                return context;
            });
    }

    requestAccessToken(accessTokenURL) {
        let context = this;

        return new Promise(function (resolve, reject) {
            return context.wskey.getAuthorizationHeader({
                method: "POST",
                url: accessTokenURL,
                user: context.params.user
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
        const Config = require("./config.js");
        const config = new Config();

        let accessToken = config.AUTHORIZATION_SERVER + "/accessToken?grant_type=" + this.params.grantType;

        switch (this.params.grantType) {
            case "refresh_token":
                accessToken += "&refresh_token=" + this.params.refreshToken.refreshToken;
                break;
            case "authorization_code":
                accessToken += "&code=" + this.params.authorizationCode
                    + "&authenticatingInstitutionId=" + this.params.user.authenticatingInstitutionId
                    + "&contextInstitutionId=" + this.wskey.authParams.contextInstitutionId
                    + "&redirect_uri=" + this.wskey.authParams.redirectUri;
                break;
            case "client_credentials":
                accessToken +=
                    "&authenticatingInstitutionId=" + this.params.user.authenticatingInstitutionId
                    + "&contextInstitutionId=" + this.wskey.authParams.contextInstitutionId
                    + "&scope=" + Util.normalizeScope(this.wskey.authParams.scope);
                break;
            default:
                accessToken = null;
        }
        return accessToken;
    }
};