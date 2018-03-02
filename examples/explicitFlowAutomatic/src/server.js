/**
 * Automatic Explicit Authorization Flow example - node server code
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

// Omit principalId & Idns for this flow - they are shown only for clarity
let user = new User({
    "principalId": null,
    "principalIdns": null,
    "authenticatingInstitutionId": "{your institution ID}"
});

let accessToken = new AccessToken({wskey: wskey, user: user, grantType: "authorization_code"});

// Initialize a server listening to http://localhost:8000
const app = express();
const port = 8000;
app.listen(port, function () {
    console.log("server listening on port " + port);
});

// Serve the main page
app.get("/", function (req, res, next) {
    if (req.query.authorize) {

        let p = new Promise(function (resolve, reject) {
            if (!accessToken.authorizationCode) {
                accessToken.params.loginUrl = wskey.getLoginURL({user: user});
                resolve();
            } else {
                return accessToken.getAccessToken().then(function (newAccessToken) {
                    accessToken = newAccessToken;
                    resolve();
                });
            }
        });

        p.then(function () {
            res.send(accessToken.params);
            next();
        });

    } else {
        res.sendFile(path.join(__dirname + "/index.html"));
    }
});

// This handles the redirect. For this example, we assume the redirect uri is http://localhost:8000/auth.
// 1. Pick off the authorization code after the user authenticates
// 2. Use the authorization code to request an access token
// 3. Redirect the browser back to the main application
app.get("/auth/", function (req, res) {

    // The authorization code is part of the request to the redirect page (/auth) and can be picked
    // directly off the request as res.query.code.

    accessToken.authorizationCode = req.query.code;
    res.redirect("/");
});
