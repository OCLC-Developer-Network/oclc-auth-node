## Add the Library to Your Project

```
npm install TODO
```

## Usage

### Server Side HMAC Authentication

You can make server to server requests uses HMAC authentication. HMAC authentication should never be used on the client side (browser or mobile) because doing so would expose the Secret. See Explicit and Mobile authentication flows for those cases.

We offer two ways to make the calls - with a callback and with a promise. Here are examples of GET and POST operations.

#### Example of an HMAC GET request

Here we attempt to get a pull list using the WMS Circulation API.

See [Pull List Resource for WMS Circulation](https://www.oclc.org/developer/develop/web-services/wms-circulation-api/pull-list-resource.en.html) for API details.

##### Callback Style

```
    const Hmac = require("../src/hmac.js");

    const hmac = new Hmac({
        "wskey": "YOUR CLIENT ID",
        "secret": "YOUR SECRET",
        "principalId": "YOUR principal id",
        "principalIdns": "YOU principal idns"
    });

    hmac.makeHmacRequestCallback({
        "url": "https://128807.share.worldcat.org/circ/pulllist/129479?startIndex=1&itemsPerPage=1",
        "method": "GET",
        "body": "",
        "headers": {
            "accept": "application/json"
        }
    }, function (error, response, body) {
        // Do something with the response
        console.log(body);
    });
```

##### Promise Style

#### Example of a POST request

Here we attempt to do a staff checkin of an item using the WMS NCIP API.

See [WMS NCIP Service Staff Profile](https://www.oclc.org/developer/develop/web-services/wms-ncip-service/staff-profile.en.html) on the OCLC Developer Network for API details.

##### Callback Style


    const Hmac = require("../src/hmac.js");

    const hmac = new Hmac({
        "wskey": "YOUR CLIENT ID",
        "secret": "YOUR SECRET",
        "principalId": "YOUR principal id",
        "principalIdns": "YOU principal idns"
    });

    const body='<NCIPMessage xmlns="http://www.niso.org/2008/ncip" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ncip="http://www.niso.org/2008/ncip" xsi:schemaLocation="http://www.niso.org/2008/ncip http://www.niso.org/schemas/ncip/v2_01/ncip_v2_01.xsd" ncip:version="http://www.niso.org/schemas/ncip/v2_01/ncip_v2_01.xsd">\n' +
        '<CheckInItem>\n' +
        '<InitiationHeader>\n' +
        '<FromAgencyId>\n' +
        '<AgencyId ncip:Scheme="http://oclc.org/ncip/schemes/agencyid.scm">129479</AgencyId>\n' +
        '</FromAgencyId>\n' +
        '<ToAgencyId>\n' +
        '<AgencyId>129479</AgencyId>\n' +
        '</ToAgencyId>\n' +
        '<ApplicationProfileType ncip:Scheme="http://oclc.org/ncip/schemes/application-profile/platform.scm">Version 2011</ApplicationProfileType>\n' +
        '</InitiationHeader>\n' +
        '<ItemId>\n' +
        '<AgencyId>128807</AgencyId>\n' +
        '<ItemIdentifierValue>10176</ItemIdentifierValue>\n' +
        '</ItemId>\n' +
        '</CheckInItem>\n' +
        '</NCIPMessage>';

    hmac.makeHmacRequestCallback({
        "url": "https://circ.sd00.worldcat.org/ncip",
        "method": "POST",
        "body": body,
        "headers": {
            "accept": "application/json"
        }
    }, function (error, response, body) {
        // Do something with the response
        console.log(body);
    });

##### Promise Style


TODO

### Access Token with Client Credentials Grant

TODO

### Access Token with User Agent (Mobile Pattern)

TODO

## Clone and Test this Library

### Installation

```
git clone TODO

npm install
```

### Unit Tests

```
npm test
```