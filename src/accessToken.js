module.exports = class AccessToken {

    constructor(options) {
        this.wskey = options.wskey;
        this.refreshToken = options.refreshToken;
        this.grantType = options.grantType;
        this.authorizationCode = options.authorizationCode;
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
        return context.requestAccessToken(accessTokenURL).then(function (response) {
            return context.parseTokenResponse(response);
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
                    "headers": {
                        "authorization": authorization
                    }
                };
                const rp = require('request-promise-native');
                return rp(options)
                    .then(function (err, httpResponse, body) {
                        console.log("--- success ---");
                        console.log(httpResponse);
                        console.log(body);
                        resolve(body);
                    }).catch(function (err) {
                        console.log("--- err ---");
                        console.log(err);
                        reject(err);
                    });
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

    parseTokenResponse(URLhash) {

        let hash = URLhash.replace("#", "").split("&"),
            paramHash = {},
            paramArray,
            paramCounter;

        for (paramCounter = 0; paramCounter < hash.length; paramCounter++) {
            paramArray = hash[paramCounter].split("=");
            paramHash[paramArray[0]] = paramArray[1];
        }

        return paramHash;
    }

};