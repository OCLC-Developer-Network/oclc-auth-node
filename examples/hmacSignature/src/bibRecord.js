/**
 * HMAC Signature example - node server code
 * @type {*|createApplication}
 */

const Wskey = require("nodeauth/src/Wskey");
const User = require("nodeauth/src/user");
const rp = require("request-promise-native");

const wskey = new Wskey({
    clientId: "aCcndeDMjFO9vszkDrB6WJg1UnyTnkn8lLupLKygr0U1KJZoeAittuVjGRywCDdrsxahv2bsjgKq6hLM",
    secret: "EyZfIJdGQXeatxQOjdkQZw==",
    contextInstitutionId: "128807"
});

const user = new User({
    principalId: "8eaa9f92-3951-431c-975a-d7df26b8d131",
    principalIdns: "urn:oclc:wms:da",
    authenticatingInstitutionId: "128807"
});

// Construct a promise to retrieve a bib record
const getBibRecord = function (oclcNumber) {

    const url = `https://worldcat.org/bib/data/${oclcNumber}`;

    // Step 1 - calculate the authorization header
    return wskey.getAuthorizationHeader({
        user: user,
        method: "GET",
        url: url
    })

        .then(function (authorizationHeader) {

            // Step 2 - use the authorization header to request the bibliographic record from the
            //          Worldcat Metadata API Bibliographic Resource
            return rp({
                uri: url,
                headers: {
                    "Accept": "application/atom+json",
                    "Authorization": authorizationHeader
                },
                json: true
            });
        })

        .catch(function (err) {
            console.log("\n*** Error calculating the authorization header.\n");
            console.log(err.name + "  " + err.statusCode);
            console.log("n" + err.message.replace(/\</g, "\n<").replace(/&apos;/g, "'").replace(/&quot;/g, '"') + "\n");
            return (err)
        })
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
