/**
 * HMAC Signature example - node server code
 * @type {*|createApplication}
 */

const Wskey = require("nodeauth/src/Wskey");
const User = require("nodeauth/src/user");
const rp = require("request-promise-native");

const wskey = new Wskey({
    clientId: "{your clientId}",
    secret: "{your secret}",
    contextInstitutionId: "{your institution ID}"
});

const user = new User({
    principalId: "{your principal ID}",
    principalIdns: "{your principal IDNS}",
    authenticatingInstitutionId: "{your institution ID}"
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
