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

        expect(authCode.getLoginUrl()).toEqual({"url": expectedLoginUrl});
    });

    describe("Error check parameters for Authorization Code", function () {

        it("should return an error for a missing clientId", function () {
            const authCode = new AuthCode({});
            const expectedError = "Error: Missing clientId.";
            expect(authCode.getLoginUrl()).toEqual({"err": expectedError});
        });

        it("should return an error for a missing authenticatingInstitutionId", function () {
            const authCode = new AuthCode({
                "clientId": "aCcndeDMjFO9vszkDrB6WJg1UnyTnkn8lLupLKygr0U1KJZoeAittuVjGRywCDdrsxahv2bsjgKq6hLM"
            });
            const expectedError = "Error: Missing authenticatingInstitutionId.";
            expect(authCode.getLoginUrl()).toEqual({"err": expectedError});
        });

        it("should return an error for an empty authenticatingInstitutionId", function () {
            const authCode = new AuthCode({
                "clientId": "aCcndeDMjFO9vszkDrB6WJg1UnyTnkn8lLupLKygr0U1KJZoeAittuVjGRywCDdrsxahv2bsjgKq6hLM",
                "authenticatingInstitutionId": ""
            });
            const expectedError = "Error: Missing authenticatingInstitutionId.";
            expect(authCode.getLoginUrl()).toEqual({"err": expectedError});
        });

        it("should return an error for a missing contextInstitutionId", function () {
            const authCode = new AuthCode({
                "clientId": "aCcndeDMjFO9vszkDrB6WJg1UnyTnkn8lLupLKygr0U1KJZoeAittuVjGRywCDdrsxahv2bsjgKq6hLM",
                "authenticatingInstitutionId": "128807"
            });
            const expectedError = "Error: Missing contextInstitutionId.";
            expect(authCode.getLoginUrl()).toEqual({"err": expectedError});
        });

        it("should return an error for a missing redirectUri", function () {
            const authCode = new AuthCode({
                "clientId": "aCcndeDMjFO9vszkDrB6WJg1UnyTnkn8lLupLKygr0U1KJZoeAittuVjGRywCDdrsxahv2bsjgKq6hLM",
                "authenticatingInstitutionId": "128807",
                "contextInstitutionId": "128807"
            });
            const expectedError = "Error: Missing redirectUri.";
            expect(authCode.getLoginUrl()).toEqual({"err": expectedError});
        });

        it("should return an error for a missing scope", function () {
            const authCode = new AuthCode({
                "clientId": "aCcndeDMjFO9vszkDrB6WJg1UnyTnkn8lLupLKygr0U1KJZoeAittuVjGRywCDdrsxahv2bsjgKq6hLM",
                "authenticatingInstitutionId": "128807",
                "contextInstitutionId": "128807",
                "redirectUri": "http://localhost/auth/"
            });
            const expectedError = "Error: Missing scope.";
            expect(authCode.getLoginUrl()).toEqual({"err": expectedError});
        });

        it("should return an error for a scope passed as a string instead of an array", function () {
            const authCode = new AuthCode({
                "clientId": "aCcndeDMjFO9vszkDrB6WJg1UnyTnkn8lLupLKygr0U1KJZoeAittuVjGRywCDdrsxahv2bsjgKq6hLM",
                "authenticatingInstitutionId": "128807",
                "contextInstitutionId": "128807",
                "redirectUri": "http://localhost/auth/",
                "scope": "WMS_CIRCULATION"
            });
            const expectedError = "Error: Scope must be passed as an array of one or more strings.";
            expect(authCode.getLoginUrl()).toEqual({"err": expectedError});
        });

    })


});