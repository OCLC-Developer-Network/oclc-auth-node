module.exports = class Wskey {

    constructor(key, secret, options) {

        this.key = key;
        this.secret = secret;

        this.services = options && options.services ? options.services : null;
        this.redirectUri = options && options.redirectUri ? options.redirectUri : null;
        this.user = options && options.user ? options.user : null;
        this.bodyHash = options && options.bodyHash && options.bodyHash ? options.bodyHash : "";
        this.contextInstitutionID = options && options.contextInstitutionID ? options.contextInstitutionID: null;
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
        return this.contextInstitutionID;
    }

    getSignedRequest() {
        return this.signedRequest;
    }

    getLoginURL(authenticatingInstitutionID, contextInstitutionID) {

        const AuthCode = require("./authCode.js");

        let authCode = new AuthCode({
            clientID: this.key,
            authenticatingInstitutionID: authenticatingInstitutionID,
            contextInstitutionID: contextInstitutionID,
            redirectUri: this.redirectUri,
            scope: this.services
        });
        return authCode.getLoginUrl();
    }

    getAccessTokenWithAuthCode(authCode, authenticatingInstitutionID, contextInstitutionID) {
        // todo
    }

    getAccessTokenWithClientCredentials(authenticatingInstitutionID, contextInstitutionID, user) {

        this.user = user ? user : null;
        // todo
    }

    getHMACSignature(method, request_url, options) {

        const Config = require("./config.js");
        const config = new Config();

        const q = "\"";
        const qc = "\", ";

        const nonce = options && options.nonce ? options.nonce : Math.round(Math.random() * 4294967295);
        const timestamp = options && options.timestamp ? options.timestamp : Math.round((new Date()).getTime() / 1000);

        this.signedRequest = Wskey.signRequest(this.key, this.secret, method, request_url, this.bodyHash, timestamp, nonce);

        let auth_header = config.HMAC_AUTHORIZATION_URL + " "
            + "clientID=" + q + this.key + qc
            + "timestamp=" + q + timestamp + qc
            + "nonce=" + q + nonce + qc
            + "signature=" + q + this.signedRequest;

        if (this.user) {
            auth_header += qc
                + "principalID=" + q + this.user.principalID + qc
                + "principalIDNS=" + q + this.user.principalIDNS;
        }

        auth_header += q;

        return auth_header;

    }

    static signRequest(key, secret, method, request_url, bodyHash, timestamp, nonce) {
        const crypto = require("crypto");
        const hmac = crypto.createHmac('sha256', secret);

        hmac.update(Wskey.normalizeRequest(key, method, request_url, bodyHash, timestamp, nonce));
        return new Buffer(hmac.digest()).toString('base64');
    }

    static normalizeRequest(key, method, request_url, bodyHash, timestamp, nonce) {
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

    addAuthParams(user, authParams) {
        //todo - not needed?
    }

    getAccessToken(grantType, options, user) {
        this.user = user ? user : null;
        //todo
    }
};