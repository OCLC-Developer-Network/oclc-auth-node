const express = require("express");
const path = require("path");
const Wskey = require("nodeauth/src/Wskey");

var wskey = new Wskey({
    "clientId": "{your clientId}",
    "secret": "{your secret}",
    "authenticatingInstitutionId": "{your institution ID}",
    "contextInstitutionId": "{your institution ID}",
    "redirectUri": "http://localhost:8000/auth/", // example catches this path - YMMMV
    "responseType": "code",
    "scope": ["{scope 1}","{scope 2}","..."]
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

// Request a token
app.get("/request-token", function (req, res) {
    const redirectHtml = "<html><head>" +
        "<meta http-equiv=\"refresh\" content=\"0; url=http://localhost:8000\" />" +
        "</head></html>";

    const context = this;

    wskey.createAuthToken({"grantType": "client_credentials"})
        .then(
            // Success - set the authToken internally to this server and return to the main app
            function (authToken) {
                context.authToken = authToken;
                res.send(redirectHtml);
            })
        .catch(
            // Failure - no authToken set and return to the main app
            function (err) {
                console.log(err.message);
                res.send(redirectHtml);
            });
});

// This handles the redirect. For this example, we assume the redirect uri is http://localhost:8000/auth.
// 1. Pick off the authorization code after the user authenticates
// 2. Use the authorization code to request an access token
// 3. Redirect the browser back to the main application
app.get("/auth/", function (req, res) {

    const redirectHtml = "<html><head>" +
        "<meta http-equiv=\"refresh\" content=\"0; url=http://localhost:8000\" />" +
        "</head></html>";

    res.send(redirectHtml);
});

// GET's made to the /token path will return the token information for display, or empty string if
// no token has been requested yet. This is called when the app is first displayed.
app.get("/token", function (req, res, next) {
    if (this.authToken) {
        res.send(JSON.stringify(this.authToken.params));
    } else {
        res.send();
    }
});