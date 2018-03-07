module.exports = class Config {

    constructor() {

        return {
            AUTHORIZATION_SERVER: "https://authn.sd00.worldcat.org/oauth2",
            HMAC_AUTHORIZATION_URL: "http://www.worldcat.org/wskey/v2/hmac/v1"
        }
    };
};
