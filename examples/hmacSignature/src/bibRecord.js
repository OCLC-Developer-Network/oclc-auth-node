/**
 * HMAC Signature example - node server code
 */

const axios = require("axios");

const Wskey = require("nodeauth/src/Wskey");
const User = require("nodeauth/src/user");

const key = "{your clientID}";
const secret = "{your secret}";
const wskey = new Wskey(key, secret);

const authenticatingInstitutionId = "{your institution ID}";
const principalID = "{your principal ID}";
const principalIDNS = "{your principal IDNS}";
const user = new User(authenticatingInstitutionId, principalID, principalIDNS);
const options = {user: user};

const url = 'https://worldcat.org/bib/data/829180274?classificationScheme=LibraryOfCongress&holdingLibraryCode=MAIN';

const authorizationHeader = wskey.getHMACSignature("GET", url, options);

console.log(authorizationHeader);

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

    .catch(function (err) {
        console.log("\n*** Unable to retrieve Bibliographic Resource. ***\n");
        console.log(err);
    });

