## OCLC Authentication Library for Node.js developers

This library contains javascript classes that handle the authentication chore so you can focus on developing your node application.

This library supports

* HMAC Hashing
* Explicit Authorzation Flow (User signs in, you get a token)
* Client Credentials Grant (Pass the user credentials directly and get a token)

Examples for each type of authentication are provided.

## Quick Start

### Install in Your Project

From the command line of your project

```
npm install git+https://github.com/OCLC-Developer-Network/oclc-auth-node.git
```

Or add this line to your package.json file

```
"nodeauth": "git+https://github.com/OCLC-Developer-Network/oclc-auth-node.git"
```

## Basic Usage

By placing this in your file:

```
const nodeauth = require('nodeauth');
```

you will have access to the OCLC [authentication classes](src):

```
nodeAuth.AccessToken,
nodeauth.AuthCode,
nodeauth.RefreshToken,
nodeauth.User,
nodeauth.Wskey
```

## Examples

Examples are provided for HMAC Authentication, Explicit Authorization Flow and Client Credentials Grant:

### HMAC Authentication

You can make server to server requests using an [HMAC Signature](https://www.oclc.org/developer/develop/authentication/hmac-signature.en.html). HMAC authentication is only for server to server requests, and should never be used on the client side (browser or mobile) because doing so would expose the Secret. See Explicit and Mobile authentication flows below for those cases.

HMAC Signature uses a key and secret to authenticate server to server, request by request. It is never used client side to server.

Start by creating an instance of the nodeauth library:

```
const nodeauth = require("nodeauth");
```

Create Wskey and User objects:

```
const wskey = new nodeauth.Wskey(key, secret);
const user = new nodeauth.User(authenticatingInstitutionId, principalID, principalIDNS);
```

Use the library get an Authorization Header:

```
const options = {user: user};

const url = 'https://worldcat.org/bib/data/829180274?classificationScheme=LibraryOfCongress&holdingLibraryCode=MAIN';

const authorizationHeader = wskey.getHMACSignature("GET", url, options);
```

For a complete working example, see [HMAC Signature Example](examples/hmacSignature/README.md) in the  ```examples/hmacSignature``` folder.

### Explicit Authorization Flow

You can make client to server requests (ie, from a web browser) using the [Explicit Authorization Code](https://www.oclc.org/developer/develop/authentication/access-tokens/explicit-authorization-code.en.html) pattern.

This is a two step process, first you request an authorization code and the user is redirected to a sign in page. Second (if they successfully sign in), they are redirected back to your page and an access token is passed along.

Start by creating an instance of the nodeauth library:

```
const nodeauth = require("nodeauth");
```

Create a Wskey object. Note that by passing "refresh_token" as a service, we ask that a refresh token be created.

```
const options = {
    services: ["WorldCatMetadataAPI", "refresh_token"],
    redirectUri: "http://localhost:8000/auth/"
};

const wskey = new nodeauth.Wskey(key, secret, options);
```

First, use the Wskey object to get a login url:

```
const loginUrl = wskey.getLoginURL(authenticatingInstitutionId, contextInstitutionId);
```

Handle the redirect and strip the authCode from the url.

Then use the Wskey object to get an access token from the ```getAccessTokenWithAuthCode``` promise:

```
        wskey.getAccessTokenWithAuthCode(authCode, authenticatingInstitutionId, contextInstitutionId)
            .then(function (accessToken) {
                context.accessToken = accessToken;
            })
            .catch(function (err) {
                res.redirect("/error");
            });
```


For a complete working example, see [Explicit Authorization Flow Example](examples/explicitAuthorizationFlow/README.md) in ```examples/explicitAuthorizationFlow```.

The example works with or without [refresh tokens](https://www.oclc.org/developer/develop/authentication/access-tokens/refresh-token.en.html).

### Client Credentials Grant

Client Credentials Grant flow *does not* require a user to sign into OCLC in order to receive an Access Token. This flow assumes the client has already validated the user.

See [Client Credentials Grant](https://www.oclc.org/developer/develop/authentication/access-tokens/client-credentials-grant.en.html) at the OCLC Developer Network for details on this flow.

Start by creating an instance of the nodeauth library:

```
const nodeauth = require("nodeauth");
```

Create Wskey and User objects:

```
const options = {
    services: ["WorldCatMetadataAPI"]
};

const user = new nodeauth.User(authenticatingInstitutionId, principalID, principalIDNS);
const wskey = new nodeauth.Wskey(key, secret, options);
```

First, get an access token with the ```getAccessTokenWithClientCredentials``` promise.

```
    wskey.getAccessTokenWithClientCredentials(authenticatingInstitutionId, contextInstitutionId, user)

        .then(function (accessToken) {
            myAccessToken = accessToken;
        })
        .catch(function (err) {
            let error = err && err.response && err.response.body ? err.response.body : err;
            console.log(error);
        })
```

Then use the token to get a bib record by setting it in the request header

```
{"Authorization": `Bearer ${accessToken.getAccessTokenString()}`}
```

For an the [Client Credentials Grant Example](examples/clientCredentialsGrant/README.md), go to ```examples/clientCredentialsGrant```.

### Overriding authentication endpoints

By default, the node library uses the OCLC Production endpoints for authentication.

If you want to override these, add these to the top of your script as global variables:

```
AUTHORIZATION_SERVER_OVERRIDE = "https://...";
HMAC_AUTHORIZATION_URL_OVERRIDE= "http://...";
```

The use case would be for internal testing at OCLC.
