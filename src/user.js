module.exports = class User {

    constructor(authenticatingInstitutionId,principalID,principalIDNS) {
        this.principalID = principalID;
        this.principalIDNS = principalIDNS;
        this.authenticatingInstitutionId = authenticatingInstitutionId+"";
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
