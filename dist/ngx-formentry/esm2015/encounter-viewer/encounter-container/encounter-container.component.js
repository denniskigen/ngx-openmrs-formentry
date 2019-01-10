/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { EncounterAdapter } from '../../form-entry/value-adapters/encounter.adapter';
import { EncounterPdfViewerService } from '../encounter-pdf-viewer.service';
export class EncounterContainerComponent {
    /**
     * @param {?} encAdapter
     * @param {?} encounterPdfViewerService
     */
    constructor(encAdapter, encounterPdfViewerService) {
        this.encAdapter = encAdapter;
        this.encounterPdfViewerService = encounterPdfViewerService;
    }
    /**
     * @param {?} form
     * @return {?}
     */
    set form(form) {
        this.$form = form;
    }
    /**
     * @param {?} enc
     * @return {?}
     */
    set encounter(enc) {
        this.$enc = enc;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @return {?}
     */
    displayPdf() {
        this.encounterPdfViewerService.displayPdf(this.$form);
    }
}
EncounterContainerComponent.decorators = [
    { type: Component, args: [{
                selector: 'encounter-renderer',
                template: "<a type=\"button\" style=\"display: block; font-size: 28px; cursor: pointer\" class=\"text-right\" (click)=\"displayPdf()\">\n  <span class=\"glyphicon text-primary glyphicon-print\"></span>\n</a>\n<encounter-viewer class=\"card\" [form]=\"$form\" [encounter]=\"$enc\"></encounter-viewer>inline-block",
                styles: [".card{box-shadow:0 2px 5px 0 rgba(0,0,0,.16),0 2px 10px 0 rgba(0,0,0,.12)}"]
            }] }
];
/** @nocollapse */
EncounterContainerComponent.ctorParameters = () => [
    { type: EncounterAdapter },
    { type: EncounterPdfViewerService }
];
EncounterContainerComponent.propDecorators = {
    form: [{ type: Input }],
    encounter: [{ type: Input }]
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb3VudGVyLWNvbnRhaW5lci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtb3Blbm1ycy1mb3JtZW50cnkvIiwic291cmNlcyI6WyJlbmNvdW50ZXItdmlld2VyL2VuY291bnRlci1jb250YWluZXIvZW5jb3VudGVyLWNvbnRhaW5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR3pELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBRXJGLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBTzVFLE1BQU0sT0FBTywyQkFBMkI7Ozs7O0lBV3BDLFlBQ1ksVUFBNEIsRUFDNUIseUJBQW9EO1FBRHBELGVBQVUsR0FBVixVQUFVLENBQWtCO1FBQzVCLDhCQUF5QixHQUF6Qix5QkFBeUIsQ0FBMkI7SUFBSSxDQUFDOzs7OztJQVRyRSxJQUFvQixJQUFJLENBQUMsSUFBSTtRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUN0QixDQUFDOzs7OztJQUNELElBQW9CLFNBQVMsQ0FBQyxHQUFHO1FBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO0lBQ3BCLENBQUM7Ozs7SUFNRCxRQUFRO0lBQ1IsQ0FBQzs7OztJQUVELFVBQVU7UUFDTixJQUFJLENBQUMseUJBQXlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxRCxDQUFDOzs7WUF6QkosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLHdUQUFtRDs7YUFFdEQ7Ozs7WUFSUSxnQkFBZ0I7WUFFaEIseUJBQXlCOzs7bUJBVzdCLEtBQUs7d0JBR0wsS0FBSzs7OztJQU5OLDRDQUFtQjs7SUFDbkIsMkNBQWlCOzs7OztJQVViLGlEQUFvQzs7Ozs7SUFDcEMsZ0VBQTREIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtIH0gZnJvbSAnLi4vLi4vZm9ybS1lbnRyeS9mb3JtLWZhY3RvcnkvZm9ybSc7XG5pbXBvcnQgeyBOb2RlQmFzZSB9IGZyb20gJy4uLy4uL2Zvcm0tZW50cnkvZm9ybS1mYWN0b3J5L2Zvcm0tbm9kZSc7XG5pbXBvcnQgeyBFbmNvdW50ZXJBZGFwdGVyIH0gZnJvbSAnLi4vLi4vZm9ybS1lbnRyeS92YWx1ZS1hZGFwdGVycy9lbmNvdW50ZXIuYWRhcHRlcic7XG5cbmltcG9ydCB7IEVuY291bnRlclBkZlZpZXdlclNlcnZpY2UgfSBmcm9tICcuLi9lbmNvdW50ZXItcGRmLXZpZXdlci5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdlbmNvdW50ZXItcmVuZGVyZXInLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9lbmNvdW50ZXItY29udGFpbmVyLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9lbmNvdW50ZXItY29udGFpbmVyLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBFbmNvdW50ZXJDb250YWluZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIHB1YmxpYyAkZm9ybTogRm9ybTtcbiAgICBwdWJsaWMgJGVuYzogYW55O1xuXG4gICAgQElucHV0KCkgcHVibGljIHNldCBmb3JtKGZvcm0pIHtcbiAgICAgICAgdGhpcy4kZm9ybSA9IGZvcm07XG4gICAgfVxuICAgIEBJbnB1dCgpIHB1YmxpYyBzZXQgZW5jb3VudGVyKGVuYykge1xuICAgICAgICB0aGlzLiRlbmMgPSBlbmM7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgZW5jQWRhcHRlcjogRW5jb3VudGVyQWRhcHRlcixcbiAgICAgICAgcHJpdmF0ZSBlbmNvdW50ZXJQZGZWaWV3ZXJTZXJ2aWNlOiBFbmNvdW50ZXJQZGZWaWV3ZXJTZXJ2aWNlKSB7IH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgIH1cblxuICAgIGRpc3BsYXlQZGYoKSB7XG4gICAgICAgIHRoaXMuZW5jb3VudGVyUGRmVmlld2VyU2VydmljZS5kaXNwbGF5UGRmKHRoaXMuJGZvcm0pO1xuICAgIH1cbn1cbiJdfQ==