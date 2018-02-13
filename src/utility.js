module.exports = class Utility {

    parseTokenResponse(URLhash) {

        var hash = URLhash.replace("#", "").split("&");
        var hashParams = {};
        var paramArray;
        var x;

        for (x = 0; x < hash.length; x++) {
            paramArray = hash[x].split("=");
            hashParams[paramArray[0]] = paramArray[1];
        }

        return hashParams;
    }
};