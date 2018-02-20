module.exports = class User {

    constructor(options) {
        this.principalId = options.principalId;
        this.principalIdns = options.principalIdns;
        this.authenticatingInstitutionId = options.authenticatingInstitutionId;
    };
};
