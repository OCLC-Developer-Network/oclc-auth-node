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
    }

    isAuthParamsError() {

        if (!this.authParams.clientId) {
            return "Error: Missing clientId.";
        }

        if (!this.authParams.authenticatingInstitutionId || this.authParams.authenticatingInstitutionId.trim() === "") {
            return "Error: Missing authenticatingInstitutionId.";
        }

        if (!this.authParams.contextInstitutionId || this.authParams.contextInstitutionId.trim() === "") {
            return "Error: Missing contextInstitutionId.";
        }

        if (!this.authParams.redirectUri || this.authParams.redirectUri.trim() === "") {
            return "Error: Missing redirectUri.";
        }

        if (!this.authParams.scope) {
            return "Error: Missing scope.";
        }

        if (!Array.isArray(this.authParams.scope) || this.authParams.scope.length === 0) {
            return "Error: Scope must be passed as an array of one or more strings.";
        }
    }

    getLoginUrl() {

        const err = this.isAuthParamsError();

        if (err) {
            return {"err": err}
        }

        // Build a space separated scope list from the array of scopes
        let scope = "";
        for (let i = 0; i < this.authParams.scope.length; i++) {
            scope += this.authParams.scope[i];
            if (i !== this.authParams.scope.length - 1) {
                scope += " ";
            }
        }

        const url = "https://authn.sd00.worldcat.org/oauth2/authorizeCode?" +
            "client_id=" + this.authParams.clientId +
            "&authenticatingInstitutionId=" + this.authParams.authenticatingInstitutionId +
            "&contextInstitutionId=" + this.authParams.contextInstitutionId +
            "&redirect_uri=" + encodeURIComponent(this.authParams.redirectUri) +
            "&response_type=" + this.authParams.responseType +
            "&scope=" + encodeURIComponent(scope);

        return {"url": url}
    }
};