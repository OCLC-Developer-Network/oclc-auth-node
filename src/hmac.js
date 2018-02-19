module.exports = class Hmac {

    constructor(authParams) {

        this.authParams = {
            "clientId": authParams.clientId,
            "secret": authParams.secret,
            "principalId": authParams.principalId,
            "principalIdns": authParams.principalIdns
        }
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
                queryParameters += param + "\n";
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
    getAuthorizationHeader(options, cb) {
        const q = "\"";
        const qc = "\", ";
        const context = this;
        context.getSignature({
            "method": options.method,
            "queryParameters": context.getQueryParameters(options.url),
            "timeStamp": options.timeStamp,
            "nonce": options.nonce
        }, function (signature) {
            cb(
                context.getHmacAuthorizationUrl() + " "
                + "clientId=" + q + context.authParams.clientId + qc
                + "timestamp=" + q + signature.timeStamp + qc
                + "nonce=" + q + signature.nonce + qc
                + "signature=" + q + signature.signature + qc
                + "principalId=" + q + context.authParams.principalId + qc
                + "principalIdns=" + q + context.authParams.principalIdns + q
            )
        });
    }

    makeHmacRequestCallback(options, cb) {

        let request = require("request");

        this.getAuthorizationHeader(options, function (authorizationHeader) {
            let requestOptions = {
                "method": options.method,
                "body": options.body,
                "url": options.url,
                "headers": options.headers
            };
            requestOptions.headers.authorization = authorizationHeader;

            request(requestOptions, function (error, response, body) {
                cb(error, response, body)
            });
        });
    };

    makeHmacRequestPromise(options) {

        let context = this;

        let getAuthorization = new Promise(function (resolve) {
            context.getAuthorizationHeader(options, function (authorizationHeader) {
                resolve(authorizationHeader);
            });
        });

        let rp = require("request-promise");

        return getAuthorization.then(function (authorizationHeader) {
            let requestOptions = {
                "method": options.method,
                "body": options.body,
                "url": options.url,
                "headers": options.headers
            };
            requestOptions.headers.authorization = authorizationHeader;
            return rp(requestOptions);
        });
    }
};