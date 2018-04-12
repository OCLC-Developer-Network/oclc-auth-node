# Explicit Authorization Flow Example

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
Edit [server.js](https://github.com/OCLC-Developer-Network/oclc-auth-node/blob/master/examples/explicitAuthorizationFlow/src/server.js) and define your authentication parameters.

Note that in this example, the example is running on port 8000 on localhost, and the redirect URI points to ```localhost:8000/auth/``` .

To enable refresh tokens, add ```"refresh_token"``` to the list of scopes. [Refresh Tokens](https://www.oclc.org/developer/develop/authentication/access-tokens/refresh-token.en.html) allow a user to be reauthenticated without going through the authentication flow when their token expires. You can try this example with that parameter set to ```true``` as well.

Run the server:
```
node server
```
Navigate to localhost:8000 in a web browser.

This example allows you to request a Bibliographic Record using your token, provided your key is scoped for "WorldCatMetadataAPI".
