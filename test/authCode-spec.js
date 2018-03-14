const WSKey = require("../src/wskey.js");
const AuthCode = require("../src/authCode.js");
const User = require("../src/user.js");

describe("Authorization Code", function () {

    it("should generate an authorization code url", function () {

        const expectedLoginURL = "https://authn.sd00.worldcat.org/oauth2/authorizeCode?client_id=7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOyH3&authenticatingInstitutionID=128807&contextInstitutionID=128807&redirect_uri=http%3A%2F%2Flocalhost%2Fauth%2F&response_type=code&scope=WMS_CIRCULATION%20WMS_NCIP";

        const authCode = new AuthCode(
            {
                clientID: "7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOyH3",
                authenticatingInstitutionID: "128807",
                contextInstitutionID: "128807",
                redirectUri: "http://localhost/auth/",
                scope: ["WMS_CIRCULATION", "WMS_NCIP"]
            }
        );

        expect(authCode.getLoginUrl()).toEqual(expectedLoginURL);
    });
});