module.exports = class AuthCode {

    constructor(client_id, redirectUri, scope, options) {
        this.clientID = client_id;
        this.authenticatingInstitutionId = options.authenticatingInstitutionId;
        this.contextInstitutionId = options.contextInstitutionId;
        this.redirectUri = redirectUri;
        this.scope = scope;
        this.state = options.state ? options.state : null
    }

    getLoginUrl() {

        const Util = require("./util.js");
        const Config = require("./config.js");
        const config = new Config();

        return (typeof AUTHORIZATION_SERVER_OVERRIDE !== "undefined" ? AUTHORIZATION_SERVER_OVERRIDE : config.AUTHORIZATION_SERVER) + "/authorizeCode?" +
            "client_id=" + this.clientID +
            "&authenticatingInstitutionId=" + this.authenticatingInstitutionId +
            "&contextInstitutionId=" + this.contextInstitutionId +
            "&redirect_uri=" + encodeURIComponent(this.redirectUri) +
            "&response_type=code" +
            "&scope=" + encodeURIComponent(Util.normalizeScope(this.scope)) +
            (this.state ? "&state=" + this.state : "");
    }
};