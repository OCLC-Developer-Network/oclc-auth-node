module.exports = class Wskey {

    constructor(authParams) {

        if (!authParams.clientId) {
            throw "Error creating Wskey - missing clientId";
        }

        this.authParams = {
            "clientId": authParams.clientId,
            "secret": authParams.secret,
            "contextInstitutionId": authParams.contextInstitutionId,
            "redirectUri": authParams.redirectUri,
            "responseType": authParams.responseType ? authParams.responseType : null,
            "scope": authParams.scope
        };
    }

    /**
     * Calculate an HMAC signature. Options are
     *
     * method - optional, defaults to GET
     * queryParameters - optional, defaults to ""
     * bodyHash - never include, not implemented
     * timeStamp - never include, for unit testing only
     * nonce - never include, for unit testing only
     * queryParameters - of the form "", defaults to ""
     * @param options
     * @param cb
     */
    getSignature(options, cb) {

        const crypto = require("crypto");
        const hmac = crypto.createHmac('sha256', this.authParams.secret);

        let randNonce = Math.round(Math.random() * 4294967295);
        let nonce = options.nonce ? options.nonce : randNonce.toString();

        let linuxTimeStamp = Math.round((new Date()).getTime() / 1000);
        let timeStamp = options.timeStamp ? options.timeStamp : linuxTimeStamp.toString();

        let method = options.method ? options.method : "GET";

        let queryParameters = options.queryParameters ? options.queryParameters : "";

        let bodyHash = options.bodyHash ? options.bodyHash : "";

        let normalizedRequest = this.authParams.clientId + "\n"
            + timeStamp + "\n"
            + nonce + "\n"
            + bodyHash + "\n"
            + method + "\n"
            + "www.oclc.org" + "\n"
            + "443" + "\n"
            + "/wskey" + "\n"
            + queryParameters;

        hmac.on('readable', () => {
            const hmacHash = hmac.read();
            if (hmacHash) {
                let signature = new Buffer(hmacHash).toString('base64');
                cb({"signature": signature, "timeStamp": timeStamp, "nonce": nonce});
            }
        });
        hmac.write(normalizedRequest);
        hmac.end();
    }

    /**
     * REturn the authorization URL required for the authorization header
     * @returns {string}
     */
    getHmacAuthorizationUrl() {
        return "http://www.worldcat.org/wskey/v2/hmac/v1";
    }

    /**
     * Strips off the query parameters and returns them sorted and separated by newlines.
     * @param url
     * @returns {string}
     */
    getQueryParameters(url) {
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

    /**
     * Calculates the authorizationHeader
     * @param options
     * @param cb
     */
    getAuthorizationHeaderCallback(options, cb) {
        const q = "\"";
        const qc = "\", ";
        const context = this;
        context.getSignature({
            "method": options.method,
            "queryParameters": context.getQueryParameters(options.url),
            "timeStamp": options.timeStamp,
            "nonce": options.nonce
        }, function (signature) {
            if (options.user.principalId && options.user.principalIdns) {
                cb(
                    context.getHmacAuthorizationUrl() + " "
                    + "clientId=" + q + context.authParams.clientId + qc
                    + "timestamp=" + q + signature.timeStamp + qc
                    + "nonce=" + q + signature.nonce + qc
                    + "signature=" + q + signature.signature + qc
                    + "principalId=" + q + options.user.principalId + qc
                    + "principalIdns=" + q + options.user.principalIdns + q
                )
            } else {
                // Principal ID and IDNS are missing for AuthCode hashing
                cb(
                    context.getHmacAuthorizationUrl() + " "
                    + "clientId=" + q + context.authParams.clientId + qc
                    + "timestamp=" + q + signature.timeStamp + qc
                    + "nonce=" + q + signature.nonce + qc
                    + "signature=" + q + signature.signature + q
                )
            }
        });
    }

    /**
     * Promise form of getAuthorization Header
     * @param options
     * @returns {Promise<any>}
     */
    getAuthorizationHeader(options) {
        let context = this;
        return new Promise(function (resolve, reject) {
            context.getAuthorizationHeaderCallback(options, function (authorizationHeader) {
                resolve(authorizationHeader);
            });
        });
    }
};