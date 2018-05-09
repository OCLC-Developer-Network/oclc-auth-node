module.exports = class Wskey {

    constructor(key, secret, options) {

        this.AuthCode = require("./authCode.js");
        this.User = require("./user.js");

        this.key = key;
        this.secret = secret;

        this.services = options && options.services ? options.services : null;
        this.redirectUri = options && options.redirectUri ? options.redirectUri : null;

        this.user = null;
        this.bodyHash = "";

        this.error = null;

        if (!this.key || this.key === "") {
            this.error = "Error: Key must have a value.";
        }
        if (!this.secret || this.secret === "") {
            this.error = "Error: Secret must have a value.";
        }
    }

    getKey() {
        return this.key;
    }

    getSecret() {
        return this.secret;
    }

    getRedirectUri() {
        return this.redirectUri;
    }

    getServices() {
        return this.services;
    }

    getContextInstitutionId() {
        return this.contextInstitutionId;
    }

    getSignedRequest() {
        return this.signedRequest;
    }

    getLoginURL(authenticatingInstitutionId, contextInstitutionId, state) {

        let authCode = new this.AuthCode(this.key, this.redirectUri, this.services,
            {
                authenticatingInstitutionId: authenticatingInstitutionId,
                contextInstitutionId: contextInstitutionId,
                state: state ? state : null
            }
        );
        return authCode.getLoginUrl();
    }

    getAccessTokenWithAuthCode(authCode, authenticatingInstitutionId, contextInstitutionId) {

        const options = {
            authenticatingInstitutionId: authenticatingInstitutionId,
            contextInstitutionId: contextInstitutionId,
            code: authCode,
            redirectUri: this.redirectUri
        };

        return this.getAccessToken("authorization_code", options);
    }

    getAccessTokenWithClientCredentials(authenticatingInstitutionId, contextInstitutionId, user) {

        const options = {
            authenticatingInstitutionId: authenticatingInstitutionId,
            contextInstitutionId: contextInstitutionId,
            scope: this.services
        };

        this.user = user ? user : new this.User({});

        this.user.authenticatingInstitutionId = this.user.authenticatingInstitutionId ?
            this.user.authenticatingInstitutionId : authenticatingInstitutionId;

        return this.getAccessToken("client_credentials", options, this.user);
    }

    getAccessToken(grantType, options, user) {
        const AccessToken = require("./accessToken.js");
        let accessToken = new AccessToken(grantType, options);

        return accessToken.create(this, user);
    }

    getHMACSignature(method, request_url, options) {

        const Config = require("./config.js");
        const config = new Config();

        const q = "\"";
        const qc = "\", ";

        const nonce = options && options.nonce ? options.nonce : Math.round(Math.random() * 4294967295);
        const timestamp = options && options.timestamp ? options.timestamp : Math.round((new Date()).getTime() / 1000);

        if (options) {
            for (let parameter in options) {
                this[parameter] = options[parameter];
            }
        }

        this.signedRequest = Wskey.signRequest(this.key, this.secret, method, request_url, this.bodyHash, timestamp, nonce);

        let auth_header = (typeof HMAC_AUTHORIZATION_URL_OVERRIDE !== "undefined" ? HMAC_AUTHORIZATION_URL_OVERRIDE : config.HMAC_AUTHORIZATION_URL) + " "
            + "clientID=" + q + this.key + qc
            + "timestamp=" + q + timestamp + qc
            + "nonce=" + q + nonce + qc
            + "signature=" + q + this.signedRequest;

        if (!this.user && this.authenticatingInstitutionId && this.principalID && this.principalIDNS) {
            this.user = new this.User(this.authenticatingInstitutionId, this.principalID, this.principalIDNS);
        }

        if (this.user) {
            auth_header += qc + this.addAuthParams(this.user);
        } else {
            auth_header += q;
        }

        return auth_header;

    }

    static signRequest(key, secret, method, request_url, bodyHash, timestamp, nonce) {
        const crypto = require("crypto");
        const hmac = crypto.createHmac('sha256', secret ? secret : "");

        hmac.update(Wskey.normalizeRequest(key, method, request_url, bodyHash, timestamp, nonce));
        return new Buffer(hmac.digest()).toString('base64');
    }

    static normalizeRequest(key, method, request_url, bodyHash, timestamp, nonce) {

        if (!bodyHash) {
            bodyHash = "";
        }

        return key + "\n"
            + timestamp + "\n"
            + nonce + "\n"
            + bodyHash + "\n"
            + method + "\n"
            + "www.oclc.org" + "\n"
            + "443" + "\n"
            + "/wskey" + "\n"
            + Wskey.getQueryParameters(request_url);
    }

    /**
     * Strips off the query parameters and returns them sorted and separated by newlines.
     * @param url
     * @returns {string}
     */
    static getQueryParameters(url) {
        let queryParameters = "";
        let cleanUrl = url;
        if (cleanUrl.indexOf("#") !== -1) {
            cleanUrl = cleanUrl.split("#")[0];
        }
        if (cleanUrl.indexOf("?") !== -1) {
            let paramList = (cleanUrl.split("?")[1]).split("&");
            paramList.sort();
            paramList.forEach(function (param) {
                let name = param.split("=")[0];
                let value = param.split("=")[1];

                if (value) {
                    value = encodeURIComponent(value);

                    // encodeURIComponent fails to encode these characters, which must be manually encoded
                    // to get a properly generated HMAC signature.
                    value = value.replace(/!/g, "%21")
                        .replace(/\*/g, "%2A")
                        .replace(/'/g, "%27")
                        .replace(/\(/g, "%28")
                        .replace(/\)/g, "%29");

                    queryParameters += name + "=" + value + "\n";
                }
            });
            if (queryParameters === "\n") {
                queryParameters = "";
            }
        }
        return queryParameters;
    }

    addAuthParams(user) {
        let params = "";

        for (let parameter in user) {
            if (user && user[parameter] && parameter !== "authenticatingInstitutionId") {
                params += `${parameter}="${user[parameter]}", `;
            }
        }

        return params.replace(/,\s$/, "");
    }
};