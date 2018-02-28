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
edit server.js and install your wskey parameters
```
const wskey = new Wskey({
    "clientId": "{your clientId}",
    "secret": "{your secret}",
    "authenticatingInstitutionId": "{your institution ID}",
    "contextInstitutionId": "{your institution ID}",
    "redirectUri": "http://localhost:8000/auth/", // example catches this path
    "responseType": "code",
    "scope": ["{scope 1}","{scope 2}","..."]
});
```
save the file
```
node server
```
navigate to localhost:8000