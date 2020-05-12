"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("@angular/common/http");
var RestCallHeaders = /** @class */ (function () {
    function RestCallHeaders(authService) {
        this.authService = authService;
    }
    RestCallHeaders.prototype.getRequestHeadersForLoggedInUserWithCustomHeaders = function (customHeaders) {
        if (this.authService !== null) {
            customHeaders['Authorization'] = "Bearer " + this.authService.getAuthenticationToken();
            return new http_1.HttpHeaders(customHeaders);
        }
        ;
        return new http_1.HttpHeaders(customHeaders);
    };
    RestCallHeaders.prototype.getRequestHeadersForLoggedInUser = function () {
        return this.getRequestHeadersForLoggedInUserWithCustomHeaders({ 'Content-Type': 'application/json' });
    };
    return RestCallHeaders;
}());
exports.RestCallHeaders = RestCallHeaders;
//# sourceMappingURL=restCallHeaders.class.js.map