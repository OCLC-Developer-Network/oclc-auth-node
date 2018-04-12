# Client Credentials Grant Example

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
Edit [server.js](https://github.com/OCLC-Developer-Network/oclc-auth-node/blob/master/examples/clientCredentialsGrant/src/server.js) and define your authentication parameters.

Save the file with your authentication parameters.

Run the server.
```
node server
```
Navigate to localhost:8000

This example allows you to request a Bibliographic Record using your token, provided your key is scoped for "WorldCatMetadataAPI".

