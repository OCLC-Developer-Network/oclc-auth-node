# HMAC Signature example

HMAC Signature uses a clientID and secret to authenticate server to server. It is never used client side to server.

See [HMAC Signature](https://www.oclc.org/developer/develop/authentication/hmac-signature.en.html) at the OCLC Developer Network for more details.

## Usage

Make a directory to work in and change to it.

```
git clone https://github.com/OCLC-Developer-Network/oclc-auth-node.git

cd oclc-auth-node

npm install

cd examples/hmacSignature

npm install

cd src
```
edit bibRecord.js and define your authentication parameters.
* clientId
* secret
* principalId
* principalIdns
* context and authentication institution ID's

run the example:

```
node bibRecord.js
```

If your authentication parameters are correct, you should see a (lengthy) atom+json representation of a bibliographic record for OCLC number 829180274.