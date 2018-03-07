# Explicit Authorization Flow example

Explicit Authorization Flow requires a user to sign into OCLC in order to receive an Access Token.

See [Explicit Authorization Code](https://www.oclc.org/developer/develop/authentication/access-tokens/explicit-authorization-code.en.html) at the OCLC Developer Network for more details.

## Usage

Make a directory to work in and change to it.

```
git clone https://github.com/OCLC-Developer-Network/oclc-auth-node.git

cd oclc-auth-node

npm install

cd examples/explicitAuthenticationFlow

npm install

cd src
```
edit server.js and define your authentication parameters

Note that in this example, the user is running on port 8000 on localhost, and the redirect URI points to ```localhost:8000/auth/``` .

The user also chose not to request refresh tokens by setting ```useRefreshTokens: false``` when creating the Access Token. [Refresh Tokens](https://www.oclc.org/developer/develop/authentication/access-tokens/refresh-token.en.html) allow a user to be reauthenticated without going through the authentication flow when their token expires. You can try this example with that parameter set to ```true``` as well.
```
// Authentication parameters -------------------------------------------------------------------------------------------

const wskey = new Wskey({
    "clientId": "{your clientId}",
    "secret": "{your secret}",
    "contextInstitutionId": "{your institution ID}",
    "redirectUri": "http://localhost:8000/auth/",
    "responseType": "code",
    "scope": ["{scope 1}","{scope 2}","..."]
});

let user = new User({
    "authenticatingInstitutionId": "{your institution ID}"
});

let accessToken = new AccessToken({
    wskey: wskey,
    user: user,
    grantType: "authorization_code",
    useRefreshTokens: false
});

const port = 8000; // should match the redirect uri configured on the wskey
```
save the file
```
node server
```
navigate to localhost:8000

This example allows you to request a Bibliographic Record using your token, provided your key is scoped for "WorldCatMetadataAPI".

### Using the OCLCAuthentication middleware in node express

Note that we applied an OCLC Middleware for node express to handle the authentication flow for us. We tell the middleware where our home path is (```/```), and the link to start authentication (```/login```). The middleware also needs to know what port we are running on so it can match the redirect URI. If you are running in production on port 80 (http) or 443 (https), then omit the port parameter and no ":port" will be appended to the dns name in the url when matching the redirect URI.

```
app.use(OCLCMiddleware.authenticationManager({
    homePath: "/",
    authenticationPath: "/login",
    port: port, // optional, if omitted assumes 80 for http or 443 for https
    accessToken: accessToken,
    user: user,
    wskey: wskey,
}));
```