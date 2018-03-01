module.exports = class User {

    constructor(options) {
        this.principalId = options && options.principalId ? options.principalId : null;
        this.principalIdns = options && options.principalIdns ? options.principalIdns : null;
        this.authenticatingInstitutionId = options && options.authenticatingInstitutionId ? options.authenticatingInstitutionId : null;
    };
};
