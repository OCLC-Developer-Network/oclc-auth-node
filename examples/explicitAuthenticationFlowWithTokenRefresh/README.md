# Explicit Authorization Flow example

Explicit Authorization Flow requires a user to sign into OCLC in order to receive an Access Token. A refresh token can be requested at the same time, and then used to request a fresh token before the current one expires, without requiring reauthentication.

See [Refresh Token](https://www.oclc.org/developer/develop/authentication/access-tokens/refresh-token.en.html) at the OCLC Developer Network for more details.

## Usage

Make a directory to work in and change to it.

```
git clone https://github.com/OCLC-Developer-Network/oclc-auth-node.git

cd oclc-auth-node

npm install

cd examples/explicitAuthenticationFlowWithTokenRefresh

npm install

cd src
```
edit server.js and install your wskey parameters. Note that you must include "refresh_token" as one of the scopes so that a refresh token is issued with the request.
```
const wskey = new Wskey({
    "clientId": "{your clientId}",
    "secret": "{your secret}",
    "authenticatingInstitutionId": "{your institution ID}",
    "contextInstitutionId": "{your institution ID}",
    "redirectUri": "http://localhost:8000/auth/", // example catches this path
    "responseType": "code",
    "scope": ["refresh_token", "{scope 1}","{scope 2}","..."]
});
```
save the file
```
node server
```
navigate to localhost:8000

