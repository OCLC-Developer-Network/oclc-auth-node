# Client Credentials Grant

Client Credentials Grant flow *does not* require a user to sign into OCLC in order to receive an Access Token. This flow assumes the client has already validated the user.

See [Client Credentials Grant](https://www.oclc.org/developer/develop/authentication/access-tokens/client-credentials-grant.en.html) at the OCLC Developer Network for more details.

## Usage

Make a directory to work in and change to it.

```
git clone https://github.com/OCLC-Developer-Network/oclc-auth-node.git

cd oclc-auth-node

npm install

cd examples/clientCredentialsGrant

npm install

cd src
```
Edit server.js and define your authentication parameters.

Note that in this example, the user is running on port 8000 on localhost, and the redirect URI points to ```localhost:8000/auth/``` .
```
// Authentication parameters -------------------------------------------------------------------------------------------

const wskey = new Wskey({
    "clientID": "{your clientID}",
    "secret": "{your secret}",
    "contextInstitutionId": "{your institution ID}",
    "redirectUri": "http://localhost:8000/auth/",
    "responseType": "code",
    "scope": ["{scope 1}","{scope 2}","..."]
});

const user = new User({
    principalID: "{your principal ID}",
    principalIDNS: "{your principal IDNS}",
    authenticatingInstitutionId: "{your institution ID}"
});

let accessToken = new AccessToken({
    wskey: wskey,
    user: user,
    grantType: "client_credentials"
});

const port = 8000; // should match the redirect uri configured on the wskey
```
Save the file with your authentication parameters.

Run the server.
```
node server
```
Navigate to localhost:8000

This example allows you to request a Bibliographic Record using your token, provided your key is scoped for "WorldCatMetadataAPI".

### Using the OCLCAuthentication middleware in node express

In this example we applied an OCLC Middleware for node express to handle the authentication flow for us. We tell the middleware where our home path is (```/```), and the link to start authentication (```/login```). The middleware also needs to know what port we are running on so it can match the redirect URI. If you are running in production on port 80 (http) or 443 (https), then omit the port parameter and no ":port" will be appended to the dns name in the url when matching the redirect URI.

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

