## OCLC Authentication Library for Node.js developers

This library contains javascript classes that handle the authentication chore so you can focus on developing your node application.

This library supports

* HMAC Hashing
* Explicit Authentication Flow (User signs in, you get a token)
* Client Credentials Grant (Pass the user credentials directly and get a token)

Examples for each type of authentication are provided.

## Quick Start

### Installation

```
git clone https://github.com/OCLC-Developer-Network/oclc-auth-node

cd oclc-auth-node

npm install
```

## Examples

Take a look at examples for HMAC Authentication, Explicit Authorization Flow and Client Credentials Grant:

### HMAC Authentication Example

You can make server to server requests using an [HMAC Signature](https://www.oclc.org/developer/develop/authentication/hmac-signature.en.html). HMAC authentication is only for server to server requests, and should never be used on the client side (browser or mobile) because doing so would expose the Secret. See Explicit and Mobile authentication flows below for those cases.

HMAC Signature uses a key and secret to authenticate server to server, request by request. It is never used client side to server.

For an example of Explicit Authentication Flow, go to ```examples/hmacSignature``` ([README](examples/hmacSignature/README.md)).

### Explicit Flow Example

You can make client to server requests (ie, from a web browser) using the [Explicit Authorization Code](https://www.oclc.org/developer/develop/authentication/access-tokens/explicit-authorization-code.en.html) pattern.

This is a two step process, first you request an authorization code. The user is redirected to a sign in page, and if they successfully sign in, they are redirected back to your page and an access token is passed along.

For an example of Explicit Authentication Flow, go to ```examples/explicitAuthenticationFlow``` ([README](examples/explicitAuthenticationFlow/README.md)). The example works with or without [refresh tokens](https://www.oclc.org/developer/develop/authentication/access-tokens/refresh-token.en.html).

### Client Credentials Grant Example

Client Credentials Grant flow *does not* require a user to sign into OCLC in order to receive an Access Token. This flow assumes the client has already validated the user.

See [Client Credentials Grant](https://www.oclc.org/developer/develop/authentication/access-tokens/client-credentials-grant.en.html) at the OCLC Developer Network for details on this flow.

For an example of Client Credentials Grant, go to ```examples/clientCredentialsGrant``` ([README](examples/clientCredentialsGrant/README.md)).


