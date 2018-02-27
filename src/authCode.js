module.exports = class AuthCode {

    constructor(wskey) {

        this.wskey = wskey;
        const Util = require("./util.js");
        this.util = new Util();
    }

    getLoginURL() {

        const url = "https://authn.sd00.worldcat.org/oauth2/authorizeCode?" +
            "client_id=" + this.wskey.authParams.clientId +
            "&authenticatingInstitutionId=" + this.wskey.authParams.authenticatingInstitutionId +
            "&contextInstitutionId=" + this.wskey.authParams.contextInstitutionId +
            "&redirect_uri=" + encodeURIComponent(this.wskey.authParams.redirectUri) +
            "&response_type=" + this.wskey.authParams.responseType +
            "&scope=" + encodeURIComponent(this.util.normalizeScope(this.wskey.authParams.scope));

        return url
    }
};