/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
const moment = moment_;
export class EncounterPdfViewerService {
    /**
     * @param {?} encounterViewerService
     * @param {?} obsValueAdapter
     */
    constructor(encounterViewerService, obsValueAdapter) {
        this.encounterViewerService = encounterViewerService;
        this.obsValueAdapter = obsValueAdapter;
        this.innerValue = '';
    }
    /**
     * @param {?} pages
     * @param {?} form
     * @return {?}
     */
    getPages(pages, form) {
        /** @type {?} */
        let content = [];
        for (let page of pages) {
            for (let question of form.rootNode.question.questions) {
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
        return content;
    }
    /**
     * @param {?} sections
     * @param {?} form
     * @return {?}
     */
    getSections(sections, form) {
        /** @type {?} */
        let content = [];
        for (let section of sections) {
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
        return content;
    }
    /**
     * @param {?} nodes
     * @param {?} form
     * @return {?}
     */
    getSectionData(nodes, form) {
        /** @type {?} */
        let questions = {
            stack: []
        };
        for (let node of nodes) {
            switch (node.question.renderingType) {
                case 'group':
                    if (node.groupMembers) {
                        questions.stack.push(this.getSectionData(node.groupMembers, form));
                        break;
                    }
                case 'field-set':
                    if (node.children) {
                        /** @type {?} */
                        const groupMembers = [];
                        /** @type {?} */
                        var result = Object.keys(node.children).map((key) => node.children[key]);
                        if (result) {
                            groupMembers.push(result);
                            questions.stack.push(this.getSectionData(groupMembers[0], form));
                        }
                        break;
                    }
                case 'repeating':
                    if (node.groupMembers) {
                        questions.stack.push(this.getSectionData(node.groupMembers, form));
                        break;
                    }
                default:
                    /** @type {?} */
                    let answer = node.control.value;
                    this.resolveValue(answer, form);
                    if (this.innerValue) {
                        questions.stack.push({
                            text: [
                                `${node.question.label}${node.question.label.indexOf(':') > 1 ? '' : ':'} `,
                                { text: `${this.innerValue}`, bold: true }
                            ], margin: [5, 2]
                        });
                    }
            }
        }
        return questions;
    }
    /**
     * @param {?} value
     * @param {?} form
     * @param {?=} arrayElement
     * @return {?}
     */
    resolveValue(value, form, arrayElement) {
        if (value !== this.innerValue) {
            if (this.isUuid(value)) {
                /** @type {?} */
                const val = this.encounterViewerService.resolveSelectedValueFromSchema(value, form.schema);
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
                const arr = [];
                _.forEach(value, elem => {
                    arr.push(this.resolveValue(elem, form, true));
                });
                this.innerValue = arr;
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
                const values = [];
                /** @type {?} */
                let result = Object.keys(value).map((key) => [key, value[key]]);
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
    }
    /**
     * @param {?} form
     * @return {?}
     */
    generatePdfDefinition(form) {
        /** @type {?} */
        const docDefinition = {
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
    }
    /**
     * @param {?} form
     * @return {?}
     */
    displayPdf(form) {
        /** @type {?} */
        let pdf = pdfMake;
        pdf.vfs = pdfFonts.pdfMake.vfs;
        /** @type {?} */
        let docDefinition = this.generatePdfDefinition(form);
        docDefinition.footer = {
            columns: [
                {
                    stack: [
                        {
                            text: 'Note: Confidentiality is one of the core duties of all medical practitioners.',
                            style: 'confidential'
                        },
                        {
                            text: ` Patients' personal health information should be kept private.`,
                            style: 'confidential'
                        }
                    ]
                }
            ]
        };
        /** @type {?} */
        var win = window.open('', '_blank');
        pdf.createPdf(docDefinition).open({}, win);
    }
    /**
     * @param {?} val
     * @return {?}
     */
    isDate(val) {
        return moment(val, moment.ISO_8601, true).isValid();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    isUuid(value) {
        // Consider matching against a uuid regexp
        return (value.length === 36 && value.indexOf(' ') === -1 && value.indexOf('.') === -1);
    }
}
EncounterPdfViewerService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
EncounterPdfViewerService.ctorParameters = () => [
    { type: EncounterViewerService },
    { type: ObsValueAdapter }
];
/** @nocollapse */ EncounterPdfViewerService.ngInjectableDef = i0.defineInjectable({ factory: function EncounterPdfViewerService_Factory() { return new EncounterPdfViewerService(i0.inject(i1.EncounterViewerService), i0.inject(i2.ObsValueAdapter)); }, token: EncounterPdfViewerService, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb3VudGVyLXBkZi12aWV3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1vcGVubXJzLWZvcm1lbnRyeS8iLCJzb3VyY2VzIjpbImVuY291bnRlci12aWV3ZXIvZW5jb3VudGVyLXBkZi12aWV3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDM0UsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFcEUsT0FBTyxLQUFLLE9BQU8sTUFBTSxRQUFRLENBQUM7QUFDbEMsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxLQUFLLE9BQU8sTUFBTSwwQkFBMEIsQ0FBQztBQUNwRCxPQUFPLDRCQUE0QixDQUFDO0FBQ3BDLE9BQU8sS0FBSyxRQUFRLE1BQU0seUJBQXlCLENBQUM7Ozs7O01BRTlDLE1BQU0sR0FBRyxPQUFPO0FBTXRCLE1BQU0sT0FBTyx5QkFBeUI7Ozs7O0lBR3BDLFlBQ1Usc0JBQThDLEVBQzlDLGVBQWdDO1FBRGhDLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7UUFDOUMsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBSm5DLGVBQVUsR0FBUSxFQUFFLENBQUM7SUFLekIsQ0FBQzs7Ozs7O0lBRUosUUFBUSxDQUFDLEtBQVUsRUFBRSxJQUFVOztZQUN6QixPQUFPLEdBQUcsRUFBRTtRQUNoQixLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtZQUN0QixLQUFLLElBQUksUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRTtnQkFDckQsSUFDRSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFH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QUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM3QyxDQUFDOzs7OztJQUVELE1BQU0sQ0FBQyxHQUFRO1FBQ2IsT0FBTyxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDdEQsQ0FBQzs7Ozs7SUFFRCxNQUFNLENBQUMsS0FBYTtRQUNsQiwwQ0FBMEM7UUFDMUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7OztZQXBQRixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7WUFaUSxzQkFBc0I7WUFEdEIsZUFBZTs7Ozs7SUFnQnRCLCtDQUE0Qjs7Ozs7SUFHMUIsMkRBQXNEOzs7OztJQUN0RCxvREFBd0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEZvcm0gfSBmcm9tICcuLi9mb3JtLWVudHJ5L2Zvcm0tZmFjdG9yeS9mb3JtJztcbmltcG9ydCB7IE9ic1ZhbHVlQWRhcHRlciB9IGZyb20gJy4uL2Zvcm0tZW50cnkvdmFsdWUtYWRhcHRlcnMvb2JzLmFkYXB0ZXInO1xuaW1wb3J0IHsgRW5jb3VudGVyVmlld2VyU2VydmljZSB9IGZyb20gJy4vZW5jb3VudGVyLXZpZXdlci5zZXJ2aWNlJztcblxuaW1wb3J0ICogYXMgbW9tZW50XyBmcm9tICdtb21lbnQnO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0ICogYXMgcGRmTWFrZSBmcm9tICdwZGZtYWtlL2J1aWxkL3BkZm1ha2UuanMnO1xuaW1wb3J0ICdwZGZtYWtlL2J1aWxkL3Zmc19mb250cy5qcyc7XG5pbXBvcnQgKiBhcyBwZGZGb250cyBmcm9tICdwZGZtYWtlL2J1aWxkL3Zmc19mb250cyc7XG5cbmNvbnN0IG1vbWVudCA9IG1vbWVudF87XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuXG5leHBvcnQgY2xhc3MgRW5jb3VudGVyUGRmVmlld2VyU2VydmljZSB7XG4gIHB1YmxpYyBpbm5lclZhbHVlOiBhbnkgPSAnJztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVuY291bnRlclZpZXdlclNlcnZpY2U6IEVuY291bnRlclZpZXdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBvYnNWYWx1ZUFkYXB0ZXI6IE9ic1ZhbHVlQWRhcHRlclxuICApIHt9XG5cbiAgZ2V0UGFnZXMocGFnZXM6IGFueSwgZm9ybTogRm9ybSk6IGFueVtdIHtcbiAgICBsZXQgY29udGVudCA9IFtdO1xuICAgIGZvciAobGV0IHBhZ2Ugb2YgcGFnZXMpIHtcbiAgICAgIGZvciAobGV0IHF1ZXN0aW9uIG9mIGZvcm0ucm9vdE5vZGUucXVlc3Rpb24ucXVlc3Rpb25zKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBwYWdlLmxhYmVsID09PSBmb3JtLnJvb3ROb2RlLmNoaWxkcmVuW3F1ZXN0aW9uLmtleV0ucXVlc3Rpb24ubGFiZWwgJiZcbiAgICAgICAgICB0aGlzLmVuY291bnRlclZpZXdlclNlcnZpY2UucXVlc3Rpb25zQW5zd2VyZWQoXG4gICAgICAgICAgICBmb3JtLnJvb3ROb2RlLmNoaWxkcmVuW3F1ZXN0aW9uLmtleV1cbiAgICAgICAgICApXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnRlbnQucHVzaCh7XG4gICAgICAgICAgICBzdHlsZTogJ3RhYmxlRXhhbXBsZScsXG4gICAgICAgICAgICB0YWJsZToge1xuICAgICAgICAgICAgICB3aWR0aHM6IFsnKiddLFxuICAgICAgICAgICAgICBoZWFkZXJSb3dzOiAxLFxuICAgICAgICAgICAgICBrZWVwV2l0aEhlYWRlclJvd3M6IDEsXG4gICAgICAgICAgICAgIGJvZHk6IFtcbiAgICAgICAgICAgICAgICBbeyB0ZXh0OiBwYWdlLmxhYmVsLCBzdHlsZTogJ3RhYmxlSGVhZGVyJyB9XSxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiAndGFibGVFeGFtcGxlJyxcbiAgICAgICAgICAgICAgICAgICAgdGFibGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICB3aWR0aHM6IFsnKiddLFxuICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IHRoaXMuZ2V0U2VjdGlvbnMocGFnZS5wYWdlLCBmb3JtKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBsYXlvdXQ6ICdub0JvcmRlcnMnLFxuICAgICAgICAgICAgICAgICAgICBtYXJnaW46IFsxMCwgMTAsIDEwLCAxMF1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsYXlvdXQ6ICdub0JvcmRlcnMnXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICBnZXRTZWN0aW9ucyhzZWN0aW9uczogYW55LCBmb3JtOiBGb3JtKTogYW55W10ge1xuICAgIGxldCBjb250ZW50ID0gW107XG4gICAgZm9yIChsZXQgc2VjdGlvbiBvZiBzZWN0aW9ucykge1xuICAgICAgaWYgKHRoaXMuZW5jb3VudGVyVmlld2VyU2VydmljZS5xdWVzdGlvbnNBbnN3ZXJlZChzZWN0aW9uLm5vZGUpKSB7XG4gICAgICAgIGNvbnRlbnQucHVzaChbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGFibGU6IHtcbiAgICAgICAgICAgICAgd2lkdGhzOiBbJyonXSxcbiAgICAgICAgICAgICAgYm9keTogW1xuICAgICAgICAgICAgICAgIFt7IHRleHQ6IHNlY3Rpb24ubGFiZWwsIHN0eWxlOiAndGFibGVTdWJoZWFkZXInLCBtYXJnaW46IFs1LCA1XSB9XSxcbiAgICAgICAgICAgICAgICBbIHRoaXMuZ2V0U2VjdGlvbkRhdGEoc2VjdGlvbi5zZWN0aW9uLCBmb3JtKSBdXG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsYXlvdXQ6ICdub0JvcmRlcnMnXG4gICAgICAgICAgfVxuICAgICAgICBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRlbnQucHVzaChbeyB0ZXh0OiAnJyB9XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgZ2V0U2VjdGlvbkRhdGEobm9kZXM6IGFueSwgZm9ybTogRm9ybSk6IGFueSB7XG4gICAgbGV0IHF1ZXN0aW9ucyA9IHtcbiAgICAgIHN0YWNrOiBbXVxuICAgIH07XG5cbiAgICBmb3IgKGxldCBub2RlIG9mIG5vZGVzKSB7XG4gICAgICBzd2l0Y2ggKG5vZGUucXVlc3Rpb24ucmVuZGVyaW5nVHlwZSkge1xuICAgICAgICBjYXNlICdncm91cCc6XG4gICAgICAgICAgaWYgKG5vZGUuZ3JvdXBNZW1iZXJzKSB7XG4gICAgICAgICAgICBxdWVzdGlvbnMuc3RhY2sucHVzaCh0aGlzLmdldFNlY3Rpb25EYXRhKG5vZGUuZ3JvdXBNZW1iZXJzLCBmb3JtKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgY2FzZSAnZmllbGQtc2V0JzpcbiAgICAgICAgICBpZiAobm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgY29uc3QgZ3JvdXBNZW1iZXJzID0gW107XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gT2JqZWN0LmtleXMobm9kZS5jaGlsZHJlbikubWFwKChrZXkpID0+IG5vZGUuY2hpbGRyZW5ba2V5XSk7XG5cbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgZ3JvdXBNZW1iZXJzLnB1c2gocmVzdWx0KTtcbiAgICAgICAgICAgICAgcXVlc3Rpb25zLnN0YWNrLnB1c2godGhpcy5nZXRTZWN0aW9uRGF0YShncm91cE1lbWJlcnNbMF0sIGZvcm0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICBjYXNlICdyZXBlYXRpbmcnOlxuICAgICAgICAgIGlmIChub2RlLmdyb3VwTWVtYmVycykge1xuICAgICAgICAgICAgcXVlc3Rpb25zLnN0YWNrLnB1c2godGhpcy5nZXRTZWN0aW9uRGF0YShub2RlLmdyb3VwTWVtYmVycywgZm9ybSkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgbGV0IGFuc3dlciA9IG5vZGUuY29udHJvbC52YWx1ZTtcbiAgICAgICAgICB0aGlzLnJlc29sdmVWYWx1ZShhbnN3ZXIsIGZvcm0pO1xuXG4gICAgICAgICAgaWYgKHRoaXMuaW5uZXJWYWx1ZSkge1xuICAgICAgICAgICAgcXVlc3Rpb25zLnN0YWNrLnB1c2goe1xuICAgICAgICAgICAgICB0ZXh0OiBbXG4gICAgICAgICAgICAgICAgYCR7bm9kZS5xdWVzdGlvbi5sYWJlbH0ke1xuICAgICAgICAgICAgICAgICAgbm9kZS5xdWVzdGlvbi5sYWJlbC5pbmRleE9mKCc6JykgPiAxID8gJycgOiAnOidcbiAgICAgICAgICAgICAgICB9IGAsXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiBgJHt0aGlzLmlubmVyVmFsdWV9YCwgYm9sZDogdHJ1ZSB9XG4gICAgICAgICAgICAgIF0sIG1hcmdpbjogWzUsIDJdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBxdWVzdGlvbnM7XG4gIH1cblxuICByZXNvbHZlVmFsdWUodmFsdWU6IGFueSwgZm9ybTogRm9ybSwgYXJyYXlFbGVtZW50PzogYm9vbGVhbik6IGFueSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLmlubmVyVmFsdWUpIHtcbiAgICAgIGlmICh0aGlzLmlzVXVpZCh2YWx1ZSkpIHtcbiAgICAgICAgY29uc3QgdmFsID0gdGhpcy5lbmNvdW50ZXJWaWV3ZXJTZXJ2aWNlLnJlc29sdmVTZWxlY3RlZFZhbHVlRnJvbVNjaGVtYSh2YWx1ZSwgZm9ybS5zY2hlbWEpO1xuICAgICAgICBpZiAoIWFycmF5RWxlbWVudCkge1xuICAgICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICAgIHRoaXMuaW5uZXJWYWx1ZSA9IHZhbC50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlubmVyVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChfLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIGNvbnN0IGFyciA9IFtdO1xuICAgICAgICBfLmZvckVhY2godmFsdWUsIGVsZW0gPT4ge1xuICAgICAgICAgIGFyci5wdXNoKHRoaXMucmVzb2x2ZVZhbHVlKGVsZW0sIGZvcm0sIHRydWUpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW5uZXJWYWx1ZSA9IGFycjtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0RhdGUodmFsdWUpKSB7XG4gICAgICAgIGlmICghYXJyYXlFbGVtZW50KSB7XG4gICAgICAgICAgdGhpcy5pbm5lclZhbHVlID0gdGhpcy5lbmNvdW50ZXJWaWV3ZXJTZXJ2aWNlLmNvbnZlcnRUaW1lKHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lbmNvdW50ZXJWaWV3ZXJTZXJ2aWNlLmNvbnZlcnRUaW1lKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IFtdO1xuICAgICAgICBsZXQgcmVzdWx0ID0gT2JqZWN0LmtleXModmFsdWUpLm1hcCgoa2V5KSA9PiBba2V5LCB2YWx1ZVtrZXldXSk7XG5cbiAgICAgICAgdmFsdWVzLnB1c2gocmVzdWx0KTtcbiAgICAgICAgdGhpcy5pbm5lclZhbHVlID0gdmFsdWVzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFhcnJheUVsZW1lbnQpIHtcbiAgICAgICAgICB0aGlzLmlubmVyVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZW5lcmF0ZVBkZkRlZmluaXRpb24oZm9ybTogRm9ybSk6IGFueSB7XG4gICAgY29uc3QgZG9jRGVmaW5pdGlvbiA9IHtcbiAgICAgIGNvbnRlbnQ6IHRoaXMuZ2V0UGFnZXMoXG4gICAgICAgIHRoaXMub2JzVmFsdWVBZGFwdGVyLnRyYXZlcnNlKGZvcm0ucm9vdE5vZGUpLFxuICAgICAgICBmb3JtXG4gICAgICApLFxuICAgICAgc3R5bGVzOiB7XG4gICAgICAgIGNvbmZpZGVudGlhbDoge1xuICAgICAgICAgIGNvbG9yOiAncmVkJyxcbiAgICAgICAgICBib2xkOiB0cnVlLFxuICAgICAgICAgIGFsaWdubWVudDogJ2NlbnRlcidcbiAgICAgICAgfSxcbiAgICAgICAgaGVhZGVyOiB7XG4gICAgICAgICAgZm9udFNpemU6IDE0LFxuICAgICAgICAgIGJvbGQ6IHRydWUsXG4gICAgICAgICAgbWFyZ2luOiBbNSwgNSwgNSwgNV1cbiAgICAgICAgfSxcbiAgICAgICAgdGFibGVFeGFtcGxlOiB7XG4gICAgICAgICAgZm9udFNpemU6IDEyLFxuICAgICAgICAgIG1hcmdpbjogWzUsIDAsIDAsIDVdXG4gICAgICAgIH0sXG4gICAgICAgIHRhYmxlSGVhZGVyOiB7XG4gICAgICAgICAgZmlsbENvbG9yOiAnI2Y1ZjVmNScsXG4gICAgICAgICAgd2lkdGg6IFsnMTAwJSddLFxuICAgICAgICAgIGJvcmRlckNvbG9yOiAnIzMzMycsXG4gICAgICAgICAgZm9udFNpemU6IDE0LFxuICAgICAgICAgIGJvbGQ6IHRydWUsXG4gICAgICAgICAgbWFyZ2luOiBbNSwgNSwgNSwgNV1cbiAgICAgICAgfSxcbiAgICAgICAgdGFibGVTdWJoZWFkZXI6IHtcbiAgICAgICAgICBmaWxsQ29sb3I6ICcjMzM3YWI3JyxcbiAgICAgICAgICBmb250U2l6ZTogMTQsXG4gICAgICAgICAgY29sb3I6ICd3aGl0ZScsXG4gICAgICAgICAgbWFyZ2luOiBbNSwgMCwgNSwgMF1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRTdHlsZToge1xuICAgICAgICBmb250U2l6ZTogMTJcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIGRvY0RlZmluaXRpb247XG4gIH1cblxuICBkaXNwbGF5UGRmKGZvcm0pIHtcbiAgICBsZXQgcGRmID0gcGRmTWFrZTtcbiAgICBwZGYudmZzID0gcGRmRm9udHMucGRmTWFrZS52ZnM7XG4gICAgbGV0IGRvY0RlZmluaXRpb24gPSB0aGlzLmdlbmVyYXRlUGRmRGVmaW5pdGlvbihmb3JtKTtcblxuICAgIGRvY0RlZmluaXRpb24uZm9vdGVyID0ge1xuICAgICAgY29sdW1uczogW1xuICAgICAgICB7XG4gICAgICAgICAgc3RhY2s6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGV4dDpcbiAgICAgICAgICAgICAgICAnTm90ZTogQ29uZmlkZW50aWFsaXR5IGlzIG9uZSBvZiB0aGUgY29yZSBkdXRpZXMgb2YgYWxsIG1lZGljYWwgcHJhY3RpdGlvbmVycy4nLFxuICAgICAgICAgICAgICBzdHlsZTogJ2NvbmZpZGVudGlhbCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRleHQ6XG4gICAgICAgICAgICAgICAgYCBQYXRpZW50cycgcGVyc29uYWwgaGVhbHRoIGluZm9ybWF0aW9uIHNob3VsZCBiZSBrZXB0IHByaXZhdGUuYCxcbiAgICAgICAgICAgICAgc3R5bGU6ICdjb25maWRlbnRpYWwnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcblxuICAgIHZhciB3aW4gPSB3aW5kb3cub3BlbignJywgJ19ibGFuaycpO1xuICAgIHBkZi5jcmVhdGVQZGYoZG9jRGVmaW5pdGlvbikub3Blbih7fSwgd2luKTtcbiAgfVxuXG4gIGlzRGF0ZSh2YWw6IGFueSkge1xuICAgIHJldHVybiBtb21lbnQodmFsLCBtb21lbnQuSVNPXzg2MDEsIHRydWUpLmlzVmFsaWQoKTtcbiAgfVxuXG4gIGlzVXVpZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgLy8gQ29uc2lkZXIgbWF0Y2hpbmcgYWdhaW5zdCBhIHV1aWQgcmVnZXhwXG4gICAgcmV0dXJuICh2YWx1ZS5sZW5ndGggPT09IDM2ICYmIHZhbHVlLmluZGV4T2YoJyAnKSA9PT0gLTEgJiYgdmFsdWUuaW5kZXhPZignLicpID09PSAtMSk7XG4gIH1cbn1cbiJdfQ==