/**
 * Explicit Authorization Flow with Refresh Token example - node server code
 * @type {*|createApplication}
 */

const express = require("express");
const path = require("path");
const Wskey = require("nodeauth/src/Wskey");
const AccessToken = require("nodeauth/src/accessToken");
const User = require("nodeauth/src/user");

const wskey = new Wskey({
    "clientId": "{your client Id}",
    "secret": "{your secret}",
    "contextInstitutionId": "{your institution id}",
    "redirectUri": "{your redirect uri}",
    "responseType": "code",
    "scope": ["refresh_token", "{additional scopes}"]
});

let accessToken;

// Omit principalId & Idns for this flow - they are shown only for clarity
let user = new User({
    "principalId": null,
    "principalIdns": null,
    "authenticatingInstitutionId": "{your institution ID}"
});

// Initialize a server listening to http://localhost:8000
const app = express();
const port = 8000;
app.listen(port, function () {
    console.log("server listening on port " + port);
});

// Serve the main page
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});

// Start an authentication request by redirecting to the login url
app.get("/authenticate", function (req, res) {
    res.send('<html>' +
        '<head>' +
        '<meta http-equiv="refresh" content="0; url=' + wskey.getLoginURL({user: user}) + '" />' +
        '</head>' +
        '</html>');
});

// This handles the redirect. For this example, we assume the redirect uri is http://localhost:8000/auth.
// 1. Pick off the authorization code after the user authenticates
// 2. Use the authorization code to request an access token
// 3. Redirect the browser back to the main application
app.get("/auth/", function (req, res) {
    let context = this;

    const redirectHtml = "<html><head>" +
        "<meta http-equiv=\"refresh\" content=\"0; url=http://localhost:8000\" />" +
        "</head></html>";

    // The authorization code is part of the request to the redirect page (/auth) and can be picked
    // directly off the request as res.query.code.

    accessToken = new AccessToken({
        wskey: wskey,
        authorizationCode: req.query.code,
        user: user,
        grantType: "authorization_code"
    });

    accessToken.createAccessToken()
        .then(
            // Success - accessToken now has authentication parameters
            function () {
                res.send(redirectHtml);
            })
        .catch(
            // Failure - accessToken does has null authentication parameters
            function (err) {
                console.log(err.message);
                res.send(redirectHtml);
            });
});

app.get("/refresh", function (req, res) {

    const redirectHtml = "<html><head>" +
        "<meta http-equiv=\"refresh\" content=\"0; url=http://localhost:8000\" />" +
        "</head></html>";

    accessToken.refresh()
        .then(
            // Success - refresh token has been used to update the access token with a new one.
            function (newAccessToken) {
                accessToken = newAccessToken;
                res.send(redirectHtml);
            })
        .catch(
            // Failure - the access token has not been updated
            function (err) {
                console.log(err.message);
                res.send(redirectHtml);
            });
});

// GET's made to the /token path will return the token information for display, or empty string if
// no token has been requested yet. This is called when the app is first displayed.
app.get("/token", function (req, res, next) {
    if (accessToken) {
        res.send(JSON.stringify(accessToken.params));
    } else {
        res.send();
    }
});