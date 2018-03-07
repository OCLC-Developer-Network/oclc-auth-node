/**
 * Client Credentials Grant example - node server code
 * @type {*|createApplication}
 */

const express = require("express");
const Wskey = require("nodeauth/src/Wskey");
const AccessToken = require("nodeauth/src/accessToken");
const User = require("nodeauth/src/user");
const OCLCMiddleware = require("nodeauth/src/oclcMiddleware");

// Authentication parameters -------------------------------------------------------------------------------------------

const wskey = new Wskey({
    "clientId": "aCcndeDMjFO9vszkDrB6WJg1UnyTnkn8lLupLKygr0U1KJZoeAittuVjGRywCDdrsxahv2bsjgKq6hLM",
    "secret": "EyZfIJdGQXeatxQOjdkQZw==",
    "contextInstitutionId": "128807",
    "redirectUri": "http://localhost:8000/auth/",
    "responseType": "code",
    "scope": ["WMS_CIRCULATION"]
});

let user = new User({
    "authenticatingInstitutionId": "128807"
});

let accessToken = new AccessToken({
    wskey: wskey,
    user: user,
    grantType: "client_credentials"
});

const port = 8000; // should match the redirect URI configured on the wskey

// ---- Initialize a Server --------------------------------------------------------------------------------------------

const app = express();
app.set("view engine", "pug");
app.listen(port, function () {
    console.log("server listening on port " + port);
});

// ---- Middleware -----------------------------------------------------------------------------------------------------

app.use(OCLCMiddleware.authenticationManager({
    homePath: "/",
    authenticationPath: "/login",
    port: port, // if omitted assumes 80 for http or 443 for https. We set it to 8000 in this example.
    accessToken: accessToken,
    user: user,
    wskey: wskey,
}));

// Serve the main page
app.get("/", function (req, res) {
    res.render("index", {
        pageTitle: "Client Credentials Grant",
        token: JSON.stringify(accessToken.params, null, 4)
    });
});
