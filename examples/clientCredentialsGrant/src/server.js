/**
 * Client Credentials Grant example - node server code
 * @type {*|createApplication}
 */

const express = require("express");
const Wskey = require("nodeauth/src/Wskey");
const AccessToken = require("nodeauth/src/accessToken");
const User = require("nodeauth/src/user");
const OCLCMiddleware = require("nodeauth/src/oclcMiddleware");
const rp = require("request-promise-native");

// Authentication parameters -------------------------------------------------------------------------------------------

const wskey = new Wskey({
    "clientId": "{your clientId}",
    "secret": "{your secret}",
    "contextInstitutionId": "{your institution ID}",
    "redirectUri": "http://localhost:8000/auth/",
    "responseType": "code",
    "scope": ["WorldCatMetadataAPI"]
});

const user = new User({
    principalId: "{your principal ID}",
    principalIdns: "{your principal IDNS}",
    authenticatingInstitutionId: "{your institution ID}"
});

let accessToken = new AccessToken({
    wskey: wskey,
    grantType: "client_credentials",
    user: user
});

const port = 8000; // should match the redirect URI configured on the wskey

// ---- Application globals --------------------------------------------------------------------------------------------

let bibRecord;
let oclcnumber = "829180274";

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
        token: accessToken.getValue() ? JSON.stringify(accessToken.params, null, 4) : "Press button to get token.",
        bibRecord: bibRecord ? JSON.stringify(bibRecord, null, 4) : "Please authenticate before requesting a Bib Record.",
        oclcnumber: oclcnumber
    });
});

// Get a bib record
app.get("/bibRecord", function (req, res) {

    if (!accessToken.getValue()) {
        res.redirect("/");
    }

    oclcnumber = req.query.oclcnumber;

    rp({
        url: `https://worldcat.org/bib/data/${oclcnumber}`,
        method: "GET",
        headers: {
            "Accept": "application/atom+json",
            "Authorization": `Bearer ${accessToken.getValue()}`
        },
        json: true
    })
        .then(function (data) {
            bibRecord = data;
            res.redirect("/");
        })
        .catch(function (err) {
            console.log(err);
            res.redirect("/");
        });
});
