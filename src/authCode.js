module.exports = class AuthCode {

    constructor(options) {
        this.clientID = options.clientID;
        this.authenticatingInstitutionId = options.authenticatingInstitutionId;
        this.contextInstitutionId = options.contextInstitutionId;
        this.redirectUri = options.redirectUri;
        this.scope = options.scope;
    }

    getLoginUrl() {

        const Util = require("./util.js");
        const Config = require("./config.js");
        const config = new Config();
        //const scope = options.wskey.authParams.scope;

        //if (options.useRefreshTokens && !Util.scopeContainsRefreshToken(scope)) {
        //    scope.push("refresh_token");
        //}

        return config.AUTHORIZATION_SERVER + "/authorizeCode?" +
            "client_id=" + this.clientID +
            "&authenticatingInstitutionId=" + this.authenticatingInstitutionId +
            "&contextInstitutionId=" + this.contextInstitutionId +
            "&redirect_uri=" + encodeURIComponent(this.redirectUri) +
            "&response_type=code"  +
            "&scope=" + encodeURIComponent(Util.normalizeScope(this.scope));
    }
};