/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HistoricalEncounterDataService } from '../services/historical-encounter-data.service';
import { JsExpressionHelper } from './js-expression-helper';
import { ExpressionRunner } from '../expression-runner/expression-runner';
import { AfeFormControl } from '../../abstract-controls-extension/afe-form-control';
var HistoricalHelperService = /** @class */ (function () {
    function HistoricalHelperService() {
    }
    /**
     * @param {?} expr
     * @param {?} dataSources
     * @return {?}
     */
    HistoricalHelperService.prototype.evaluate = /**
     * @param {?} expr
     * @param {?} dataSources
     * @return {?}
     */
    function (expr, dataSources) {
        /** @type {?} */
        var HD = new HistoricalEncounterDataService();
        HD.registerEncounters('prevEnc', dataSources['rawPrevEnc']);
        /** @type {?} */
        var deps = {
            HD: HD
        };
        /** @type {?} */
        var helper = new JsExpressionHelper();
        /** @type {?} */
        var control = new AfeFormControl();
        /** @type {?} */
        var runner = new ExpressionRunner();
        /** @type {?} */
        var runnable = runner.getRunnable(expr, control, helper.helperFunctions, deps);
        return runnable.run();
    };
    HistoricalHelperService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    HistoricalHelperService.ctorParameters = function () { return []; };
    return HistoricalHelperService;
}());
export { HistoricalHelperService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlzdG9yaWNhbC1leHByZXNzaW9uLWhlbHBlci1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LW9wZW5tcnMtZm9ybWVudHJ5LyIsInNvdXJjZXMiOlsiZm9ybS1lbnRyeS9oZWxwZXJzL2hpc3RvcmljYWwtZXhwcmVzc2lvbi1oZWxwZXItc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUMvRixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM1RCxPQUFPLEVBQVksZ0JBQWdCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUNwRixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFFcEY7SUFHRTtJQUNBLENBQUM7Ozs7OztJQUVNLDBDQUFROzs7OztJQUFmLFVBQWdCLElBQVksRUFBRSxXQUFnQjs7WUFDdEMsRUFBRSxHQUFHLElBQUksOEJBQThCLEVBQUU7UUFDL0MsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzs7WUFDdEQsSUFBSSxHQUFRO1lBQ2hCLEVBQUUsRUFBRSxFQUFFO1NBQ1A7O1lBRUssTUFBTSxHQUFHLElBQUksa0JBQWtCLEVBQUU7O1lBQ2pDLE9BQU8sR0FBbUIsSUFBSSxjQUFjLEVBQUU7O1lBQzlDLE1BQU0sR0FBcUIsSUFBSSxnQkFBZ0IsRUFBRTs7WUFDakQsUUFBUSxHQUFhLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQztRQUUxRixPQUFPLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUN4QixDQUFDOztnQkFuQkYsVUFBVTs7OztJQXFCWCw4QkFBQztDQUFBLEFBckJELElBcUJDO1NBcEJZLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSGlzdG9yaWNhbEVuY291bnRlckRhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvaGlzdG9yaWNhbC1lbmNvdW50ZXItZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IEpzRXhwcmVzc2lvbkhlbHBlciB9IGZyb20gJy4vanMtZXhwcmVzc2lvbi1oZWxwZXInO1xuaW1wb3J0IHsgUnVubmFibGUsIEV4cHJlc3Npb25SdW5uZXIgfSBmcm9tICcuLi9leHByZXNzaW9uLXJ1bm5lci9leHByZXNzaW9uLXJ1bm5lcic7XG5pbXBvcnQgeyBBZmVGb3JtQ29udHJvbCB9IGZyb20gJy4uLy4uL2Fic3RyYWN0LWNvbnRyb2xzLWV4dGVuc2lvbi9hZmUtZm9ybS1jb250cm9sJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEhpc3RvcmljYWxIZWxwZXJTZXJ2aWNlIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG4gIHB1YmxpYyBldmFsdWF0ZShleHByOiBzdHJpbmcsIGRhdGFTb3VyY2VzOiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IEhEID0gbmV3IEhpc3RvcmljYWxFbmNvdW50ZXJEYXRhU2VydmljZSgpO1xuICAgIEhELnJlZ2lzdGVyRW5jb3VudGVycygncHJldkVuYycsIGRhdGFTb3VyY2VzWydyYXdQcmV2RW5jJ10pO1xuICAgIGNvbnN0IGRlcHM6IGFueSA9IHtcbiAgICAgIEhEOiBIRFxuICAgIH07XG5cbiAgICBjb25zdCBoZWxwZXIgPSBuZXcgSnNFeHByZXNzaW9uSGVscGVyKCk7XG4gICAgY29uc3QgY29udHJvbDogQWZlRm9ybUNvbnRyb2wgPSBuZXcgQWZlRm9ybUNvbnRyb2woKTtcbiAgICBjb25zdCBydW5uZXI6IEV4cHJlc3Npb25SdW5uZXIgPSBuZXcgRXhwcmVzc2lvblJ1bm5lcigpO1xuICAgIGNvbnN0IHJ1bm5hYmxlOiBSdW5uYWJsZSA9IHJ1bm5lci5nZXRSdW5uYWJsZShleHByLCBjb250cm9sLCBoZWxwZXIuaGVscGVyRnVuY3Rpb25zLCBkZXBzKTtcblxuICAgIHJldHVybiBydW5uYWJsZS5ydW4oKTtcbiAgfVxuXG59XG4iXX0=