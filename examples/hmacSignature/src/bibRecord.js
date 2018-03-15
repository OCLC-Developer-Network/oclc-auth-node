/**
 * HMAC Signature example - node server code
 * @type {*|createApplication}
 */

const Wskey = require("nodeauth/src/Wskey");
const User = require("nodeauth/src/user");
const rp = require("request-promise-native");

const user = new User({
    principalID: "8eaa9f92-3951-431c-975a-d7df26b8d131",
    principalIDNS: "urn:oclc:wms:da",
    authenticatingInstitutionId: "128807"
});

const wskey = new Wskey("aCcndeDMjFO9vszkDrB6WJg1UnyTnkn8lLupLKygr0U1KJZoeAittuVjGRywCDdrsxahv2bsjgKq6hLM", "EyZfIJdGQXeatxQOjdkQZw==",
    {
        contextInstitutionId: "128807",
        user: user
    }
);

// Construct a promise to retrieve a bib record
const getBibRecord = function (oclcNumber) {

    const url = `https://worldcat.org/bib/data/${oclcNumber}`;

    return rp({
        uri: url,
        headers: {
            "Accept": "application/atom+json",
            "Authorization": wskey.getHMACSignature("GET", url)
        },
        json: true
    });
};

// Execute the promise to retrieve the bibliographic record for
// "The French Cook: sauces" by Holly Herrick and Steven Rothfeld.
getBibRecord("829180274")

    .then(function (bibRecord) {
        console.log(JSON.stringify(bibRecord, null, 4));
    })

    .catch(function (err) {
        console.log("*** Unable to retrieve Bibliographic Resource.\n");
    });
