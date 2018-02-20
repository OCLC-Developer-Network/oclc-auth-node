module.exports = class AuthCode {

    constructor(authParams) {

        this.authParams = {
            "clientId": authParams.clientId,
            "authenticatingInstitutionId": authParams.authenticatingInstitutionId,
            "contextInstitutionId": authParams.contextInstitutionId,
            "redirectUri": authParams.redirectUri,
            "scope": authParams.scope,
            "responseType": authParams.responseType ? authParams.responseType : "code"
        };

        // Gracefully handle institutionId's passed as numbers instead of strings

        if (typeof this.authParams.authenticatingInstitutionId === "number") {
            this.authParams.authenticatingInstitutionId = this.authParams.authenticatingInstitutionId.toString();
        }

        if (typeof this.authParams.contextInstitutionId === "number") {
            this.authParams.contextInstitutionId = this.authParams.contextInstitutionId.toString();
        }

        const Util = require("./util.js");
        this.util = new Util();
    }

    getLoginURL() {

        const url = "https://authn.sd00.worldcat.org/oauth2/authorizeCode?" +
            "client_id=" + this.authParams.clientId +
            "&authenticatingInstitutionId=" + this.authParams.authenticatingInstitutionId +
            "&contextInstitutionId=" + this.authParams.contextInstitutionId +
            "&redirect_uri=" + encodeURIComponent(this.authParams.redirectUri) +
            "&response_type=" + this.authParams.responseType +
            "&scope=" + encodeURIComponent(this.util.normalizeScope(this.authParams.scope));

        return url
    }
};