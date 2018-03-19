module.exports = class Util {

    /**
     * Returns a normalized list of scopes.
     * @param scope an array of scopes like ["WMS_CIRCULATION","WMS_NCIP","refresh_token"]
     * @returns {string} a single string of space separate scopes like "WMS_CIRCULATION WMS_NCIP refresh_token"
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

    /**
     * Checks if the string array of scopes contains "refresh_token" so we don't accidently duplicate it.
     * @param scope an array of scopes like ["WMS_CIRCULATION","WMS_NCIP","refresh_token"]
     * @returns {boolean} true if the string "refresh_token" is in the array of scopes
     */
    static scopeContainsRefreshToken(scope) {
        let containsRefreshToken = false;
        if (scope) {
            for (let i = 0; i < scope.length; i++) {
                if (scope[i] === "refresh_token") {
                    containsRefreshToken = true;
                    break;
                }
            }
        }

        return containsRefreshToken;
    }
};
