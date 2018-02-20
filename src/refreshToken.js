module.exports = class RefreshToken {

    constructor(options) {
        this.refreshToken = options.refreshToken;
        this.expiresIn = options.expiresIn;
        this.expiresAt = options.expiresAt;
    };

    isExpired() {
        return new Date(this.expiresAt) < new Date();
    }
};
