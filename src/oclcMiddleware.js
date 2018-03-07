module.exports = class User {

    static authenticationManager(options) {

        const port = options.port && options.port != 80 ? options.port : "80";
        const AuthCode = require("./authCode.js");

        const redirectHome = '<html><head>' +
            '<meta http-equiv="refresh" content="0; url=' + options.homePath + '" />' +
            '</head></html>';

        let redirectToAuthCodeLoginURL;

        if (options.accessToken.getGrantType() === "authorization_code") {

            redirectToAuthCodeLoginURL = '<html><head>' +
                '<meta http-equiv="refresh" content="0; url=' + AuthCode.getLoginUrl({
                    wskey: options.wskey,
                    user: options.user,
                    useRefreshTokens: options.accessToken.useRefreshTokens
                }) + '" />' +
                '</head></html>';
        }

        return function (req, res, next) {

            const url = (req.secure ? "https://" : "http://")
                + req.hostname
                + (port != 80 && port != 443 ? ":" + port : "")
                + req.originalUrl;

            // ---- Handle the home page -----------------------------------------------------------------------------------

            if (req.originalUrl === options.homePath) {
                next();
            }

            // ---- Handle an authentication request -----------------------------------------------------------------------

            if (req.originalUrl === options.authenticationPath) {

                if (options.accessToken && !options.accessToken.isExpired()) {
                    res.send(redirectHome);
                } else if(options.accessToken
                    && options.accessToken.isExpired()
                    && !options.accessToken.isRefreshTokenExpired()) {
                    options.accessToken.refresh()
                        .then(function(){
                            res.send(redirectHome);
                        })
                        .catch(function(err){
                            console.log(err.message);
                            res.send(redirectHome);
                        })
                }
                else {
                    if (options.accessToken.getGrantType() === "authorization_code") {
                        res.send(redirectToAuthCodeLoginURL);
                    }
                    if (options.accessToken.getGrantType() === "client_credentials") {
                        options.accessToken.createAccessToken()
                            .then(
                                // Success - accessToken now has authentication parameters
                                function () {
                                    res.send(redirectHome);
                                })
                            .catch(
                                // Failure - accessToken has null authentication parameters
                                function (err) {
                                    console.log(err.message);
                                    res.send(redirectHome);
                                });
                    }
                }
            }

            // ---- Handle the redirect URI --------------------------------------------------------------------------------

            if (url.split("?")[0] === options.wskey.authParams.redirectUri) {

                if (options.accessToken.getGrantType() === "authorization_code") {

                    options.accessToken.setAuthorizationCode(req.query.code);
                    options.accessToken.createAccessToken()
                        .then(
                            // Success - accessToken now has authentication parameters
                            function () {
                                res.send(redirectHome);
                            })
                        .catch(
                            // Failure - accessToken has null authentication parameters
                            function (err) {
                                console.log(err.message);
                                res.send(redirectHome);
                            });
                }

                if (options.accessToken.getGrantType() === "client_credentials") {
                    res.send(redirectHome)
                }
            }
        }
    }
};
