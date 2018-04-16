/**
 * Client Credentials Grant example - node server code
 * @type {*|createApplication}
 */

const axios = require("axios");
const express = require("express");

const nodeauth = require("nodeauth");

// You can override the default production authentication endpoints here
//AUTHORIZATION_SERVER_OVERRIDE = "https://...";
//HMAC_AUTHORIZATION_URL_OVERRIDE= "http://...";

// Authentication parameters -------------------------------------------------------------------------------------------

const key = "{your clientID}";
const secret = "{your secret}";

const principalID = "{your principal ID}";
const principalIDNS = "{your principal IDNS}";
const authenticatingInstitutionId = "{your institution ID}";
const contextInstitutionId = "{your institution ID}";
const options = {
    services: ["WorldCatMetadataAPI"]
};

const user = new nodeauth.User(authenticatingInstitutionId, principalID, principalIDNS);
const wskey = new nodeauth.Wskey(key, secret, options);

this.accessToken = null;

const port = 8000; // should match the redirect URI configured on the wskey

// ---- Application globals --------------------------------------------------------------------------------------------

let bibRecord;
let oclcnumber = "829180274";
let error;

// ---- Initialize a Server --------------------------------------------------------------------------------------------

const app = express();
app.set("view engine", "pug");
app.listen(port, function () {
    console.log("server listening on port " + port);
});

// ---- Serve the main page --------------------------------------------------------------------------------------------
app.get("/", function (req, res) {

    const context = this;

    let isAccessToken = context.accessToken && context.accessToken.getAccessTokenString();
    let isBibRecord = bibRecord;
    let bibRecordText;

    if (!isAccessToken) {
        bibRecordText = "Please press Request Token before requesting a Bib Record.";
    } else if (!isBibRecord) {
        bibRecordText = "Please press Get Bib Record to retrieve a record."
    } else {
        bibRecordText = JSON.stringify(bibRecord, null, 4);
    }

    res.render("index", {
        pageTitle: "Client Credentials Grant",
        accessTokenString: isAccessToken ? JSON.stringify(context.accessToken, null, 4) : "Press button to get token.",
        errorMessage: null,
        bibRecord: bibRecordText,
        oclcnumber: oclcnumber,
        buttonMessage: isAccessToken ? "Request Another Token" : "Request Token"
    });
});

// ---- Handle authentication for CCG, just get a token and redirect back to the home page) ----------------------------

app.get("/login", function (req, res) {

    const context = this;

    bibRecord = null;

    wskey.getAccessTokenWithClientCredentials(authenticatingInstitutionId, contextInstitutionId, user)

        .then(function (accessToken) {
            context.accessToken = accessToken;
            res.redirect("/");
        })
        .catch(function (err) {
            error = err && err.response && err.response.body ? err.response.body : err;
            res.redirect("/error");
        })
});

// ---- Display errors -------------------------------------------------------------------------------------------------

app.get("/error", function (req, res) {
    res.send(`<h1>Error Page</h1><div style="width:800px;overflow:hidden;white-space:pre-wrap">${error}</div>`);
});

// ---- Use the CCG token to get a bib record --------------------------------------------------------------------------
app.get("/bibRecord", function (req, res) {

    if (!accessToken.getAccessTokenString()) {
        res.redirect("/");
    }

    oclcnumber = req.query.oclcnumber;

    axios({
        method: "GET",
        url: `https://worldcat.org/bib/data/${oclcnumber}`,
        headers: {
            "Accept": "application/atom+json",
            "Authorization": `Bearer ${accessToken.getAccessTokenString()}`
        },
        json: true
    })
        .then(function (response) {
            bibRecord = response.data;
            res.redirect("/");
        })
        .catch(function (err) {
            console.log(err);
            res.redirect("/");
        });
});
