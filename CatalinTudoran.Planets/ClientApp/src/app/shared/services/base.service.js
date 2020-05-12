"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var restCallHeaders_class_1 = require("./restCallHeaders.class");
var BaseService = /** @class */ (function () {
    function BaseService(authService) {
        this.authService = authService;
        this.restCallHeaders = new restCallHeaders_class_1.RestCallHeaders(this.authService);
    }
    Object.defineProperty(BaseService.prototype, "headers", {
        get: function () {
            var headers = this.restCallHeaders.getRequestHeadersForLoggedInUser();
            return headers;
        },
        enumerable: true,
        configurable: true
    });
    BaseService.prototype.handleError = function (error) {
        var applicationError = error.headers.get('Application-Error');
        if (applicationError) {
            return rxjs_1.Observable.throw(applicationError);
        }
        var modelStateErrors = '';
        if (error.error) {
            for (var key in error.error) {
                if (error.error[key]) {
                    modelStateErrors += error.error[key] + '\n';
                    console.error(key + ' ' + error.error[key]);
                }
            }
        }
        else if (error.status === 401) {
            modelStateErrors = BaseService.UnauthErrorMessage;
        }
        modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;
        return rxjs_1.throwError(modelStateErrors || 'Error accessing server. Contact your system administrator.');
    };
    BaseService.UnauthErrorMessage = "Unauthorized access. The session may have expired. Please login again.";
    return BaseService;
}());
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map