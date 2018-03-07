## Add the Library to Your Project

```
npm install https://github.com/OCLC-Developer-Network/oclc-auth-node.git
```

## Usage

### WSKey

| Object| usage / options | Notes  |
|-------|-----------------|--------|
| Wskey | Wskey = require("nodeauth/src/Wskey") | Creates a WSKey class instance|
| wskey | <pre>wskey = new Wskey({<br>"clientId": your web services public client ID,<br>"secret": your web services key secret,<br>"contextInstitutionId": ID of the institution to get data against,<br>"redirectUri": for tokens, where to land back after authenticating<br>"responseType": "code",<br>"scope": \["scope1", "scope2", ... "refresh_token"]<br>})</pre> | Initializes a Wskey instance. |
| getAuthorizationHeader | <pre>wskey.getAuthorizationHeader({<br>    "method": The request method (GET, POST, etc)<br>    "url": The url to be called<br>    "user": The User object<br>})</pre>| Returns a Promise that resolves to the Authorization Header or rejects with an error message. |
| getClientId | wskey.getClientId() | Returns the clientId string |
| setClientId | wskey.setClientId(string) | Sets the client Id |
| getSecret | wskey.getSecret() | returns the secret |
| setSecret| wskey.setSecret(string) | sets the secret |
| getContextInstitutionId | wskey.getContextInstitutionId() | gets the Context Institution ID |
| setContextInstitutionId | wskey.setContextInstitutionId(string) | sets the Context Institution ID
| getRedirectUri | wskey.getRedirectUri() | gets the redirect URI |
| setRedirectUri | wskey.setRedirectUri(string) | sets the redirect URI |
| getResponseType | wskey.getResponseType() | gets the response type
| setResponseType | wskey.setResponseType(string) | sets the response type |
| getScope | wskey.getScope() | gets a string array of scope(s) |
| setScope | wskey.setScope( \[string array] ) | sets the scope to a string array. Add "refresh_token" to the list to request refresh tokens. |

### User

| Object| usage / options | Notes  |
|-------|-----------------|--------|


### Access Token

## Examples

### HMAC Authentication Example

You can make server to server requests using an [HMAC Signature](https://www.oclc.org/developer/develop/authentication/hmac-signature.en.html). HMAC authentication is only for server to server requests, and should never be used on the client side (browser or mobile) because doing so would expose the Secret. See Explicit and Mobile authentication flows below for those cases.

HMAC Signature uses a clientID and secret to authenticate server to server, request by request. It is never used client side to server.

For an example of Explicit Authentication Flow, go to ```examples/hmacSignature``` ([README](examples/hmacSignature/README.md)).

## Request an Access Token

Because requesting access tokens works with a browser, the Node Authentication Library includes a node express middleware to manage the authentication flow.

### Explicit Flow Example

You can make client to server requests (ie, from a web browser) using the [Explicit Authorization Code](https://www.oclc.org/developer/develop/authentication/access-tokens/explicit-authorization-code.en.html) pattern.

This is a two step process, first you request an authorization code. The user is redirected to a sign in page, and if they successfully sign in, they are redirected back to your page and an access token is passed along.

For an example of Explicit Authentication Flow, go to ```examples/explicitAuthenticationFlow``` ([README](examples/explicitAuthenticationFlow/README.md)). The example works with or without [refresh tokens](https://www.oclc.org/developer/develop/authentication/access-tokens/refresh-token.en.html).

### Client Credentials Grant Example

Client Credentials Grant flow *does not* require a user to sign into OCLC in order to receive an Access Token. This flow assumes the client has already validated the user.

See [Client Credentials Grant](https://www.oclc.org/developer/develop/authentication/access-tokens/client-credentials-grant.en.html) at the OCLC Developer Network for details on this flow.

For an example of Client Credentials Grant, go to ```examples/clientCredentialsGrant``` ([README](examples/clientCredentialsGrant/README.md)).

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