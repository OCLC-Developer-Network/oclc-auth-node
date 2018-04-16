module.exports = class Config {

    /*
    Note:

    - to override AUTHORIZATION_SERVER, just put AUTHORIZATION_SERVER_OVERRIDE="http//whatever" in your code.
    - to override HMAC_AUTHORIZATION_URL, just put HMAC_AUTHORIZATION_SERVER_OVERRIDE="http://whatever" in your code.

     */

    constructor() {

        return {
            AUTHORIZATION_SERVER: "https://authn.sd00.worldcat.org/oauth2",
            HMAC_AUTHORIZATION_URL: "http://www.worldcat.org/wskey/v2/hmac/v1"
        }
    };
};
