let Utility = require("../src/utility.js");

describe("Utility functions", function () {

    let utility = new Utility();

    it("Should split a url", function () {
        const URLhash = "#access_token=tk_K5DqcydfIPeYVMbZJIHBvxTB5ZpXoTHXpMOm&state=undefined" +
            "&principalID=9073b132-7ac3-40d8-a167-fcd67df7a088&principalIDNS=urn:oclc:platform:128807" +
            "&context_institution_id=128807&authenticating_institution_id=128807&token_type=bearer" +
            "&expires_in=1199&expires_at=2017-12-06 20:36:51Z",

            expected = {
                access_token: 'tk_K5DqcydfIPeYVMbZJIHBvxTB5ZpXoTHXpMOm',
                state: 'undefined',
                principalID: '9073b132-7ac3-40d8-a167-fcd67df7a088',
                principalIDNS: 'urn:oclc:platform:128807',
                context_institution_id: '128807',
                authenticating_institution_id: '128807',
                token_type: 'bearer',
                expires_in: '1199',
                expires_at: '2017-12-06 20:36:51Z'
            };

        expect(utility.parseTokenResponse(URLhash)).toEqual(expected);
    });
});