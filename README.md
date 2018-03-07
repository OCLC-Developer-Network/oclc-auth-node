## Add the Library to Your Project

```
npm install https://github.com/OCLC-Developer-Network/oclc-auth-node.git
```

## Usage

### WSKey

| Object| usage / options | Notes  |
|-------|-----------------|--------|
| Wskey | <pre>const Wskey = require("nodeauth/src/Wskey")</pre> | Wskey Class|
| wskey | <pre>wskey = new Wskey({<br>"clientId": your web services public client ID,<br>"secret": your web services key secret,<br>"contextInstitutionId": ID of the institution to get data against,<br>"redirectUri": for tokens, where to land back after authenticating<br>"responseType": "code",<br>"scope": \["scope1", "scope2", ... "refresh_token"]<br>})</pre> | WSKey class instance. |
| getAuthorizationHeader | <pre>wskey.getAuthorizationHeader({<br>    "method": The request method (GET, POST, etc)<br>    "url": The url to be called<br>    "user": The User object<br>})<br>.then( function(authorizationHeader){} )<br>.catch( function(err){} )</pre>| Returns a Promise that resolves to the Authorization Header or rejects with an error message. |
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
|User|<pre>const User = require("nodeauth/src/User")</pre> | User class.|
|user|<pre>let user = new User({<br>    principalId: "your Principal ID"<br>    principalIdns: "your Principal IDNS"<br>    authenticatingInstitutionId:<br>        "your Authenticating Institution ID"<br>})</pre>| User class instance.|
|getPrincipalId | user.getPrincipalId() | gets the Principal ID|
|setPrincipalId | user.setPrincipalId(string)| sets the Principal ID |
|getPrincipalIdns|user.getPrincipalIdns()|gets the Principal IDNS|
|setPrincipalIdns|user.setPrincipalIdns(string)|sets the Principal IDNS|
|getAuthenticatingInstitutionId|user.getAuthenticatingInstitutionId()|gets the Authenticating Institution ID|
|setAuthenticatingInstitutionId|user.setAuthenticatingInstitutionId(string)|sets the Authenticating Institution ID|


### Access Token

| Object| usage / options | Notes  |
|-------|-----------------|--------|
| AccessToken | <pre>const AccessToken = require("nodeauth/src/AccessToken")</pre>| AccessToken class. |
| accessToken| <pre>let accessToken = new AccessToken({<br>    wskey: Wskey object,<br>    grantType: "client_credentials"<br>        or "authorization_code"<br>        or "refresh_token"<br>    user: User object<br>});</pre> | AccessToken class instance.|
| getAccessToken | <pre>accessToken.getAccessToken({})<br>.then( function(accessToken){} )<br>.catch( function(err){} )</pre>| A promise that resolves when a token has been retrieved. Note that this method acts on itself - the accessToken it is called on is updated and it returns itself in the then() to permit further chaining. This method will return an unexpired token if one already exists, get a new one if no token exists, or get a refreshed token - all automatically.|
| createAccessToken | <pre>accessToken.createAccessToken()<br>   .then( function(accessToken){} )<br>   .catch( function(err){} )</pre> | A promise that resolves when a token has been created. Note that this method acts on itself - the accessToken it is called on is updated and it returns itself in the then() to permit further chaining. |
| getValue | accessToken.getValue() | returns the access token string |
| isExpired|accessToken.isExpired()| true if the access token is expired |
| isRefreshTokenExpired|accessToken.isRefreshTokenExpired()| true if the refresh token is expired|
| getAuthorizationCode | accessToken.getAuthorizationCode() | returns the authorization code |
| setAuthorizationCode | accessToken.setAuthorizationCode(string) | set the authorization code |
| getContextInstitutionId | accessToken.getContextInstitutionId() | gets the Context Institution ID |
| getErrorCode | accessToken.getErrorCode() | gets the token error code, if any|
|getExpiresAt|accessToken.getExpiresAt()| gets the Expires At ISO 8601 time |
|getExpiresIn|accessToken.getExpiresIn()| gets the Expires In seconds |
|getGrantType|accessToken.getGrantType()|gets the Grant Type|
|setGrantType|accessToken.setGrantType(string) | sets the Grant Type|
|getUser|accessToken.getUser()| gets the User object |
|setUser|accessToken.setUser(User object) | sets the User object |
|getRefreshToken|accessToken.getRefreshToken()| gets the refresh token |
|getTokenType| accessToken.getTokenType() | gets the token type |

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
git clone https://github.com/OCLC-Developer-Network/oclc-auth-node

cd oclc-auth-node

npm install
```

### Unit Tests

```
npm test
```