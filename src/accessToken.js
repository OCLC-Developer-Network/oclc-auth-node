module.exports = class AccessToken {


    parseTokenResponse(URLhash) {

        let hash = URLhash.replace("#", "").split("&"),
            paramHash = {},
            paramArray,
            paramCounter;

        for (paramCounter = 0; paramCounter < hash.length; paramCounter++) {
            paramArray = hash[paramCounter].split("=");
            paramHash[paramArray[0]] = paramArray[1];
        }

        return paramHash;
    }

    create(){}
};