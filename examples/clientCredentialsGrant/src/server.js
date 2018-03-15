/**
 * Client Credentials Grant example - node server code
 * @type {*|createApplication}
 */

const express = require("express");
const Wskey = require("nodeauth/src/Wskey");
const AccessToken = require("nodeauth/src/accessToken");
const User = require("nodeauth/src/user");
const rp = require("request-promise-native");

// Authentication parameters -------------------------------------------------------------------------------------------

const user = new User(
    {
        principalID: "{your principal ID}",
        principalIDNS: "{your principal IDNS}",
        authenticatingInstitutionId: "{your institution ID}"
    });

const wskey = new Wskey("{your clientID}", "{your secret}",
    {
        services: ["WorldCatMetadataAPI"],
        contextInstitutionId: "{your institution ID}",
        user: user
    });

let accessToken = new AccessToken("client_credentials",
    {
        wskey: wskey,
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

// Serve the main page
app.get("/", function (req, res) {

    accessToken.getValue()
        .then(function (accessTokenString) {
            res.render("index", {
                pageTitle: "Client Credentials Grant",
                accessTokenString: accessToken.getAccessTokenString() ? accessTokenString : "Press button to get token.",
                errorMessage: null,
                bibRecord: bibRecord ? JSON.stringify(bibRecord, null, 4) : "Please authenticate before requesting a Bib Record.",
                oclcnumber: oclcnumber
            });
        })
        .catch(function (errorMessage) {
            res.render("index", {
                pageTitle: "Client Credentials Grant",
                accessTokenString: "Press button to try again.",
                errorMessage: errorMessage,
                bibRecord: bibRecord ? JSON.stringify(bibRecord, null, 4) : "Please authenticate before requesting a Bib Record.",
                oclcnumber: oclcnumber
            });
        });
});

// Sign in
app.get("/login", function (req, res) {
    accessToken.create(wskey, user)
        .then(function () {
            res.redirect("/")
        })
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
            "Authorization": `Bearer ${accessToken.getAccessTokenString()}`
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
