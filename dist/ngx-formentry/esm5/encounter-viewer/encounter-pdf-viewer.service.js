/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { ObsValueAdapter } from '../form-entry/value-adapters/obs.adapter';
import { EncounterViewerService } from './encounter-viewer.service';
import * as moment_ from 'moment';
import * as _ from 'lodash';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import 'pdfmake/build/vfs_fonts.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as i0 from "@angular/core";
import * as i1 from "./encounter-viewer.service";
import * as i2 from "../form-entry/value-adapters/obs.adapter";
/** @type {?} */
var moment = moment_;
var EncounterPdfViewerService = /** @class */ (function () {
    function EncounterPdfViewerService(encounterViewerService, obsValueAdapter) {
        this.encounterViewerService = encounterViewerService;
        this.obsValueAdapter = obsValueAdapter;
        this.innerValue = '';
    }
    /**
     * @param {?} pages
     * @param {?} form
     * @return {?}
     */
    EncounterPdfViewerService.prototype.getPages = /**
     * @param {?} pages
     * @param {?} form
     * @return {?}
     */
    function (pages, form) {
        var e_1, _a, e_2, _b;
        /** @type {?} */
        var content = [];
        try {
            for (var pages_1 = tslib_1.__values(pages), pages_1_1 = pages_1.next(); !pages_1_1.done; pages_1_1 = pages_1.next()) {
                var page = pages_1_1.value;
                try {
                    for (var _c = tslib_1.__values(form.rootNode.question.questions), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var question = _d.value;
                        if (page.label === form.rootNode.children[question.key].question.label &&
                            this.encounterViewerService.questionsAnswered(form.rootNode.children[question.key])) {
                            content.push({
                                style: 'tableExample',
                                table: {
                                    widths: ['*'],
                                    headerRows: 1,
                                    keepWithHeaderRows: 1,
                                    body: [
                                        [{ text: page.label, style: 'tableHeader' }],
                                        [
                                            {
                                                style: 'tableExample',
                                                table: {
                                                    widths: ['*'],
                                                    body: this.getSections(page.page, form)
                                                },
                                                layout: 'noBorders',
                                                margin: [10, 10, 10, 10]
                                            }
                                        ]
                                    ]
                                },
                                layout: 'noBorders'
                            });
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (pages_1_1 && !pages_1_1.done && (_a = pages_1.return)) _a.call(pages_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return content;
    };
    /**
     * @param {?} sections
     * @param {?} form
     * @return {?}
     */
    EncounterPdfViewerService.prototype.getSections = /**
     * @param {?} sections
     * @param {?} form
     * @return {?}
     */
    function (sections, form) {
        var e_3, _a;
        /** @type {?} */
        var content = [];
        try {
            for (var sections_1 = tslib_1.__values(sections), sections_1_1 = sections_1.next(); !sections_1_1.done; sections_1_1 = sections_1.next()) {
                var section = sections_1_1.value;
                if (this.encounterViewerService.questionsAnswered(section.node)) {
                    content.push([
                        {
                            table: {
                                widths: ['*'],
                                body: [
                                    [{ text: section.label, style: 'tableSubheader', margin: [5, 5] }],
                                    [this.getSectionData(section.section, form)]
                                ]
                            },
                            layout: 'noBorders'
                        }
                    ]);
                }
                else {
                    content.push([{ text: '' }]);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (sections_1_1 && !sections_1_1.done && (_a = sections_1.return)) _a.call(sections_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return content;
    };
    /**
     * @param {?} nodes
     * @param {?} form
     * @return {?}
     */
    EncounterPdfViewerService.prototype.getSectionData = /**
     * @param {?} nodes
     * @param {?} form
     * @return {?}
     */
    function (nodes, form) {
        var e_4, _a;
        /** @type {?} */
        var questions = {
            stack: []
        };
        var _loop_1 = function (node) {
            switch (node.question.renderingType) {
                case 'group':
                    if (node.groupMembers) {
                        questions.stack.push(this_1.getSectionData(node.groupMembers, form));
                        break;
                    }
                case 'field-set':
                    if (node.children) {
                        /** @type {?} */
                        var groupMembers = [];
                        result = Object.keys(node.children).map(function (key) { return node.children[key]; });
                        if (result) {
                            groupMembers.push(result);
                            questions.stack.push(this_1.getSectionData(groupMembers[0], form));
                        }
                        break;
                    }
                case 'repeating':
                    if (node.groupMembers) {
                        questions.stack.push(this_1.getSectionData(node.groupMembers, form));
                        break;
                    }
                default:
                    /** @type {?} */
                    var answer = node.control.value;
                    this_1.resolveValue(answer, form);
                    if (this_1.innerValue) {
                        questions.stack.push({
                            text: [
                                "" + node.question.label + (node.question.label.indexOf(':') > 1 ? '' : ':') + " ",
                                { text: "" + this_1.innerValue, bold: true }
                            ], margin: [5, 2]
                        });
                    }
            }
        };
        var this_1 = this, result;
        try {
            for (var nodes_1 = tslib_1.__values(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
                var node = nodes_1_1.value;
                _loop_1(node);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return questions;
    };
    /**
     * @param {?} value
     * @param {?} form
     * @param {?=} arrayElement
     * @return {?}
     */
    EncounterPdfViewerService.prototype.resolveValue = /**
     * @param {?} value
     * @param {?} form
     * @param {?=} arrayElement
     * @return {?}
     */
    function (value, form, arrayElement) {
        var _this = this;
        if (value !== this.innerValue) {
            if (this.isUuid(value)) {
                /** @type {?} */
                var val = this.encounterViewerService.resolveSelectedValueFromSchema(value, form.schema);
                if (!arrayElement) {
                    if (val) {
                        this.innerValue = val.toUpperCase();
                    }
                    else {
                        this.innerValue = value;
                    }
                }
                else {
                    return val;
                }
            }
            else if (_.isArray(value)) {
                /** @type {?} */
                var arr_1 = [];
                _.forEach(value, function (elem) {
                    arr_1.push(_this.resolveValue(elem, form, true));
                });
                this.innerValue = arr_1;
            }
            else if (this.isDate(value)) {
                if (!arrayElement) {
                    this.innerValue = this.encounterViewerService.convertTime(value);
                }
                else {
                    return this.encounterViewerService.convertTime(value);
                }
            }
            else if (typeof value === 'object') {
                /** @type {?} */
                var values = [];
                /** @type {?} */
                var result = Object.keys(value).map(function (key) { return [key, value[key]]; });
                values.push(result);
                this.innerValue = values;
            }
            else {
                if (!arrayElement) {
                    this.innerValue = value;
                }
                else {
                    return value;
                }
            }
        }
    };
    /**
     * @param {?} form
     * @return {?}
     */
    EncounterPdfViewerService.prototype.generatePdfDefinition = /**
     * @param {?} form
     * @return {?}
     */
    function (form) {
        /** @type {?} */
        var docDefinition = {
            content: this.getPages(this.obsValueAdapter.traverse(form.rootNode), form),
            styles: {
                confidential: {
                    color: 'red',
                    bold: true,
                    alignment: 'center'
                },
                header: {
                    fontSize: 14,
                    bold: true,
                    margin: [5, 5, 5, 5]
                },
                tableExample: {
                    fontSize: 12,
                    margin: [5, 0, 0, 5]
                },
                tableHeader: {
                    fillColor: '#f5f5f5',
                    width: ['100%'],
                    borderColor: '#333',
                    fontSize: 14,
                    bold: true,
                    margin: [5, 5, 5, 5]
                },
                tableSubheader: {
                    fillColor: '#337ab7',
                    fontSize: 14,
                    color: 'white',
                    margin: [5, 0, 5, 0]
                }
            },
            defaultStyle: {
                fontSize: 12
            }
        };
        return docDefinition;
    };
    /**
     * @param {?} form
     * @return {?}
     */
    EncounterPdfViewerService.prototype.displayPdf = /**
     * @param {?} form
     * @return {?}
     */
    function (form) {
        /** @type {?} */
        var pdf = pdfMake;
        pdf.vfs = pdfFonts.pdfMake.vfs;
        /** @type {?} */
        var docDefinition = this.generatePdfDefinition(form);
        docDefinition.footer = {
            columns: [
                {
                    stack: [
                        {
                            text: 'Note: Confidentiality is one of the core duties of all medical practitioners.',
                            style: 'confidential'
                        },
                        {
                            text: " Patients' personal health information should be kept private.",
                            style: 'confidential'
                        }
                    ]
                }
            ]
        };
        /** @type {?} */
        var win = window.open('', '_blank');
        pdf.createPdf(docDefinition).open({}, win);
    };
    /**
     * @param {?} val
     * @return {?}
     */
    EncounterPdfViewerService.prototype.isDate = /**
     * @param {?} val
     * @return {?}
     */
    function (val) {
        return moment(val, moment.ISO_8601, true).isValid();
    };
    /**
     * @param {?} value
     * @return {?}
     */
    EncounterPdfViewerService.prototype.isUuid = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        // Consider matching against a uuid regexp
        return (value.length === 36 && value.indexOf(' ') === -1 && value.indexOf('.') === -1);
    };
    EncounterPdfViewerService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    EncounterPdfViewerService.ctorParameters = function () { return [
        { type: EncounterViewerService },
        { type: ObsValueAdapter }
    ]; };
    /** @nocollapse */ EncounterPdfViewerService.ngInjectableDef = i0.defineInjectable({ factory: function EncounterPdfViewerService_Factory() { return new EncounterPdfViewerService(i0.inject(i1.EncounterViewerService), i0.inject(i2.ObsValueAdapter)); }, token: EncounterPdfViewerService, providedIn: "root" });
    return EncounterPdfViewerService;
}());
export { EncounterPdfViewerService };
if (false) {
    /** @type {?} */
    EncounterPdfViewerService.prototype.innerValue;
    /**
     * @type {?}
     * @private
     */
    EncounterPdfViewerService.prototype.encounterViewerService;
    /**
     * @type {?}
     * @private
     */
    EncounterPdfViewerService.prototype.obsValueAdapter;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb3VudGVyLXBkZi12aWV3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1vcGVubXJzLWZvcm1lbnRyeS8iLCJzb3VyY2VzIjpbImVuY291bnRlci12aWV3ZXIvZW5jb3VudGVyLXBkZi12aWV3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRXBFLE9BQU8sS0FBSyxPQUFPLE1BQU0sUUFBUSxDQUFDO0FBQ2xDLE9BQU8sS0FBSyxDQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sS0FBSyxPQUFPLE1BQU0sMEJBQTBCLENBQUM7QUFDcEQsT0FBTyw0QkFBNEIsQ0FBQztBQUNwQyxPQUFPLEtBQUssUUFBUSxNQUFNLHlCQUF5QixDQUFDOzs7OztJQUU5QyxNQUFNLEdBQUcsT0FBTztBQUV0QjtJQU9FLG1DQUNVLHNCQUE4QyxFQUM5QyxlQUFnQztRQURoQywyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1FBQzlDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUpuQyxlQUFVLEdBQVEsRUFBRSxDQUFDO0lBS3pCLENBQUM7Ozs7OztJQUVKLDRDQUFROzs7OztJQUFSLFVBQVMsS0FBVSxFQUFFLElBQVU7OztZQUN6QixPQUFPLEdBQUcsRUFBRTs7WUFDaEIsS0FBaUIsSUFBQSxVQUFBLGlCQUFBLEtBQUssQ0FBQSw0QkFBQSwrQ0FBRTtnQkFBbkIsSUFBSSxJQUFJLGtCQUFBOztvQkFDWCxLQUFxQixJQUFBLEtBQUEsaUJBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFBLGdCQUFBLDRCQUFFO3dCQUFsRCxJQUFJLFFBQVEsV0FBQTt3QkFDZixJQUNF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SyxFQUFFO3dCQUNMOzRCQUNFLElBQUksRUFDRiwrRUFBK0U7NEJBQ2pGLEtBQUssRUFBRSxjQUFjO3lCQUN0Qjt3QkFDRDs0QkFDRSxJQUFJLEVBQ0YsZ0VBQWdFOzRCQUNsRSxLQUFLLEVBQUUsY0FBYzt5QkFDdEI7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUM7O1lBRUUsR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQztRQUNuQyxHQUFHLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDN0MsQ0FBQzs7Ozs7SUFFRCwwQ0FBTTs7OztJQUFOLFVBQU8sR0FBUTtRQUNiLE9BQU8sTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3RELENBQUM7Ozs7O0lBRUQsMENBQU07Ozs7SUFBTixVQUFPLEtBQWE7UUFDbEIsMENBQTBDO1FBQzFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLEVBQUUsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RixDQUFDOztnQkFwUEYsVUFBVSxTQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7OztnQkFaUSxzQkFBc0I7Z0JBRHRCLGVBQWU7OztvQ0FIeEI7Q0FtUUMsQUFyUEQsSUFxUEM7U0FqUFkseUJBQXlCOzs7SUFDcEMsK0NBQTRCOzs7OztJQUcxQiwyREFBc0Q7Ozs7O0lBQ3RELG9EQUF3QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRm9ybSB9IGZyb20gJy4uL2Zvcm0tZW50cnkvZm9ybS1mYWN0b3J5L2Zvcm0nO1xuaW1wb3J0IHsgT2JzVmFsdWVBZGFwdGVyIH0gZnJvbSAnLi4vZm9ybS1lbnRyeS92YWx1ZS1hZGFwdGVycy9vYnMuYWRhcHRlcic7XG5pbXBvcnQgeyBFbmNvdW50ZXJWaWV3ZXJTZXJ2aWNlIH0gZnJvbSAnLi9lbmNvdW50ZXItdmlld2VyLnNlcnZpY2UnO1xuXG5pbXBvcnQgKiBhcyBtb21lbnRfIGZyb20gJ21vbWVudCc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgKiBhcyBwZGZNYWtlIGZyb20gJ3BkZm1ha2UvYnVpbGQvcGRmbWFrZS5qcyc7XG5pbXBvcnQgJ3BkZm1ha2UvYnVpbGQvdmZzX2ZvbnRzLmpzJztcbmltcG9ydCAqIGFzIHBkZkZvbnRzIGZyb20gJ3BkZm1ha2UvYnVpbGQvdmZzX2ZvbnRzJztcblxuY29uc3QgbW9tZW50ID0gbW9tZW50XztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5cbmV4cG9ydCBjbGFzcyBFbmNvdW50ZXJQZGZWaWV3ZXJTZXJ2aWNlIHtcbiAgcHVibGljIGlubmVyVmFsdWU6IGFueSA9ICcnO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZW5jb3VudGVyVmlld2VyU2VydmljZTogRW5jb3VudGVyVmlld2VyU2VydmljZSxcbiAgICBwcml2YXRlIG9ic1ZhbHVlQWRhcHRlcjogT2JzVmFsdWVBZGFwdGVyXG4gICkge31cblxuICBnZXRQYWdlcyhwYWdlczogYW55LCBmb3JtOiBGb3JtKTogYW55W10ge1xuICAgIGxldCBjb250ZW50ID0gW107XG4gICAgZm9yIChsZXQgcGFnZSBvZiBwYWdlcykge1xuICAgICAgZm9yIChsZXQgcXVlc3Rpb24gb2YgZm9ybS5yb290Tm9kZS5xdWVzdGlvbi5xdWVzdGlvbnMpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHBhZ2UubGFiZWwgPT09IGZvcm0ucm9vdE5vZGUuY2hpbGRyZW5bcXVlc3Rpb24ua2V5XS5xdWVzdGlvbi5sYWJlbCAmJlxuICAgICAgICAgIHRoaXMuZW5jb3VudGVyVmlld2VyU2VydmljZS5xdWVzdGlvbnNBbnN3ZXJlZChcbiAgICAgICAgICAgIGZvcm0ucm9vdE5vZGUuY2hpbGRyZW5bcXVlc3Rpb24ua2V5XVxuICAgICAgICAgIClcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29udGVudC5wdXNoKHtcbiAgICAgICAgICAgIHN0eWxlOiAndGFibGVFeGFtcGxlJyxcbiAgICAgICAgICAgIHRhYmxlOiB7XG4gICAgICAgICAgICAgIHdpZHRoczogWycqJ10sXG4gICAgICAgICAgICAgIGhlYWRlclJvd3M6IDEsXG4gICAgICAgICAgICAgIGtlZXBXaXRoSGVhZGVyUm93czogMSxcbiAgICAgICAgICAgICAgYm9keTogW1xuICAgICAgICAgICAgICAgIFt7IHRleHQ6IHBhZ2UubGFiZWwsIHN0eWxlOiAndGFibGVIZWFkZXInIH1dLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6ICd0YWJsZUV4YW1wbGUnLFxuICAgICAgICAgICAgICAgICAgICB0YWJsZToge1xuICAgICAgICAgICAgICAgICAgICAgIHdpZHRoczogWycqJ10sXG4gICAgICAgICAgICAgICAgICAgICAgYm9keTogdGhpcy5nZXRTZWN0aW9ucyhwYWdlLnBhZ2UsIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGxheW91dDogJ25vQm9yZGVycycsXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbjogWzEwLCAxMCwgMTAsIDEwXVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxheW91dDogJ25vQm9yZGVycydcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuXG4gIGdldFNlY3Rpb25zKHNlY3Rpb25zOiBhbnksIGZvcm06IEZvcm0pOiBhbnlbXSB7XG4gICAgbGV0IGNvbnRlbnQgPSBbXTtcbiAgICBmb3IgKGxldCBzZWN0aW9uIG9mIHNlY3Rpb25zKSB7XG4gICAgICBpZiAodGhpcy5lbmNvdW50ZXJWaWV3ZXJTZXJ2aWNlLnF1ZXN0aW9uc0Fuc3dlcmVkKHNlY3Rpb24ubm9kZSkpIHtcbiAgICAgICAgY29udGVudC5wdXNoKFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0YWJsZToge1xuICAgICAgICAgICAgICB3aWR0aHM6IFsnKiddLFxuICAgICAgICAgICAgICBib2R5OiBbXG4gICAgICAgICAgICAgICAgW3sgdGV4dDogc2VjdGlvbi5sYWJlbCwgc3R5bGU6ICd0YWJsZVN1YmhlYWRlcicsIG1hcmdpbjogWzUsIDVdIH1dLFxuICAgICAgICAgICAgICAgIFsgdGhpcy5nZXRTZWN0aW9uRGF0YShzZWN0aW9uLnNlY3Rpb24sIGZvcm0pIF1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxheW91dDogJ25vQm9yZGVycydcbiAgICAgICAgICB9XG4gICAgICAgIF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udGVudC5wdXNoKFt7IHRleHQ6ICcnIH1dKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICBnZXRTZWN0aW9uRGF0YShub2RlczogYW55LCBmb3JtOiBGb3JtKTogYW55IHtcbiAgICBsZXQgcXVlc3Rpb25zID0ge1xuICAgICAgc3RhY2s6IFtdXG4gICAgfTtcblxuICAgIGZvciAobGV0IG5vZGUgb2Ygbm9kZXMpIHtcbiAgICAgIHN3aXRjaCAobm9kZS5xdWVzdGlvbi5yZW5kZXJpbmdUeXBlKSB7XG4gICAgICAgIGNhc2UgJ2dyb3VwJzpcbiAgICAgICAgICBpZiAobm9kZS5ncm91cE1lbWJlcnMpIHtcbiAgICAgICAgICAgIHF1ZXN0aW9ucy5zdGFjay5wdXNoKHRoaXMuZ2V0U2VjdGlvbkRhdGEobm9kZS5ncm91cE1lbWJlcnMsIGZvcm0pKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICBjYXNlICdmaWVsZC1zZXQnOlxuICAgICAgICAgIGlmIChub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBjb25zdCBncm91cE1lbWJlcnMgPSBbXTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBPYmplY3Qua2V5cyhub2RlLmNoaWxkcmVuKS5tYXAoKGtleSkgPT4gbm9kZS5jaGlsZHJlbltrZXldKTtcblxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICBncm91cE1lbWJlcnMucHVzaChyZXN1bHQpO1xuICAgICAgICAgICAgICBxdWVzdGlvbnMuc3RhY2sucHVzaCh0aGlzLmdldFNlY3Rpb25EYXRhKGdyb3VwTWVtYmVyc1swXSwgZm9ybSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgJ3JlcGVhdGluZyc6XG4gICAgICAgICAgaWYgKG5vZGUuZ3JvdXBNZW1iZXJzKSB7XG4gICAgICAgICAgICBxdWVzdGlvbnMuc3RhY2sucHVzaCh0aGlzLmdldFNlY3Rpb25EYXRhKG5vZGUuZ3JvdXBNZW1iZXJzLCBmb3JtKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBsZXQgYW5zd2VyID0gbm9kZS5jb250cm9sLnZhbHVlO1xuICAgICAgICAgIHRoaXMucmVzb2x2ZVZhbHVlKGFuc3dlciwgZm9ybSk7XG5cbiAgICAgICAgICBpZiAodGhpcy5pbm5lclZhbHVlKSB7XG4gICAgICAgICAgICBxdWVzdGlvbnMuc3RhY2sucHVzaCh7XG4gICAgICAgICAgICAgIHRleHQ6IFtcbiAgICAgICAgICAgICAgICBgJHtub2RlLnF1ZXN0aW9uLmxhYmVsfSR7XG4gICAgICAgICAgICAgICAgICBub2RlLnF1ZXN0aW9uLmxhYmVsLmluZGV4T2YoJzonKSA+IDEgPyAnJyA6ICc6J1xuICAgICAgICAgICAgICAgIH0gYCxcbiAgICAgICAgICAgICAgICB7IHRleHQ6IGAke3RoaXMuaW5uZXJWYWx1ZX1gLCBib2xkOiB0cnVlIH1cbiAgICAgICAgICAgICAgXSwgbWFyZ2luOiBbNSwgMl1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHF1ZXN0aW9ucztcbiAgfVxuXG4gIHJlc29sdmVWYWx1ZSh2YWx1ZTogYW55LCBmb3JtOiBGb3JtLCBhcnJheUVsZW1lbnQ/OiBib29sZWFuKTogYW55IHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuaW5uZXJWYWx1ZSkge1xuICAgICAgaWYgKHRoaXMuaXNVdWlkKHZhbHVlKSkge1xuICAgICAgICBjb25zdCB2YWwgPSB0aGlzLmVuY291bnRlclZpZXdlclNlcnZpY2UucmVzb2x2ZVNlbGVjdGVkVmFsdWVGcm9tU2NoZW1hKHZhbHVlLCBmb3JtLnNjaGVtYSk7XG4gICAgICAgIGlmICghYXJyYXlFbGVtZW50KSB7XG4gICAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgICAgdGhpcy5pbm5lclZhbHVlID0gdmFsLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaW5uZXJWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgY29uc3QgYXJyID0gW107XG4gICAgICAgIF8uZm9yRWFjaCh2YWx1ZSwgZWxlbSA9PiB7XG4gICAgICAgICAgYXJyLnB1c2godGhpcy5yZXNvbHZlVmFsdWUoZWxlbSwgZm9ybSwgdHJ1ZSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5pbm5lclZhbHVlID0gYXJyO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgaWYgKCFhcnJheUVsZW1lbnQpIHtcbiAgICAgICAgICB0aGlzLmlubmVyVmFsdWUgPSB0aGlzLmVuY291bnRlclZpZXdlclNlcnZpY2UuY29udmVydFRpbWUodmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVuY291bnRlclZpZXdlclNlcnZpY2UuY29udmVydFRpbWUodmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gW107XG4gICAgICAgIGxldCByZXN1bHQgPSBPYmplY3Qua2V5cyh2YWx1ZSkubWFwKChrZXkpID0+IFtrZXksIHZhbHVlW2tleV1dKTtcblxuICAgICAgICB2YWx1ZXMucHVzaChyZXN1bHQpO1xuICAgICAgICB0aGlzLmlubmVyVmFsdWUgPSB2YWx1ZXM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWFycmF5RWxlbWVudCkge1xuICAgICAgICAgIHRoaXMuaW5uZXJWYWx1ZSA9IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdlbmVyYXRlUGRmRGVmaW5pdGlvbihmb3JtOiBGb3JtKTogYW55IHtcbiAgICBjb25zdCBkb2NEZWZpbml0aW9uID0ge1xuICAgICAgY29udGVudDogdGhpcy5nZXRQYWdlcyhcbiAgICAgICAgdGhpcy5vYnNWYWx1ZUFkYXB0ZXIudHJhdmVyc2UoZm9ybS5yb290Tm9kZSksXG4gICAgICAgIGZvcm1cbiAgICAgICksXG4gICAgICBzdHlsZXM6IHtcbiAgICAgICAgY29uZmlkZW50aWFsOiB7XG4gICAgICAgICAgY29sb3I6ICdyZWQnLFxuICAgICAgICAgIGJvbGQ6IHRydWUsXG4gICAgICAgICAgYWxpZ25tZW50OiAnY2VudGVyJ1xuICAgICAgICB9LFxuICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICBmb250U2l6ZTogMTQsXG4gICAgICAgICAgYm9sZDogdHJ1ZSxcbiAgICAgICAgICBtYXJnaW46IFs1LCA1LCA1LCA1XVxuICAgICAgICB9LFxuICAgICAgICB0YWJsZUV4YW1wbGU6IHtcbiAgICAgICAgICBmb250U2l6ZTogMTIsXG4gICAgICAgICAgbWFyZ2luOiBbNSwgMCwgMCwgNV1cbiAgICAgICAgfSxcbiAgICAgICAgdGFibGVIZWFkZXI6IHtcbiAgICAgICAgICBmaWxsQ29sb3I6ICcjZjVmNWY1JyxcbiAgICAgICAgICB3aWR0aDogWycxMDAlJ10sXG4gICAgICAgICAgYm9yZGVyQ29sb3I6ICcjMzMzJyxcbiAgICAgICAgICBmb250U2l6ZTogMTQsXG4gICAgICAgICAgYm9sZDogdHJ1ZSxcbiAgICAgICAgICBtYXJnaW46IFs1LCA1LCA1LCA1XVxuICAgICAgICB9LFxuICAgICAgICB0YWJsZVN1YmhlYWRlcjoge1xuICAgICAgICAgIGZpbGxDb2xvcjogJyMzMzdhYjcnLFxuICAgICAgICAgIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgICAgICBtYXJnaW46IFs1LCAwLCA1LCAwXVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGVmYXVsdFN0eWxlOiB7XG4gICAgICAgIGZvbnRTaXplOiAxMlxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gZG9jRGVmaW5pdGlvbjtcbiAgfVxuXG4gIGRpc3BsYXlQZGYoZm9ybSkge1xuICAgIGxldCBwZGYgPSBwZGZNYWtlO1xuICAgIHBkZi52ZnMgPSBwZGZGb250cy5wZGZNYWtlLnZmcztcbiAgICBsZXQgZG9jRGVmaW5pdGlvbiA9IHRoaXMuZ2VuZXJhdGVQZGZEZWZpbml0aW9uKGZvcm0pO1xuXG4gICAgZG9jRGVmaW5pdGlvbi5mb290ZXIgPSB7XG4gICAgICBjb2x1bW5zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzdGFjazogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0ZXh0OlxuICAgICAgICAgICAgICAgICdOb3RlOiBDb25maWRlbnRpYWxpdHkgaXMgb25lIG9mIHRoZSBjb3JlIGR1dGllcyBvZiBhbGwgbWVkaWNhbCBwcmFjdGl0aW9uZXJzLicsXG4gICAgICAgICAgICAgIHN0eWxlOiAnY29uZmlkZW50aWFsJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGV4dDpcbiAgICAgICAgICAgICAgICBgIFBhdGllbnRzJyBwZXJzb25hbCBoZWFsdGggaW5mb3JtYXRpb24gc2hvdWxkIGJlIGtlcHQgcHJpdmF0ZS5gLFxuICAgICAgICAgICAgICBzdHlsZTogJ2NvbmZpZGVudGlhbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9O1xuXG4gICAgdmFyIHdpbiA9IHdpbmRvdy5vcGVuKCcnLCAnX2JsYW5rJyk7XG4gICAgcGRmLmNyZWF0ZVBkZihkb2NEZWZpbml0aW9uKS5vcGVuKHt9LCB3aW4pO1xuICB9XG5cbiAgaXNEYXRlKHZhbDogYW55KSB7XG4gICAgcmV0dXJuIG1vbWVudCh2YWwsIG1vbWVudC5JU09fODYwMSwgdHJ1ZSkuaXNWYWxpZCgpO1xuICB9XG5cbiAgaXNVdWlkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAvLyBDb25zaWRlciBtYXRjaGluZyBhZ2FpbnN0IGEgdXVpZCByZWdleHBcbiAgICByZXR1cm4gKHZhbHVlLmxlbmd0aCA9PT0gMzYgJiYgdmFsdWUuaW5kZXhPZignICcpID09PSAtMSAmJiB2YWx1ZS5pbmRleE9mKCcuJykgPT09IC0xKTtcbiAgfVxufVxuIl19