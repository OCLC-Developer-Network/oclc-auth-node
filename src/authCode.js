module.exports = class AuthCode {

    static getLoginURL(options) {

        const Util = require("./util.js");
        const scope = options.wskey.authParams.scope;

        if (options.useRefreshTokens) {
            scope.push("refresh_token");
        }

        console.log("scope:");
        console.log(scope);

        let url = "https://authn.sd00.worldcat.org/oauth2/authorizeCode?" +
            "client_id=" + options.wskey.authParams.clientId +
            "&authenticatingInstitutionId=" + options.user.authenticatingInstitutionId +
            "&contextInstitutionId=" + options.wskey.authParams.contextInstitutionId +
            "&redirect_uri=" + encodeURIComponent(options.wskey.authParams.redirectUri) +
            "&response_type=" + options.wskey.authParams.responseType +
            "&scope=" + encodeURIComponent(Util.normalizeScope(scope));

        console.log(url);

        return url
    }
};