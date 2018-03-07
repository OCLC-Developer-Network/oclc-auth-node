# HMAC Signature example

HMAC Signature uses a clientID and secret to authenticate server to server, request by request. It is never used client side to server.

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
edit example.js and define your authentication parameters