module.exports = class AuthCode {

    static getLoginUrl(options) {

        const Util = require("./util.js");
        const Config = require("./config.js");
        const config = new Config();
        const scope = options.wskey.authParams.scope;

        if (options.useRefreshTokens && !Util.scopeContainsRefreshToken(scope)) {
            scope.push("refresh_token");
        }

        return config.AUTHORIZATION_SERVER + "/authorizeCode?" +
            "client_id=" + options.wskey.authParams.clientId +
            "&authenticatingInstitutionId=" + options.user.authenticatingInstitutionId +
            "&contextInstitutionId=" + options.wskey.authParams.contextInstitutionId +
            "&redirect_uri=" + encodeURIComponent(options.wskey.authParams.redirectUri) +
            "&response_type=" + options.wskey.authParams.responseType +
            "&scope=" + encodeURIComponent(Util.normalizeScope(scope));
    }
};