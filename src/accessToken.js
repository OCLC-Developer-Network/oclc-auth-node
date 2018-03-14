module.exports = class AccessToken {


    constructor(grantType, options) {
        this.RefreshToken = require("./refreshToken.js");
        this.User = require("./user.js");
        this.Util = require("./util.js");

        this.grantType = grantType;
        this.wskey = options ? options.wskey : null;
        this.scope = options ? options.scope : null;
        this.contextInstitutionID = options ? options.contextInstitutionID : null;
        this.redirectUri = options ? options.redirectUri : null;
        this.code = options ? options.code : null;
        this.refreshToken = options ? options.refreshToken : null;
        this.accessTokenString = options ? options.accessTokenString : null;
        this.expiresAt = options ? options.expiresAt : null;
        this.user = options ? options.user : null;
    };

    getAccessToken() {
        let context = this;

        if (this.isExpired()) {
            if (this.refreshToken.getValue()) {
                return this.refresh();
            } else {
                return this.createAccessToken();
            }
        } else {
            return new Promise(function (resolve) {
                resolve(context);
            })
        }
    }

    getValue() {
        return this.accessTokenString;
    }

    getCode() {
        return this.code;
    }

    setcode(code) {
        this.code = code;
    }

    getContextInstitutionID() {
        return this.contextInstitutionID;
    }

    getErrorCode() {
        return this.errorCode;
    }

    getExpiresAt() {
        return this.expiresAt;
    }

    getExpiresIn() {
        return this.expiresIn;
    }

    getGrantType() {
        return this.grantType;
    }

    setGrantType(grantType) {
        this.grantType = grantType;
    }

    getUser() {
        return this.user;
    }

    setUser(user) {
        this.user = user;
    }

    getRefreshToken() {
        return this.refreshToken;
    }

    getTokenType() {
        return this.tokenType;
    }

    getScope() {
        return this.scope;
    }

    isExpired() {
        if (this.expiresAt) {
            return new Date(this.expiresAt) - new Date() <= 0;
        }
        return true;
    }

    isRefreshTokenExpired() {
        if (this.Util.scopeContainsRefreshToken(this.getScope())
            && this.getValue() && this.refreshToken && this.refreshToken.getValue()) {
            return new Date(this.refreshToken.expiresAt) - new Date() <= 0;
        }
        return true;
    }

    refresh() {
        const context = this;

        let newAccessToken = new AccessToken("refresh_token", {
            wskey: this.wskey,
            refreshToken: this.refreshToken
        });
        const accessTokenURL = newAccessToken.buildAccessTokenURL();
        return newAccessToken.requestAccessToken(accessTokenURL)
            .then(function (response) {
                let jsonResponse = JSON.parse(response);
                newAccessToken.accessToken = jsonResponse["access_token"];
                newAccessToken.expiresAt = jsonResponse["expires_at"];
                newAccessToken.errorCode = jsonResponse["error_code"];
                newAccessToken.contextInstitutionID = jsonResponse["context_institution_id"];
                newAccessToken.tokenType = jsonResponse["token_type"];
                newAccessToken.expiresIn = jsonResponse["expires_in"];
                newAccessToken.user.principalID = jsonResponse["principalID"];
                newAccessToken.user.principalIDNS = jsonResponse["principalIDNS"];
                newAccessToken.user.authenticatingInstitutionID = jsonResponse["authenticating_institution_id"];
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

    create(wskey, user) {

        const context = this;

        this.wskey = wskey;
        this.user = user ? user : new User();

        let accessTokenURL = context.buildAccessTokenURL();

        return context.requestAccessToken(accessTokenURL)
            .then(function (response) {
                let jsonResponse = JSON.parse(response);
                context.accessToken = jsonResponse["access_token"];
                context.expiresAt = jsonResponse["expires_at"];
                context.errorCode = jsonResponse["error_code"];
                context.contextInstitutionID = jsonResponse["context_institution_id"];
                context.tokenType = jsonResponse["token_type"];
                context.expiresIn = jsonResponse["expires_in"];
                context.user.principalID = jsonResponse["principalID"];
                context.user.principalIDNS = jsonResponse["principalIDNS"];
                context.user.authenticatingInstitutionID = jsonResponse["authenticating_institution_id"];
                if (jsonResponse["refresh_token"]) {
                    context.refreshToken = new context.RefreshToken({
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

        const Util = require("./util.js");
        const Config = require("./config.js");
        const config = new Config();

        let accessToken = config.AUTHORIZATION_SERVER + "/accessToken?grant_type=" + this.grantType;

        switch (this.grantType) {
            case "refresh_token":
                accessToken += "&refresh_token=" + this.refreshToken.refreshToken;
                break;
            case "authorization_code":
                accessToken += "&code=" + this.code
                    + "&authenticatingInstitutionID=" + this.user.authenticatingInstitutionID
                    + "&contextInstitutionID=" + this.wskey.contextInstitutionID
                    + "&redirect_uri=" + this.wskey.redirectUri;
                break;
            case "client_credentials":
                accessToken +=
                    "&authenticatingInstitutionID=" + this.user.authenticatingInstitutionID
                    + "&contextInstitutionID=" + this.wskey.contextInstitutionID
                    + "&scope=" + Util.normalizeScope(this.wskey.services);
                break;
            default:
                accessToken = null;
        }
        return accessToken;
    }
};