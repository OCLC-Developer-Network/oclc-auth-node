/**
 * Explicit Authorization Flow example - node server code
 * @type {*|createApplication}
 */

const axios = require("axios");
const express = require("express");
const url = require("url");

const nodeauth = require("nodeauth");

// You can override the default production authentication endpoints here
//AUTHORIZATION_SERVER_OVERRIDE = "https://...";
//HMAC_AUTHORIZATION_URL_OVERRIDE= "http://...";

// Authentication parameters -------------------------------------------------------------------------------------------

const key = "{your clientID}";
const secret = "{your secret}";
const authenticatingInstitutionId = "{your institution ID}";
const contextInstitutionId = "{your institution ID}";
const options = {
    services: ["WorldCatMetadataAPI", "refresh_token"],
    redirectUri: "http://localhost:8000/auth/"
};

const wskey = new nodeauth.Wskey(key, secret, options);

let authCode;
let accessToken;

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

    res.render("index", {
        pageTitle: "Explicit Authentication Flow",
        accessTokenString: context.accessToken && context.accessToken.getAccessTokenString() ?
            JSON.stringify(context.accessToken, null, 4) : "Press button to get token.",
        errorMessage: null,
        bibRecord: bibRecord ? JSON.stringify(bibRecord, null, 4) : "Please authenticate before requesting a Bib Record.",
        oclcnumber: oclcnumber
    });
});

// ---- Sign in --------------------------------------------------------------------------------------------------------
app.get("/login", function (req, res) {

    let context = this;

    if (authCode) {
        wskey.getAccessTokenWithAuthCode(authCode, authenticatingInstitutionId, contextInstitutionId)
            .then(function (accessToken) {
                context.accessToken = accessToken;
                bibRecord = null;
                res.redirect("/");
                authCode = null;
            })
            .catch(function (err) {
                error = err && err.response && err.response.body ? err.response.body : err;
                res.redirect("/error");
            });
    } else {
        let redirectToAuthCodeLoginURL = '<html><head>'
            + '<meta http-equiv="refresh" content="0; url='
            + wskey.getLoginURL(authenticatingInstitutionId, contextInstitutionId)
            + '" />' +
            '</head></html>';
        res.send(redirectToAuthCodeLoginURL);
    }
});

// ---- Handle Redirect Uri --------------------------------------------------------------------------------------------

let redirectPath = url.parse(wskey.getRedirectUri()).pathname;

app.get(redirectPath, function (req, res) {
    if (req && req.query && req.query.code) {
        authCode = req.query.code;
        res.redirect("/login");
    } else {
        error = req.url;
        res.redirect("/error");
    }
});

// ---- Display errors -------------------------------------------------------------------------------------------------

app.get("/error", function (req, res) {
    res.send(`<h1>Error Page</h1><div style="width:800px;overflow:hidden;white-space:pre-wrap">${error}</div>`);
});

// ---- Get a bib record -----------------------------------------------------------------------------------------------
app.get("/bibRecord", function (req, res) {

    const context = this;
    const oclcnumber = req.query.oclcnumber;

    // If no access token exists, send the user back home.
    if (!this.accessToken) {
        res.redirect("/");
    } else {

        // Get the current token, or a refreshed token if necessary
        this.accessToken.getValue(true)

            .then(function (accessToken) {
                context.accessToken = accessToken;
                axios({
                    url: `https://worldcat.org/bib/data/${oclcnumber}`,
                    method: "GET",
                    headers: {
                        "Accept": "application/atom+json",
                        "Authorization": `Bearer ${context.accessToken.getAccessTokenString()}`
                    }
                })
                    .then(function (response) {
                        bibRecord = response.data;
                        res.redirect("/");
                    })
                    .catch(function (err) {
                        error = err && err.response && err.response.body ? err.response.body : err;
                        res.redirect("/error");
                    });
            })
            .catch(function (err) {
                error = err;
                res.redirect("/error");
            });
    }
});
