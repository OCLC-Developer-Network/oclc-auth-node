const RefreshToken = require("../src/refreshToken.js");

describe("Refresh Token methods", function () {

    const refreshTokenExpired = new RefreshToken({
        "refreshToken": "rt_123456",
        "expiresIn": "15000",
        "expiresAt": "2018-01-01 00:00:01Z"
    });

    const refreshTokenValid = new RefreshToken({
        "refreshToken": "rt_123456",
        "expiresIn": "15000",
        "expiresAt": "2030-01-01 00:00:01Z"
    });

    it("should calculate if the refresh token is expired", function () {
        expect(refreshTokenExpired.isExpired()).toEqual(true);
        expect(refreshTokenValid.isExpired()).toEqual(false);
    });
});