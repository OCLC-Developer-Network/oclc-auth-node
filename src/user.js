module.exports = class User {

    constructor(options) {
        this.principalID = options && options.principalID ? options.principalID : null;
        this.principalIDNS = options && options.principalIDNS ? options.principalIDNS : null;
        this.authenticatingInstitutionId = options && options.authenticatingInstitutionId ? options.authenticatingInstitutionId : null;
    };

    getPrincipalID() {
        return this.principalID;
    }

    setPrincipalID(principalID) {
        this.principalID = principalID;
    }

    getPrincipalIDNS() {
        return this.principalIDNS;
    }

    setPrincipalIDNS(principalIDNS) {
        this.principalIDNS = principalIDNS;
    }

    getAuthenticatingInstitutionID() {
        return this.authenticatingInstitutionId;
    }

    setAuthenticatingInstitutionID(authenticatingInstitutionId) {
        this.authenticatingInstitutionId = authenticatingInstitutionId;
    }
};
