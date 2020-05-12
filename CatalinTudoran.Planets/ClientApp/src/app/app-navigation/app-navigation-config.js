"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppNavigationConfig = /** @class */ (function () {
    function AppNavigationConfig(_topBarLinks, _sideBarLinks) {
        this._topBarLinks = _topBarLinks;
        this._sideBarLinks = _sideBarLinks;
    }
    Object.defineProperty(AppNavigationConfig.prototype, "topBarLinks", {
        get: function () {
            return this._topBarLinks;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppNavigationConfig.prototype, "sideBarLinks", {
        get: function () {
            return this._sideBarLinks;
        },
        enumerable: true,
        configurable: true
    });
    return AppNavigationConfig;
}());
exports.AppNavigationConfig = AppNavigationConfig;
//# sourceMappingURL=app-navigation-config.js.map