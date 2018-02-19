## Add the Library to Your Project

```
npm install TODO
```

## Usage

### HMAC Authentication

You can make server to server requests using an [HMAC Signature](https://www.oclc.org/developer/develop/authentication/hmac-signature.en.html). HMAC authentication is only for server to server requests, and should never be used on the client side (browser or mobile) because doing so would expose the Secret. See Explicit and Mobile authentication flows for those cases.

#### Get an HMAC Authorization Header

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
});

console.log(authorizationHeader);

```

You will get an authorization header similar to the one below. Because the signature is timestamp dependent, your signature would be different even if all the parameters were the same.

```
http://www.worldcat.org/wskey/v2/hmac/v1 clientId="7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOy5H3", timestamp="1518632079", nonce="a9bebe15", signature="VcK+9RyCHOVRCHxO7J6DzoYDQfkz56d5z4nFBKgtNts=", principalId="wera9f92-3751-4r1c-r78a-d78d13df26b1", principalIdns="urn:oclc:wms:da"
```

#### Use the Authorization Header to get a response from the API

Pass the Authorization Header value along as an [Authorization Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) value when making the GET request to the URL you calculated it against:

```https://128807.share.worldcat.org/circ/pulllist/129479?startIndex=1&itemsPerPage=1```

### Explicit Authorization Code

You can make client to server requests (ie, from a web browser) using the [Explicit Authorization Code](https://www.oclc.org/developer/develop/authentication/access-tokens/explicit-authorization-code.en.html) pattern.

This is a two step process, first you request an authorization code. The user is redirected to a sign in page, and if they successfully sign in, they are redirected back to your page and an access token is passed along.

#### Get an Authorization Code

```
const AuthCode = require("../src/authCode.js");

const authCode = new AuthCode({
    "clientId": "7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOyH3",
    "secret" : "eUK5Qz9AdsZQrCPRRliBzQ=="
    "authenticatingInstitutionId": "128807",
    "contextInstitutionId": "128807",
    "redirectUri": "http://localhost/auth/",
    "responseType": "code",
    "scope": ["WMS_CIRCULATION", "WMS_NCIP"]
});

let loginUrl = authCode.getLoginUrl();

if (loginUrl.err) {
    // The error is not null, so print out the error message
    console.log(loginUrl.err)
} else {
    // No error, use the url
    console.log("The url is " + loginUrl.url)
}
```

If everything went right, loginUrl would look like this:

```
{url: "https://authn.sd00.worldcat.org/oauth2/authorizeCode?client_id=7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOyH3&authenticatingInstitutionId=128807&contextInstitutionId=128807&redirect_uri=http%3A%2F%2Flocalhost%2Fauth%2F&response_type=code&scope=WMS_CIRCULATION%20WMS_NCIP"
}
```

You can then use that url to request an Authorization Code.

#### Get an Access Token

Once you've received an Authorization Code, you can request a Token. A typical Authorization Code would look like this:

```
https://www.oclc.org/developer/develop/authentication/access-tokens/explicit-authorization-code.en.html
```

To request the token (using the authCode defined in the previous step):

```
let tokenRequestUrl = authCode.getTokenRequestUrl();

if (tokenRequestUrl.err) {
    // The error is not null, so print out the error message
    console.log(loginUrl.err)
} else {
    // No error, use the url
    console.log("The url is " + tokenRequestUrl.url)
}
```

If everything went right, tokenRequestUrl would look like:

```

```


### Access Token with Client Credentials Grant

TODO

### Access Token with User Agent (Mobile Pattern)

TODO

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