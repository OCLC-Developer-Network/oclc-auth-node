/**
 * Explicit Authorization Flow example - node server code
 * @type {*|createApplication}
 */

const Wskey = require("nodeauth/src/Wskey");
const User = require("nodeauth/src/user");

const express = require("express");
const rp = require("request-promise-native");
const url = require("url");

// Authentication parameters -------------------------------------------------------------------------------------------

const authenticatingInstitutionId = "128807";
const contextInstitutionId = "128807";

const wskey = new Wskey("aCcndeDMjFO9vszkDrB6WJg1UnyTnkn8lLupLKygr0U1KJZoeAittuVjGRywCDdrsxahv2bsjgKq6hLM", "EyZfIJdGQXeatxQOjdkQZw==",
    {
        "redirectUri": "http://localhost:8000/auth/",
        "services": ["WorldCatMetadataAPI", "refresh_token"],
    });

let authCode;
let accessToken;

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
        pageTitle: "Explicit Authentication Flow",
        accessTokenString: context.accessToken && context.accessToken.getAccessTokenString() ?
            context.accessToken.getAccessTokenString() : "Press button to get token.",
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
                res.redirect("/")
            })
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
    authCode = req.query.code;
    res.redirect("/login");
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
                rp({
                    url: `https://worldcat.org/bib/data/${oclcnumber}`,
                    method: "GET",
                    headers: {
                        "Accept": "application/atom+json",
                        "Authorization": `Bearer ${context.accessToken.getAccessTokenString()}`
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
            })
            .catch(function (err) {
                console.log(err)
            });
    }
});
