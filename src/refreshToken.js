module.exports = class RefreshToken {

    constructor(options) {
        this.refreshToken = options && options.refreshToken ? options.refreshToken : null;
        this.expiresIn = options && options.expiresIn ? options.expiresIn : null;
        this.expiresAt = options && options.expiresAt ? options.expiresAt : null;
    };

    /**
     * Returns true if the refresh token is expired
     * @returns {boolean}
     */
    isExpired() {
        return new Date(this.expiresAt) < new Date();
    }

    getValue(){
        return this.refreshToken;
    }

    getExpiresAt() {
        return this.expiresAt;
    }

    setExpiresAt(expiresAt) {
        this.expiresAt = expiresAt;
    }

    getExpiresIn() {
        return this.expiresIn;
    }

    setExpiresIn(expiresIn) {
        this.expiresIn = expiresIn;
    }
};
