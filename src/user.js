module.exports = class User {

    constructor(options) {
        this.principalId = options && options.principalId ? options.principalId : null;
        this.principalIdns = options && options.principalIdns ? options.principalIdns : null;
        this.authenticatingInstitutionId = options && options.authenticatingInstitutionId ? options.authenticatingInstitutionId : null;
    };

    getPrincipalId() {
        return this.principalId;
    }

    setPrincipalId(principalId) {
        this.principalId = principalId;
    }

    getPrincipalIdns() {
        return this.principalIdns;
    }

    setPrincipalIdns(principalIdns) {
        this.principalIdns = principalIdns;
    }

    getAuthenticatingInstitutionId() {
        return this.authenticatingInstitutionId;
    }

    setAuthenticatingInstitutionId(authenticatingInstitutionId) {
        this.authenticatingInstitutionId = authenticatingInstitutionId;
    }
};
