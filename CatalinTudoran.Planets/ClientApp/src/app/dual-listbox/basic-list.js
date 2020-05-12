"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasicList = /** @class */ (function () {
    function BasicList(name) {
        this._name = name;
        this.last = null;
        this.picker = '';
        this.dragStart = false;
        this.dragOver = false;
        // Arrays will contain objects of { _id, _name }.
        this.pick = [];
        this.list = [];
        this.sift = [];
    }
    Object.defineProperty(BasicList.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    return BasicList;
}());
exports.BasicList = BasicList;
//# sourceMappingURL=basic-list.js.map