/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HistoricalEncounterDataService } from '../services/historical-encounter-data.service';
import { JsExpressionHelper } from './js-expression-helper';
import { ExpressionRunner } from '../expression-runner/expression-runner';
import { AfeFormControl } from '../../abstract-controls-extension/afe-form-control';
export class HistoricalHelperService {
    constructor() {
    }
    /**
     * @param {?} expr
     * @param {?} dataSources
     * @return {?}
     */
    evaluate(expr, dataSources) {
        /** @type {?} */
        const HD = new HistoricalEncounterDataService();
        HD.registerEncounters('prevEnc', dataSources['rawPrevEnc']);
        /** @type {?} */
        const deps = {
            HD: HD
        };
        /** @type {?} */
        const helper = new JsExpressionHelper();
        /** @type {?} */
        const control = new AfeFormControl();
        /** @type {?} */
        const runner = new ExpressionRunner();
        /** @type {?} */
        const runnable = runner.getRunnable(expr, control, helper.helperFunctions, deps);
        return runnable.run();
    }
}
HistoricalHelperService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
HistoricalHelperService.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlzdG9yaWNhbC1leHByZXNzaW9uLWhlbHBlci1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LW9wZW5tcnMtZm9ybWVudHJ5LyIsInNvdXJjZXMiOlsiZm9ybS1lbnRyeS9oZWxwZXJzL2hpc3RvcmljYWwtZXhwcmVzc2lvbi1oZWxwZXItc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUMvRixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM1RCxPQUFPLEVBQVksZ0JBQWdCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUNwRixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFHcEYsTUFBTSxPQUFPLHVCQUF1QjtJQUVsQztJQUNBLENBQUM7Ozs7OztJQUVNLFFBQVEsQ0FBQyxJQUFZLEVBQUUsV0FBZ0I7O2NBQ3RDLEVBQUUsR0FBRyxJQUFJLDhCQUE4QixFQUFFO1FBQy9DLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7O2NBQ3RELElBQUksR0FBUTtZQUNoQixFQUFFLEVBQUUsRUFBRTtTQUNQOztjQUVLLE1BQU0sR0FBRyxJQUFJLGtCQUFrQixFQUFFOztjQUNqQyxPQUFPLEdBQW1CLElBQUksY0FBYyxFQUFFOztjQUM5QyxNQUFNLEdBQXFCLElBQUksZ0JBQWdCLEVBQUU7O2NBQ2pELFFBQVEsR0FBYSxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUM7UUFFMUYsT0FBTyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDeEIsQ0FBQzs7O1lBbkJGLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEhpc3RvcmljYWxFbmNvdW50ZXJEYXRhU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2hpc3RvcmljYWwtZW5jb3VudGVyLWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBKc0V4cHJlc3Npb25IZWxwZXIgfSBmcm9tICcuL2pzLWV4cHJlc3Npb24taGVscGVyJztcbmltcG9ydCB7IFJ1bm5hYmxlLCBFeHByZXNzaW9uUnVubmVyIH0gZnJvbSAnLi4vZXhwcmVzc2lvbi1ydW5uZXIvZXhwcmVzc2lvbi1ydW5uZXInO1xuaW1wb3J0IHsgQWZlRm9ybUNvbnRyb2wgfSBmcm9tICcuLi8uLi9hYnN0cmFjdC1jb250cm9scy1leHRlbnNpb24vYWZlLWZvcm0tY29udHJvbCc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBIaXN0b3JpY2FsSGVscGVyU2VydmljZSB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICBwdWJsaWMgZXZhbHVhdGUoZXhwcjogc3RyaW5nLCBkYXRhU291cmNlczogYW55KTogYW55IHtcbiAgICBjb25zdCBIRCA9IG5ldyBIaXN0b3JpY2FsRW5jb3VudGVyRGF0YVNlcnZpY2UoKTtcbiAgICBIRC5yZWdpc3RlckVuY291bnRlcnMoJ3ByZXZFbmMnLCBkYXRhU291cmNlc1sncmF3UHJldkVuYyddKTtcbiAgICBjb25zdCBkZXBzOiBhbnkgPSB7XG4gICAgICBIRDogSERcbiAgICB9O1xuXG4gICAgY29uc3QgaGVscGVyID0gbmV3IEpzRXhwcmVzc2lvbkhlbHBlcigpO1xuICAgIGNvbnN0IGNvbnRyb2w6IEFmZUZvcm1Db250cm9sID0gbmV3IEFmZUZvcm1Db250cm9sKCk7XG4gICAgY29uc3QgcnVubmVyOiBFeHByZXNzaW9uUnVubmVyID0gbmV3IEV4cHJlc3Npb25SdW5uZXIoKTtcbiAgICBjb25zdCBydW5uYWJsZTogUnVubmFibGUgPSBydW5uZXIuZ2V0UnVubmFibGUoZXhwciwgY29udHJvbCwgaGVscGVyLmhlbHBlckZ1bmN0aW9ucywgZGVwcyk7XG5cbiAgICByZXR1cm4gcnVubmFibGUucnVuKCk7XG4gIH1cblxufVxuIl19