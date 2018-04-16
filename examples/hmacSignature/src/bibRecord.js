/**
 * HMAC Signature example - node server code
 */


// You can override the default production authentication endpoint here
//HMAC_AUTHORIZATION_URL_OVERRIDE = "http://optional override...";

const axios = require("axios");
const nodeauth = require("nodeauth");

const key = "{your clientID}";
const secret = "{your secret}";

const wskey = new nodeauth.Wskey(key, secret);

const authenticatingInstitutionId = "{your institution ID}";
const principalID = "{your principal ID}";
const principalIDNS = "{your principal IDNS}";
const user = new nodeauth.User(authenticatingInstitutionId, principalID, principalIDNS);
const options = {user: user};

const url = 'https://worldcat.org/bib/data/829180274?classificationScheme=LibraryOfCongress&holdingLibraryCode=MAIN';

const authorizationHeader = wskey.getHMACSignature("GET", url, options);

axios({
    method: "get",
    url: url,
    headers: {
        "Accept": "application/atom+json",
        "Authorization": authorizationHeader
    }
})
    .then(function (response) {
        console.log(JSON.stringify(response.data, null, 4));
    })

    // Catch the error from the request and interpret it to print a meaningful message.
    .catch(function (err) {
        console.log(err.response.status + " " + err.response.statusText);

        if (wskey.error) {
            console.log(wskey.error);
        }

        let message = "";
        let data = err.response.data;

        if (typeof data === "string") {
            let matches = data ? data.match(/<message>(.*)<\/message>/) : null;
            if (matches && matches.length > 1) {
                message = matches[1].replace(/&apos;/g, "'").replace(/&quot;/g, "\"");
            } else {
                message = data;
            }
        } else if (typeof data === "object") {
            message = data && data.message ? data.message : JSON.stringify(data);
        }
        console.log(message);
        if (message === "Unable to retrieve user permissions due to bad request") {
            console.log("Make sure principalID, principalIDNS and authenticatingInstitutionID are properly set.");
        }
    });

