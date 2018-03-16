/**
 * Client Credentials Grant example - node server code
 * @type {*|createApplication}
 */

const Wskey = require("nodeauth/src/Wskey");
const User = require("nodeauth/src/user");

const express = require("express");
const rp = require("request-promise-native");

// Authentication parameters -------------------------------------------------------------------------------------------

const authenticatingInstitutionId = "128807";
const contextInstitutionId = "128807";

const user = new User(
    {
        principalID: "8eaa9f92-3951-431c-975a-d7df26b8d131",
        principalIDNS: "urn:oclc:wms:da",
    });

const wskey = new Wskey(
    "aCcndeDMjFO9vszkDrB6WJg1UnyTnkn8lLupLKygr0U1KJZoeAittuVjGRywCDdrsxahv2bsjgKq6hLM",
    "EyZfIJdGQXeatxQOjdkQZw==",
    {
        services: ["WorldCatMetadataAPI"]
    });

this.accessToken = null;

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

// ---- Serve the main page --------------------------------------------------------------------------------------------
app.get("/", function (req, res) {

    const context = this;

    res.render("index", {
        pageTitle: "Client Credentials Grant",
        accessTokenString: context.accessToken && context.accessToken.getAccessTokenString() ?
            context.accessToken.getAccessTokenString() : "Press button to get token.",
        errorMessage: null,
        bibRecord: bibRecord ? JSON.stringify(bibRecord, null, 4) : "Please authenticate before requesting a Bib Record.",
        oclcnumber: oclcnumber
    });
});

// ---- Handle authentication for CCG, just get a token and redirect back to the home page) ----------------------------

app.get("/login", function (req, res) {

    const context = this;

    wskey.getAccessTokenWithClientCredentials(authenticatingInstitutionId, contextInstitutionId, user)

        .then(function (accessToken) {
            context.accessToken = accessToken;
            res.redirect("/")
        })
});

// ---- Use the CCG token to get a bib record --------------------------------------------------------------------------
app.get("/bibRecord", function (req, res) {

    if (!accessToken.getAccessTokenString()) {
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
