module.exports = class User {

    constructor(options) {
        this.principalID = options && options.principalID ? options.principalID : null;
        this.principalIDNS = options && options.principalIDNS ? options.principalIDNS : null;
        this.authenticatingInstitutionID = options && options.authenticatingInstitutionID ? options.authenticatingInstitutionID : null;
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
        return this.authenticatingInstitutionID;
    }

    setAuthenticatingInstitutionID(authenticatingInstitutionID) {
        this.authenticatingInstitutionID = authenticatingInstitutionID;
    }
};
