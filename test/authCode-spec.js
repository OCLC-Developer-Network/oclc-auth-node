const AuthCode = require("../src/authCode.js");

describe("Authorization Code", function () {

    it("should generate an authorization code url", function () {

        const authCode = new AuthCode({
            "clientId": "7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOyH3",
            "authenticatingInstitutionId": "128807",
            "contextInstitutionId": "128807",
            "redirectUri": "http://localhost/auth/",
            "responseType": "code",
            "scope": ["WMS_CIRCULATION", "WMS_NCIP"]
        });


        const expectedLoginUrl = "https://authn.sd00.worldcat.org/oauth2/authorizeCode?client_id=7nRtI3ChLuduC7zDYTnQPGPMlKYfxe23wcz5JfkGuNO5U7ngxVsJaTpf5ViU42gKNHSpMawWucOBOyH3&authenticatingInstitutionId=128807&contextInstitutionId=128807&redirect_uri=http%3A%2F%2Flocalhost%2Fauth%2F&response_type=code&scope=WMS_CIRCULATION%20WMS_NCIP";

        expect(authCode.getLoginUrl()).toEqual(expectedLoginUrl);
    });
});