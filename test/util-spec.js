const Util = require("../src/util.js");
const util = new Util();

describe("Util methods", function () {

    it("Should normalize scopes", function () {
        expect(util.normalizeScope()).toEqual("");
        expect(util.normalizeScope([])).toEqual("");
        expect(util.normalizeScope(["WMS_CIRCULATION"])).toEqual("WMS_CIRCULATION");
        expect(util.normalizeScope(["WMS_CIRCULATION", "WMS_NCIP"])).toEqual("WMS_CIRCULATION WMS_NCIP");
    });
});