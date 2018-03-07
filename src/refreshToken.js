module.exports = class RefreshToken {

    constructor(options) {
        this.refreshToken = options && options.refreshToken ? options.refreshToken : null;
        this.expiresIn = options && options.expiresIn ? options.expiresIn : null;
        this.expiresAt = options && options.expiresAt ? options.expiresAt : null;
    };

    isExpired() {
        return new Date(this.expiresAt) < new Date();
    }
};
