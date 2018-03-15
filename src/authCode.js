module.exports = class AuthCode {

    constructor(options) {
        this.client_id = options.client_id;
        this.authenticatingInstitutionId = options.authenticatingInstitutionId;
        this.contextInstitutionId = options.contextInstitutionId;
        this.redirectUri = options.redirectUri;
        this.scope = options.scope;
    }

    getLoginUrl() {

        const Util = require("./util.js");
        const Config = require("./config.js");
        const config = new Config();

        return config.AUTHORIZATION_SERVER + "/authorizeCode?" +
            "client_id=" + this.client_id +
            "&authenticatingInstitutionId=" + this.authenticatingInstitutionId +
            "&contextInstitutionId=" + this.contextInstitutionId +
            "&redirect_uri=" + encodeURIComponent(this.redirectUri) +
            "&response_type=code"  +
            "&scope=" + encodeURIComponent(Util.normalizeScope(this.scope));
    }
};