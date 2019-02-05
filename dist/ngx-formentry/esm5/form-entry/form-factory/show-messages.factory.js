/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { ExpressionRunner } from '../expression-runner/expression-runner';
import { JsExpressionHelper } from '../helpers/js-expression-helper';
var AlertsFactory = /** @class */ (function () {
    function AlertsFactory(expressionRunner, expressionHelper) {
        this.expressionRunner = expressionRunner;
        this.expressionHelper = expressionHelper;
    }
    /**
     * @param {?} question
     * @param {?} control
     * @param {?=} form
     * @return {?}
     */
    AlertsFactory.prototype.getJsExpressionshowAlert = /**
     * @param {?} question
     * @param {?} control
     * @param {?=} form
     * @return {?}
     */
    function (question, control, form) {
        /** @type {?} */
        var runnable = this.expressionRunner.getRunnable(question.alert.alertWhenExpression, control, this.expressionHelper.helperFunctions, {}, form);
        /** @type {?} */
        var showAlert = {
            shown: false,
            alertWhenExpression: question.alert.alertWhenExpression,
            alertMessage: question.alert.message,
            reEvaluateAlertExpression: (/**
             * @return {?}
             */
            function () {
                /** @type {?} */
                var result = runnable.run();
                showAlert.shown = result;
            })
        };
        return showAlert;
    };
    AlertsFactory.decorators = [
        { type: Injectable },
    ];
    AlertsFactory.ctorParameters = function () { return [
        { type: ExpressionRunner },
        { type: JsExpressionHelper }
    ]; };
    return AlertsFactory;
}());
export { AlertsFactory };
if (false) {
    /**
     * @type {?}
     * @private
     */
    AlertsFactory.prototype.expressionRunner;
    /**
     * @type {?}
     * @private
     */
    AlertsFactory.prototype.expressionHelper;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvdy1tZXNzYWdlcy5mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LW9wZW5tcnMtZm9ybWVudHJ5LyIsInNvdXJjZXMiOlsiZm9ybS1lbnRyeS9mb3JtLWZhY3Rvcnkvc2hvdy1tZXNzYWdlcy5mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSTNDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBWSxNQUFNLHdDQUF3QyxDQUFDO0FBR3BGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBR3JFO0lBRUksdUJBQW9CLGdCQUFrQyxFQUFVLGdCQUFvQztRQUFoRixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQVUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFvQjtJQUNwRyxDQUFDOzs7Ozs7O0lBQ0QsZ0RBQXdCOzs7Ozs7SUFBeEIsVUFBeUIsUUFBc0IsRUFBRSxPQUFxRCxFQUNsRyxJQUFXOztZQUNMLFFBQVEsR0FDVixJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxFQUN6RSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUM7O1lBQ2xELFNBQVMsR0FBVTtZQUNyQixLQUFLLEVBQUUsS0FBSztZQUNaLG1CQUFtQixFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsbUJBQW1CO1lBQ3ZELFlBQVksRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU87WUFDcEMseUJBQXlCOzs7WUFBRTs7b0JBQ2pCLE1BQU0sR0FBRyxRQUFRLENBQUMsR0FBRyxFQUFFO2dCQUM3QixTQUFTLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztZQUM3QixDQUFDLENBQUE7U0FDSjtRQUNELE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDckIsQ0FBQzs7Z0JBbkJKLFVBQVU7OztnQkFORixnQkFBZ0I7Z0JBR2hCLGtCQUFrQjs7SUF1QjNCLG9CQUFDO0NBQUEsQUFwQkQsSUFvQkM7U0FuQlksYUFBYTs7Ozs7O0lBQ1YseUNBQTBDOzs7OztJQUFFLHlDQUE0QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQWxlcnQgfSBmcm9tICcuLi9jb250cm9sLWFsZXJ0cy9jYW4tZ2VuZXJhdGUtYWxlcnQnO1xuXG5pbXBvcnQgeyBFeHByZXNzaW9uUnVubmVyLCBSdW5uYWJsZSB9IGZyb20gJy4uL2V4cHJlc3Npb24tcnVubmVyL2V4cHJlc3Npb24tcnVubmVyJztcbmltcG9ydCB7IEFmZUZvcm1Db250cm9sLCBBZmVGb3JtQXJyYXksIEFmZUZvcm1Hcm91cCB9IGZyb20gJy4uLy4uL2Fic3RyYWN0LWNvbnRyb2xzLWV4dGVuc2lvbic7XG5pbXBvcnQgeyBRdWVzdGlvbkJhc2UgfSBmcm9tICcuLi9xdWVzdGlvbi1tb2RlbHMvcXVlc3Rpb24tYmFzZSc7XG5pbXBvcnQgeyBKc0V4cHJlc3Npb25IZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL2pzLWV4cHJlc3Npb24taGVscGVyJztcbmltcG9ydCB7IEZvcm19IGZyb20gJy4vZm9ybSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBBbGVydHNGYWN0b3J5IHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGV4cHJlc3Npb25SdW5uZXI6IEV4cHJlc3Npb25SdW5uZXIsIHByaXZhdGUgZXhwcmVzc2lvbkhlbHBlcjogSnNFeHByZXNzaW9uSGVscGVyKSB7XG4gICAgfVxuICAgIGdldEpzRXhwcmVzc2lvbnNob3dBbGVydChxdWVzdGlvbjogUXVlc3Rpb25CYXNlLCBjb250cm9sOiBBZmVGb3JtQ29udHJvbCB8IEFmZUZvcm1BcnJheSB8IEFmZUZvcm1Hcm91cCxcbiAgICAgICAgZm9ybT86IEZvcm0pOiBBbGVydCB7XG4gICAgICAgIGNvbnN0IHJ1bm5hYmxlOiBSdW5uYWJsZSA9XG4gICAgICAgICAgICB0aGlzLmV4cHJlc3Npb25SdW5uZXIuZ2V0UnVubmFibGUocXVlc3Rpb24uYWxlcnQuYWxlcnRXaGVuRXhwcmVzc2lvbiwgY29udHJvbCxcbiAgICAgICAgICAgICAgICB0aGlzLmV4cHJlc3Npb25IZWxwZXIuaGVscGVyRnVuY3Rpb25zLCB7fSwgZm9ybSk7XG4gICAgICAgIGNvbnN0IHNob3dBbGVydDogQWxlcnQgPSB7XG4gICAgICAgICAgICBzaG93bjogZmFsc2UsXG4gICAgICAgICAgICBhbGVydFdoZW5FeHByZXNzaW9uOiBxdWVzdGlvbi5hbGVydC5hbGVydFdoZW5FeHByZXNzaW9uLFxuICAgICAgICAgICAgYWxlcnRNZXNzYWdlOiBxdWVzdGlvbi5hbGVydC5tZXNzYWdlLFxuICAgICAgICAgICAgcmVFdmFsdWF0ZUFsZXJ0RXhwcmVzc2lvbjogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHJ1bm5hYmxlLnJ1bigpO1xuICAgICAgICAgICAgICAgIHNob3dBbGVydC5zaG93biA9IHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHNob3dBbGVydDtcbiAgICB9XG59XG4iXX0=