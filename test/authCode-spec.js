const WSKey = require("../src/wskey.js");
const AuthCode = require("../src/authCode.js");
const User = require("../src/user.js");

describe("Authorization Code", function () {

    it("should generate an authorization code url", function () {

        const wskey = new WSKey({
            clientId: "7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOyH3",
            contextInstitutionId: "128807",
            redirectUri: "http://localhost/auth/",
            responseType: "code",
            scope: ["WMS_CIRCULATION", "WMS_NCIP"]
        });

        const user = new User({
            authenticatingInstitutionId: "128807"
        });

        const expectedLoginURL = "https://authn.sd00.worldcat.org/oauth2/authorizeCode?client_id=7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOyH3&authenticatingInstitutionId=128807&contextInstitutionId=128807&redirect_uri=http%3A%2F%2Flocalhost%2Fauth%2F&response_type=code&scope=WMS_CIRCULATION%20WMS_NCIP";

        expect(AuthCode.getLoginUrl({wskey: wskey, user: user})).toEqual(expectedLoginURL);
    });
});