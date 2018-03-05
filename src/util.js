module.exports = class Util {

    /**
     *
     * @param scope Array of one or more strings
     * @returns {string}
     */
    static normalizeScope(scope) {
        // Build a space separated scope list from an array of scopes.
        let normalizedScope = "";
        if (scope && Array.isArray(scope)) {
            for (let i = 0; i < scope.length; i++) {
                normalizedScope += scope[i];
                if (i !== scope.length - 1) {
                    normalizedScope += " ";
                }
            }
        }
        return normalizedScope;
    }
};
