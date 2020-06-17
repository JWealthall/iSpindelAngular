"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var environment_1 = require("../../environments/environment");
var SummaryService = /** @class */ (function () {
    function SummaryService(http) {
        this.http = http;
        this.httpOptions = {
            headers: new http_1.HttpHeaders({
                'Content-Type': 'application/json; charset=utf-8'
            })
        };
        this.myAppUrl = environment_1.environment.appUrl;
        this.myApiUrl = 'data/';
    }
    SummaryService.prototype.getBatchSummary = function (batchId) {
        return this.http.get(this.myAppUrl + this.myApiUrl + 'batchSummary/' + batchId)
            .pipe(operators_1.retry(1), operators_1.catchError(this.errorHandler));
    };
    SummaryService.prototype.getBatchesSummary = function () {
        return this.http.get(this.myAppUrl + this.myApiUrl + 'batchesSummary')
            .pipe(operators_1.retry(1), operators_1.catchError(this.errorHandler));
    };
    SummaryService.prototype.getDeviceSummary = function (deviceId) {
        return this.http.get(this.myAppUrl + this.myApiUrl + 'deviceSummary/' + deviceId)
            .pipe(operators_1.retry(1), operators_1.catchError(this.errorHandler));
    };
    SummaryService.prototype.getDevicesSummary = function () {
        return this.http.get(this.myAppUrl + this.myApiUrl + 'devicesSummary')
            .pipe(operators_1.retry(1), operators_1.catchError(this.errorHandler));
    };
    SummaryService.prototype.getSummary = function () {
        return this.http.get(this.myAppUrl + this.myApiUrl + 'summary')
            .pipe(operators_1.retry(1), operators_1.catchError(this.errorHandler));
    };
    SummaryService.prototype.errorHandler = function (error) {
        var errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        }
        else {
            // Get server-side error
            errorMessage = "Error Code: " + error.status + "\nMessage: " + error.message;
        }
        console.log(errorMessage);
        return rxjs_1.throwError(errorMessage);
    };
    SummaryService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], SummaryService);
    return SummaryService;
}());
exports.SummaryService = SummaryService;
//# sourceMappingURL=summary.service.js.map