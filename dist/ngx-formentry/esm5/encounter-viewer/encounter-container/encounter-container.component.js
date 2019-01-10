/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { EncounterAdapter } from '../../form-entry/value-adapters/encounter.adapter';
import { EncounterPdfViewerService } from '../encounter-pdf-viewer.service';
var EncounterContainerComponent = /** @class */ (function () {
    function EncounterContainerComponent(encAdapter, encounterPdfViewerService) {
        this.encAdapter = encAdapter;
        this.encounterPdfViewerService = encounterPdfViewerService;
    }
    Object.defineProperty(EncounterContainerComponent.prototype, "form", {
        set: /**
         * @param {?} form
         * @return {?}
         */
        function (form) {
            this.$form = form;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EncounterContainerComponent.prototype, "encounter", {
        set: /**
         * @param {?} enc
         * @return {?}
         */
        function (enc) {
            this.$enc = enc;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    EncounterContainerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @return {?}
     */
    EncounterContainerComponent.prototype.displayPdf = /**
     * @return {?}
     */
    function () {
        this.encounterPdfViewerService.displayPdf(this.$form);
    };
    EncounterContainerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'encounter-renderer',
                    template: "<a type=\"button\" style=\"display: block; font-size: 28px; cursor: pointer\" class=\"text-right\" (click)=\"displayPdf()\">\n  <span class=\"glyphicon text-primary glyphicon-print\"></span>\n</a>\n<encounter-viewer class=\"card\" [form]=\"$form\" [encounter]=\"$enc\"></encounter-viewer>inline-block",
                    styles: [".card{box-shadow:0 2px 5px 0 rgba(0,0,0,.16),0 2px 10px 0 rgba(0,0,0,.12)}"]
                }] }
    ];
    /** @nocollapse */
    EncounterContainerComponent.ctorParameters = function () { return [
        { type: EncounterAdapter },
        { type: EncounterPdfViewerService }
    ]; };
    EncounterContainerComponent.propDecorators = {
        form: [{ type: Input }],
        encounter: [{ type: Input }]
    };
    return EncounterContainerComponent;
}());
export { EncounterContainerComponent };
if (false) {
    /** @type {?} */
    EncounterContainerComponent.prototype.$form;
    /** @type {?} */
    EncounterContainerComponent.prototype.$enc;
    /**
     * @type {?}
     * @private
     */
    EncounterContainerComponent.prototype.encAdapter;
    /**
     * @type {?}
     * @private
     */
    EncounterContainerComponent.prototype.encounterPdfViewerService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb3VudGVyLWNvbnRhaW5lci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtb3Blbm1ycy1mb3JtZW50cnkvIiwic291cmNlcyI6WyJlbmNvdW50ZXItdmlld2VyL2VuY291bnRlci1jb250YWluZXIvZW5jb3VudGVyLWNvbnRhaW5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR3pELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBRXJGLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBRTVFO0lBZ0JJLHFDQUNZLFVBQTRCLEVBQzVCLHlCQUFvRDtRQURwRCxlQUFVLEdBQVYsVUFBVSxDQUFrQjtRQUM1Qiw4QkFBeUIsR0FBekIseUJBQXlCLENBQTJCO0lBQUksQ0FBQztJQVRyRSxzQkFBb0IsNkNBQUk7Ozs7O1FBQXhCLFVBQXlCLElBQUk7WUFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDdEIsQ0FBQzs7O09BQUE7SUFDRCxzQkFBb0Isa0RBQVM7Ozs7O1FBQTdCLFVBQThCLEdBQUc7WUFDN0IsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFDcEIsQ0FBQzs7O09BQUE7Ozs7SUFNRCw4Q0FBUTs7O0lBQVI7SUFDQSxDQUFDOzs7O0lBRUQsZ0RBQVU7OztJQUFWO1FBQ0ksSUFBSSxDQUFDLHlCQUF5QixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUQsQ0FBQzs7Z0JBekJKLFNBQVMsU0FBQztvQkFDUCxRQUFRLEVBQUUsb0JBQW9CO29CQUM5Qix3VEFBbUQ7O2lCQUV0RDs7OztnQkFSUSxnQkFBZ0I7Z0JBRWhCLHlCQUF5Qjs7O3VCQVc3QixLQUFLOzRCQUdMLEtBQUs7O0lBY1Ysa0NBQUM7Q0FBQSxBQTFCRCxJQTBCQztTQXJCWSwyQkFBMkI7OztJQUNwQyw0Q0FBbUI7O0lBQ25CLDJDQUFpQjs7Ozs7SUFVYixpREFBb0M7Ozs7O0lBQ3BDLGdFQUE0RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybSB9IGZyb20gJy4uLy4uL2Zvcm0tZW50cnkvZm9ybS1mYWN0b3J5L2Zvcm0nO1xuaW1wb3J0IHsgTm9kZUJhc2UgfSBmcm9tICcuLi8uLi9mb3JtLWVudHJ5L2Zvcm0tZmFjdG9yeS9mb3JtLW5vZGUnO1xuaW1wb3J0IHsgRW5jb3VudGVyQWRhcHRlciB9IGZyb20gJy4uLy4uL2Zvcm0tZW50cnkvdmFsdWUtYWRhcHRlcnMvZW5jb3VudGVyLmFkYXB0ZXInO1xuXG5pbXBvcnQgeyBFbmNvdW50ZXJQZGZWaWV3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZW5jb3VudGVyLXBkZi12aWV3ZXIuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnZW5jb3VudGVyLXJlbmRlcmVyJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vZW5jb3VudGVyLWNvbnRhaW5lci5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vZW5jb3VudGVyLWNvbnRhaW5lci5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgRW5jb3VudGVyQ29udGFpbmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBwdWJsaWMgJGZvcm06IEZvcm07XG4gICAgcHVibGljICRlbmM6IGFueTtcblxuICAgIEBJbnB1dCgpIHB1YmxpYyBzZXQgZm9ybShmb3JtKSB7XG4gICAgICAgIHRoaXMuJGZvcm0gPSBmb3JtO1xuICAgIH1cbiAgICBASW5wdXQoKSBwdWJsaWMgc2V0IGVuY291bnRlcihlbmMpIHtcbiAgICAgICAgdGhpcy4kZW5jID0gZW5jO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIGVuY0FkYXB0ZXI6IEVuY291bnRlckFkYXB0ZXIsXG4gICAgICAgIHByaXZhdGUgZW5jb3VudGVyUGRmVmlld2VyU2VydmljZTogRW5jb3VudGVyUGRmVmlld2VyU2VydmljZSkgeyB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICB9XG5cbiAgICBkaXNwbGF5UGRmKCkge1xuICAgICAgICB0aGlzLmVuY291bnRlclBkZlZpZXdlclNlcnZpY2UuZGlzcGxheVBkZih0aGlzLiRmb3JtKTtcbiAgICB9XG59XG4iXX0=