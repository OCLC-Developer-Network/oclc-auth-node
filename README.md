## Add the Library to Your Project

```
npm install TODO
```

## Usage

### HMAC Authentication

You can make server to server requests using an [HMAC Signature](https://www.oclc.org/developer/develop/authentication/hmac-signature.en.html). HMAC authentication is only for server to server requests, and should never be used on the client side (browser or mobile) because doing so would expose the Secret. See Explicit and Mobile authentication flows for those cases.

#### Get an HMAC Authorization Header

In javascript, an HMAC header must be calculated asynchronously. We use a Promise to do so:

```
const Hmac = require("../src/hmac.js");

// Initialize an Hmac object with your authentication Parameters
const hmac = new Hmac({
    "clientId": "7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOy5H3",
    "secret": "eUK5Qz9AdsZQrCPRRliBzQ==",
    "principalId": "wera9f92-3751-4r1c-r78a-d78d13df26b1",
    "principalIdns": "urn:oclc:wms:da"
});

// Get the authorization header for a given URL and Method.
let authorizationHeader = hmac.getAuthorizationHeader({
    "url": "https://128807.share.worldcat.org/circ/pulllist/129479?startIndex=1&itemsPerPage=1",
     "method": "GET"
})

.then(function(authorizationHeader){
    // Do something with the authorization header
    console.log(authorizationHeader)
})

.catch(function(err){
    // or handle the error
    console.log(err);
});

```

You will get an authorization header similar to the one below. Because the signature is timestamp dependent, your signature would be different even if all the parameters were the same.

```
http://www.worldcat.org/wskey/v2/hmac/v1
clientId="7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOy5H3",
timestamp="1518632079", nonce="a9bebe15", signature="VcK+9RyCHOVRCHxO7J6DzoYDQfkz56d5z4nFBKgtNts=",
principalId="wera9f92-3751-4r1c-r78a-d78d13df26b1", principalIdns="urn:oclc:wms:da"
```

#### Use the Authorization Header to get a response from the API

Pass the Authorization Header value along as an [Authorization Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) value when making the GET request to the URL you calculated it against:

```https://128807.share.worldcat.org/circ/pulllist/129479?startIndex=1&itemsPerPage=1```

## Request an Access Token

### Explicit Flow Example

You can make client to server requests (ie, from a web browser) using the [Explicit Authorization Code](https://www.oclc.org/developer/develop/authentication/access-tokens/explicit-authorization-code.en.html) pattern.

This is a two step process, first you request an authorization code. The user is redirected to a sign in page, and if they successfully sign in, they are redirected back to your page and an access token is passed along.

In this simple example, we request an authorization code and retrieve an access token.

#### index.html file

The user can press the authenticate button, sign in and get an access token.

```
<html>
<head>
   <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
</head>
<body>

<h1>Explicit Authentication Flow Example</h1>
<a href="/authenticate">
   <button id="authenticate-button" class="btn btn-primary">Authenticate</button>
</a>
<pre id="token"></pre>

<script>
    // Display the token parameters, if one has been requested
    $.ajax({
        "url": "/token",
    }).done(function (result) {
        if (result !== "") {
            let resultJson = JSON.parse(result);
            $("#token").html(JSON.stringify(resultJson, null, 4));
        } else {
            $("#token").html("Press Authenticate to obtain an authorization token.");
        }
    });
</script>
</body>
</html>
```

#### nodeJS server file

create a node project, install express, path and this library, and then start the server (node server).

```
const express = require("express");
const path = require("path");
const Wskey = require("nodeauth/src/Wskey");

var wskey = new Wskey({
    "clientId": "bCcndeDMjFO9vszkDrB6WJg1UnyTnkn8lLupLKygG0U1KJZoeAittuVjGRywCDdrsxahv2bsjtKq6hLM",
    "secret": "UyZfIJdG4XlatxQOjdkQZw==",
    "authenticatingInstitutionId": "128807",
    "contextInstitutionId": "128807",
    "redirectUri": "http://localhost:8000/auth/",
    "responseType": "code",
    "scope": ["WMS_CIRCULATION"]
});

// Initialize a server listening to http://localhost:8000
const app = express();
const port = 8000;
app.listen(port, function () {
    console.log("server listening on port " + port);
});

// Handle the main page
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});

// Handle an authentication request be redirecting to login url
app.get("/authenticate", function (req, res) {
    res.send('<html>' +
        '<head>' +
        '<meta http-equiv="refresh" content="0; url=' + wskey.getLoginURL() + '" />' +
        '</head>' +
        '</html>');
});

// Return the token information
app.get("/token", function (req, res, next) {
    if (this.authToken) {
        res.send(JSON.stringify(this.authToken.params));
    } else {
        res.send();
    }
});

// Handle the redirect page
app.get("/auth/", function (req, res) {
    let context = this;
    const redirectHtml = "<html><head>" +
        "<meta http-equiv=\"refresh\" content=\"0; url=http://localhost:8000\" />" +
        "</head></html>";
    wskey.createAuthToken({"authorizationCode": req.query.code, "grantType": "authorization_code"})
        .then(
            function (authToken) {
                context.authToken = authToken;
                res.send(redirectHtml);
            })
        .catch(
            function (err) {
                console.log(err.message);
                res.send(redirectHtml);
            });
});
```

## Clone and Test this Library

### Installation

```
git clone TODO

npm install
```

### Unit Tests

```
npm test
```