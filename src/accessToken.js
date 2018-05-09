module.exports = class AccessToken {


    constructor(grantType, options) {
        this.RefreshToken = require("./refreshToken.js");
        this.User = require("./user.js");

        this.grantType = grantType;
        this.wskey = options ? options.wskey : null;
        this.scope = options ? options.scope : null;
        this.user = options ? options.user : null;
        this.contextInstitutionId = options ? options.contextInstitutionId : null;
        this.authenticatingInstitutionId = options ? options.authenticatingInstitutionId : null;
        this.redirectUri = options ? options.redirectUri : null;
        this.code = options ? options.code : null;
        this.refreshToken = options ? options.refreshToken : null;
        this.accessTokenString = options ? options.accessTokenString : null;
        this.expiresAt = options ? options.expiresAt : null;
        this.services = options ? options.services : null;

        this.accessTokenUrl = this.buildAccessTokenURL();

        if (this.user && this.user.authenticatingInstitutionId && !this.authenticatingInstitutionId) {
            this.authenticatingInstitutionId = this.user.authenticatingInstitutionId;
        }

        if (this.wskey && this.wskey.redirectUri && !this.redirectUri) {
            this.redirectUri = this.wskey.redirectUri;
        }

        if (this.wskey && this.wskey.services && !this.scope) {
            this.scope = this.wskey.services;
        }
    };

    getAccessTokenString() {
        return this.accessTokenString;
    }

    getValue(autoRefresh) {
        let context = this;

        if (autoRefresh && this.isExpired()) {
            if (this.refreshToken.isExpired()) {
                return new Promise(function (resolve, reject) {
                    reject("Sorry you do not have a valid Access Token");
                });
            } else {
                return this.refresh();
            }
        } else {
            return new Promise(function (resolve) {
                resolve(context);
            });
        }
    }

    getCode() {
        return this.code;
    }

    setcode(code) {
        this.code = code;
    }

    getContextInstitutionID() {
        return this.contextInstitutionId;
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

    getAccessTokenUrl() {
        return this.accessTokenUrl;
    }

    isExpired() {
        if (this.expiresAt) {
            return new Date(this.expiresAt) - new Date() <= 0;
        }
        return true;
    }

    refresh() {
        const context = this;

        this.grantType = "refresh_token";
        this.accessTokenUrl = this.buildAccessTokenURL();

        let authorization = this.wskey.getHMACSignature("POST", this.accessTokenUrl, {user: this.user});

        return this.requestAccessToken(authorization, this.accessTokenUrl)
            .then(function (response) {
                let jsonResponse = JSON.parse(response);
                context.accessToken = jsonResponse["access_token"];
                context.expiresAt = jsonResponse["expires_at"];
                context.errorCode = jsonResponse["error_code"];
                context.contextInstitutionId = jsonResponse["context_institution_id"];
                context.tokenType = jsonResponse["token_type"];
                context.expiresIn = jsonResponse["expires_in"];
                context.user.principalID = jsonResponse["principalID"];
                context.user.principalIDNS = jsonResponse["principalIDNS"];
                context.user.authenticatingInstitutionId = jsonResponse["authenticating_institution_id"];
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

    create(wskey, user) {

        const context = this;

        this.wskey = wskey;
        this.user = user ? user : new this.User();

        let authorization = this.wskey.getHMACSignature("POST", this.accessTokenUrl, {user: this.user});

        return this.requestAccessToken(authorization, this.accessTokenUrl)
            .then(function (response) {

                let jsonResponse = JSON.parse(response);
                context.accessTokenString = jsonResponse["access_token"];
                context.expiresAt = jsonResponse["expires_at"];
                context.errorCode = jsonResponse["error_code"];
                context.contextInstitutionId = jsonResponse["context_institution_id"];
                context.tokenType = jsonResponse["token_type"];
                context.expiresIn = jsonResponse["expires_in"];
                context.user.principalID = jsonResponse["principalID"];
                context.user.principalIDNS = jsonResponse["principalIDNS"];
                context.user.authenticatingInstitutionId = jsonResponse["authenticating_institution_id"];
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

    requestAccessToken(authorization, url) {

        return new Promise(function (resolve, reject) {
            const options = {
                "url": url,
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
        })
    }

    buildAccessTokenURL() {

        const Util = require("./util.js");
        const Config = require("./config.js");
        const config = new Config();

        let accessTokenUrl = (typeof AUTHORIZATION_SERVER_OVERRIDE !== "undefined" ? AUTHORIZATION_SERVER_OVERRIDE : config.AUTHORIZATION_SERVER) + "/accessToken?grant_type=" + this.grantType;

        switch (this.grantType) {
            case "refresh_token":
                accessTokenUrl += "&refresh_token=" + this.refreshToken.refreshToken;
                break;
            case "authorization_code":
                accessTokenUrl += "&code=" + this.code
                    + "&authenticatingInstitutionId=" + this.authenticatingInstitutionId
                    + "&contextInstitutionId=" + this.contextInstitutionId
                    + "&redirect_uri=" + this.redirectUri;
                break;
            case "client_credentials":
                accessTokenUrl +=
                    "&authenticatingInstitutionId=" + this.authenticatingInstitutionId
                    + "&contextInstitutionId=" + this.contextInstitutionId
                    + "&scope=" + Util.normalizeScope(this.scope);
                break;
            default:
                accessTokenUrl = null;
        }

        return accessTokenUrl;
    }
};