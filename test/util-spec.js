const Util = require("../src/util.js");

describe("Util methods", function () {

    it("Should normalize scopes", function () {
        expect(Util.normalizeScope()).toEqual("");
        expect(Util.normalizeScope([])).toEqual("");
        expect(Util.normalizeScope(["WMS_CIRCULATION"])).toEqual("WMS_CIRCULATION");
        expect(Util.normalizeScope(["WMS_CIRCULATION", "WMS_NCIP"])).toEqual("WMS_CIRCULATION WMS_NCIP");
    });
});