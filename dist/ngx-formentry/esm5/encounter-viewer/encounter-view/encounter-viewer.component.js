/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { NodeBase } from '../../form-entry/form-factory/form-node';
import { AfeFormGroup } from '../../abstract-controls-extension/afe-form-group';
import { DataSources } from '../../form-entry/data-sources/data-sources';
import { EncounterViewerService } from '../encounter-viewer.service';
var EncounterViewerComponent = /** @class */ (function () {
    function EncounterViewerComponent(encounterViewerService, dataSources) {
        this.encounterViewerService = encounterViewerService;
        this.dataSources = dataSources;
    }
    Object.defineProperty(EncounterViewerComponent.prototype, "node", {
        set: /**
         * @param {?} rootNode
         * @return {?}
         */
        function (rootNode) {
            this.rootNode = rootNode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EncounterViewerComponent.prototype, "schema", {
        set: /**
         * @param {?} schema
         * @return {?}
         */
        function (schema) {
            this._schema = schema;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EncounterViewerComponent.prototype, "encounter", {
        set: /**
         * @param {?} enc
         * @return {?}
         */
        function (enc) {
            this.enc = enc;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EncounterViewerComponent.prototype, "form", {
        set: /**
         * @param {?} form
         * @return {?}
         */
        function (form) {
            this.rootNode = form.rootNode;
            this._schema = form.schema;
            console.log(this.getQuestionNodes(this.traverse(this.rootNode)));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} pages
     * @return {?}
     */
    EncounterViewerComponent.prototype.getQuestionNodes = /**
     * @param {?} pages
     * @return {?}
     */
    function (pages) {
        /** @type {?} */
        var merged = [];
        /** @type {?} */
        var arrays = [];
        try {
            for (var pages_1 = tslib_1.__values(pages), pages_1_1 = pages_1.next(); !pages_1_1.done; pages_1_1 = pages_1.next()) {
                var page = pages_1_1.value;
                arrays.push(page.page);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (pages_1_1 && !pages_1_1.done && (_a = pages_1.return)) _a.call(pages_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return merged.concat.apply([], arrays);
        var e_1, _a;
    };
    /**
     * @return {?}
     */
    EncounterViewerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (this.rootNode) {
        }
        if (this.rootNode && this.rootNode.question.extras
            && this.rootNode.question.renderingType === 'file') {
            this.fileDataSource =
                this.dataSources.dataSources[this.rootNode.question.dataSource];
        }
        else if (this.rootNode && this.rootNode.question.extras
            && this.rootNode.question.renderingType === 'remote-select') {
            this.remoteDataSource =
                this.dataSources.dataSources[this.rootNode.question.dataSource];
        }
        else {
            this.customDataSource = this.encounterViewerService;
        }
    };
    /**
     * @param {?} node
     * @return {?}
     */
    EncounterViewerComponent.prototype.questionsAnswered = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        /** @type {?} */
        var $answered = this.encounterViewerService.questionsAnswered(node);
        return $answered;
    };
    /**
     * @param {?} node
     * @return {?}
     */
    EncounterViewerComponent.prototype.questionAnswered = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        /** @type {?} */
        var answered = this.encounterViewerService.hasAnswer(node);
        return answered;
    };
    /**
     * @param {?} questionLabel
     * @return {?}
     */
    EncounterViewerComponent.prototype.checkForColon = /**
     * @param {?} questionLabel
     * @return {?}
     */
    function (questionLabel) {
        if (questionLabel.indexOf(':') === -1) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * @param {?} o
     * @param {?=} type
     * @return {?}
     */
    EncounterViewerComponent.prototype.traverse = /**
     * @param {?} o
     * @param {?=} type
     * @return {?}
     */
    function (o, type) {
        /** @type {?} */
        var questions = [];
        if (o.children) {
            if (o.children instanceof Array) {
                /** @type {?} */
                var returned = this.repeatingGroup(o.children);
                return returned;
            }
            if (o.children instanceof Object) {
                for (var key in o.children) {
                    if (o.children.hasOwnProperty(key)) {
                        switch (o.children[key].question.renderingType) {
                            case 'page':
                                /** @type {?} */
                                var page = this.traverse(o.children[key]);
                                questions.push({ page: page });
                                break;
                            case 'section':
                                /** @type {?} */
                                var section = this.traverse(o.children[key]);
                                questions.push({ section: section });
                                break;
                            case 'group':
                                /** @type {?} */
                                var qs = this.traverse(o.children[key]);
                                questions.push({ node: o.children[key], question: o.children[key].question, groupMembers: qs });
                                break;
                            case 'repeating':
                                /** @type {?} */
                                var rep = this.repeatingGroup(o.children[key].children);
                                questions.push({ node: o.children[key], question: o.children[key].question, groupMembers: rep });
                                break;
                            default:
                                questions.push(o.children[key]);
                                break;
                        }
                    }
                }
            }
            else {
                console.log('Console.log', o);
            }
        }
        return questions;
    };
    /**
     * @param {?} nodes
     * @return {?}
     */
    EncounterViewerComponent.prototype.repeatingGroup = /**
     * @param {?} nodes
     * @return {?}
     */
    function (nodes) {
        /** @type {?} */
        var toReturn = [];
        try {
            for (var nodes_1 = tslib_1.__values(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
                var node = nodes_1_1.value;
                toReturn.push({ question: node.question, groupMembers: this.traverse(node) });
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return toReturn;
        var e_2, _a;
    };
    EncounterViewerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'encounter-viewer',
                    template: "<div class=\"viewer\">\n\n  <div *ngIf=\"rootNode.question.renderingType === 'form'\" class=\"form\">\n    <div *ngFor=\"let question of rootNode.question.questions; let i = index;\">\n      <div *ngIf=\"questionsAnswered(rootNode.children[question.key])\">\n        <div [attr.id]=\"'page'+i\" class=\"panel panel-default\">\n          <p class=\"page-label panel-heading text-primary\">{{question.label}}</p>\n          <div class=\"panel-body\">\n            <encounter-viewer [node]=\"rootNode.children[question.key]\" [schema]=\"_schema\" [parentComponent]=\"this\" [parentGroup]=\"rootNode.control\"></encounter-viewer>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div *ngIf=\"rootNode.question.renderingType === 'page'\" class=\"page\">\n    <encounter-viewer *ngFor=\"let question of rootNode.question.questions\" [parentComponent]=\"this\" [node]=\"rootNode.children[question.key]\"\n      [schema]=\"_schema\" [parentGroup]=\"parentGroup\"></encounter-viewer>\n  </div>\n\n\n  <div *ngIf=\"rootNode.question.renderingType === 'section'&& questionsAnswered(rootNode)\"\n    class=\"section\">\n    <div class=\"panel panel-primary\">\n      <p class=\"panel-heading section-label\">{{ rootNode.question.label }}</p>\n    </div>\n    <div *ngFor=\"let question of rootNode.question.questions\">\n      <encounter-viewer [node]=\"rootNode.children[question.key]\" [parentComponent]=\"this\" [schema]=\"_schema\" [parentGroup]=\"parentGroup\"></encounter-viewer>\n    </div>\n  </div>\n\n  <!--Leaf Controls-->\n  <div style=\"margin-left:10px;\">\n  <form *ngIf=\"rootNode.question.controlType === 0\" [formGroup]=\"parentGroup\">\n    <div *ngIf=\"rootNode.control.value\">\n    <div class=\"question-answer\">\n      <label *ngIf=\"rootNode.question.label\" [attr.for]=\"rootNode.question.key\" style=\"font-weight:400;\">\n          {{ rootNode.question.label }}\n      </label>\n      <span *ngIf=\"checkForColon(rootNode.question.label)\">:</span>\n      <div [ngSwitch]=\"rootNode.question.renderingType\" style=\"display:inline-block; font-weight:bold;\">\n          <div *ngSwitchCase=\" 'file' \">\n            <file-preview [formControlName]=\"rootNode.question.key\" [id]=\"rootNode.question.key + 'id'\" [dataSource]=\"fileDataSource\"></file-preview>\n          </div>\n          <div *ngSwitchCase=\"'remote-select'\">\n            <remote-answer [formControlName]=\"rootNode.question.key\" [id]=\"rootNode.question.key + 'id'\" [dataSource]=\"remoteDataSource\"></remote-answer>\n          </div>\n          <div *ngSwitchDefault style=\"display:inline-block\">\n              <question-control [schema]=\"_schema\" [value]=\"rootNode.control.value\" [dataSource]=\"customDataSource\"></question-control>\n            </div>\n      </div>\n     \n    </div>\n    </div>\n  </form>\n</div>\n\n  <!--Array Controls-->\n  <div *ngIf=\"rootNode.question.controlType === 1 && questionsAnswered(rootNode)\">\n    <div [ngSwitch]=\"rootNode.question.renderingType\">\n      <div *ngSwitchCase=\" 'repeating' \">\n        <div [ngSwitch]=\"rootNode.question.extras.type\">\n          <div *ngSwitchCase=\"'testOrder'\">\n            <label>{{rootNode.question.label}}:</label>\n            <div *ngFor=\"let child of rootNode.children; let i=index \">\n              <encounter-viewer *ngFor=\"let question of child.question.questions \" [parentComponent]=\"this\" [node]=\"child.children[question.key]\n                \" [parentGroup]=\"child.control \" [schema]=\"_schema\"></encounter-viewer>\n            </div>\n          </div>\n          \n          <div *ngSwitchCase=\"'obsGroup'\">\n            <div *ngFor=\"let child of rootNode.children; let i=index \">\n              <encounter-viewer *ngFor=\"let question of child.question.questions \" [parentComponent]=\"this\" [node]=\"child.children[question.key]\n                \" [parentGroup]=\"child.control \" [schema]=\"_schema\"></encounter-viewer>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div *ngIf=\"rootNode.question.controlType === 2\">\n\n    <!--GROUP-->\n    <div [ngSwitch]=\"rootNode.question.renderingType \">\n      <div *ngSwitchCase=\" 'group' \">\n        <encounter-viewer *ngFor=\"let question of rootNode.question.questions \" [parentComponent]=\"this\" [node]=\"rootNode.children[question.key]\n                  \" [parentGroup]=\"rootNode.control \" [schema]=\"_schema\"></encounter-viewer>\n      </div>\n      <div *ngSwitchCase=\" 'field-set' \">\n        <encounter-viewer *ngFor=\"let question of rootNode.question.questions \" [parentComponent]=\"this\" [node]=\"rootNode.children[question.key]\n                  \" [parentGroup]=\"rootNode.control \" [schema]=\"_schema\"></encounter-viewer>\n      </div>\n    </div>\n  </div>\n\n\n\n  </div>\n",
                    styles: [".page-label{font-size:20px;font-weight:700}.section-label{font-size:18px;font-weight:500}.panel-primary{border:none!important}.question-answer{font-size:16px}.panel{margin-bottom:5px}div.section{margin-bottom:15px!important}.line-breaker{white-space:pre-line}hr{margin:10px}"],
                },] },
    ];
    EncounterViewerComponent.ctorParameters = function () { return [
        { type: EncounterViewerService },
        { type: DataSources }
    ]; };
    EncounterViewerComponent.propDecorators = {
        parentGroup: [{ type: Input }],
        parentComponent: [{ type: Input }],
        node: [{ type: Input }],
        schema: [{ type: Input }],
        encounter: [{ type: Input }],
        form: [{ type: Input }]
    };
    return EncounterViewerComponent;
}());
export { EncounterViewerComponent };
if (false) {
    /** @type {?} */
    EncounterViewerComponent.prototype.rootNode;
    /** @type {?} */
    EncounterViewerComponent.prototype.enc;
    /** @type {?} */
    EncounterViewerComponent.prototype.fileDataSource;
    /** @type {?} */
    EncounterViewerComponent.prototype.remoteDataSource;
    /** @type {?} */
    EncounterViewerComponent.prototype.customDataSource;
    /** @type {?} */
    EncounterViewerComponent.prototype._schema;
    /** @type {?} */
    EncounterViewerComponent.prototype.parentGroup;
    /** @type {?} */
    EncounterViewerComponent.prototype.parentComponent;
    /**
     * @type {?}
     * @private
     */
    EncounterViewerComponent.prototype.encounterViewerService;
    /**
     * @type {?}
     * @private
     */
    EncounterViewerComponent.prototype.dataSources;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb3VudGVyLXZpZXdlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtb3Blbm1ycy1mb3JtZW50cnkvIiwic291cmNlcyI6WyJlbmNvdW50ZXItdmlld2VyL2VuY291bnRlci12aWV3L2VuY291bnRlci12aWV3ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDakUsT0FBTyxFQUFFLFFBQVEsRUFBdUIsTUFBTSx5Q0FBeUMsQ0FBQztBQUl4RixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sa0RBQWtELENBQUM7QUFDaEYsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBR3pFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRXJFO0lBa0lJLGtDQUNZLHNCQUE4QyxFQUM5QyxXQUF3QjtRQUR4QiwyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1FBQzlDLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBQUcsQ0FBQztJQW5CeEMsc0JBQWEsMENBQUk7Ozs7O1FBQWpCLFVBQWtCLFFBQWtCO1lBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQzdCLENBQUM7OztPQUFBO0lBRUQsc0JBQW9CLDRDQUFNOzs7OztRQUExQixVQUEyQixNQUFXO1lBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQzFCLENBQUM7OztPQUFBO0lBRUQsc0JBQW9CLCtDQUFTOzs7OztRQUE3QixVQUE4QixHQUFRO1lBQ2xDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ25CLENBQUM7OztPQUFBO0lBQ0Esc0JBQWEsMENBQUk7Ozs7O1FBQWpCLFVBQWtCLElBQVM7WUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQzlC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Ozs7Ozs7UUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDOztJQUNwQixDQUFDOztnQkE3TkosU0FBUyxTQUFDO29CQUNQLFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLFFBQVEsRUFBRSx1dUpBbUdiO29CQUNHLE1BQU0sRUFBRSxDQUFDLG9SQUFvUixDQUFDO2lCQUNqUzs7O2dCQXpHUSxzQkFBc0I7Z0JBSHRCLFdBQVc7Ozs4QkFvSGYsS0FBSztrQ0FDTCxLQUFLO3VCQUNMLEtBQUs7eUJBSUwsS0FBSzs0QkFJTCxLQUFLO3VCQUdKLEtBQUs7O0lBbUdYLCtCQUFDO0NBQUEsQUEvTkQsSUErTkM7U0F2SFksd0JBQXdCOzs7SUFDakMsNENBQTBCOztJQUMxQix1Q0FBZ0I7O0lBQ2hCLGtEQUFrQzs7SUFDbEMsb0RBQW9DOztJQUNwQyxvREFBb0M7O0lBQ3BDLDJDQUFlOztJQUNmLCtDQUEwQzs7SUFDMUMsbURBQTBEOzs7OztJQW1CdEQsMERBQXNEOzs7OztJQUN0RCwrQ0FBZ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTm9kZUJhc2UsIEdyb3VwTm9kZSwgTGVhZk5vZGUgfSBmcm9tICcuLi8uLi9mb3JtLWVudHJ5L2Zvcm0tZmFjdG9yeS9mb3JtLW5vZGUnO1xuaW1wb3J0IHsgUXVlc3Rpb25CYXNlIH0gZnJvbSAnLi4vLi4vZm9ybS1lbnRyeS9xdWVzdGlvbi1tb2RlbHMvcXVlc3Rpb24tYmFzZSc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7IEFmZUZvcm1Hcm91cCB9IGZyb20gJy4uLy4uL2Fic3RyYWN0LWNvbnRyb2xzLWV4dGVuc2lvbi9hZmUtZm9ybS1ncm91cCc7XG5pbXBvcnQgeyBEYXRhU291cmNlcyB9IGZyb20gJy4uLy4uL2Zvcm0tZW50cnkvZGF0YS1zb3VyY2VzL2RhdGEtc291cmNlcyc7XG5pbXBvcnQgeyBEYXRhU291cmNlIH0gZnJvbSAnLi4vLi4vZm9ybS1lbnRyeS9xdWVzdGlvbi1tb2RlbHMvaW50ZXJmYWNlcy9kYXRhLXNvdXJjZSc7XG5cbmltcG9ydCB7IEVuY291bnRlclZpZXdlclNlcnZpY2UgfSBmcm9tICcuLi9lbmNvdW50ZXItdmlld2VyLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2VuY291bnRlci12aWV3ZXInLFxuICAgIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cInZpZXdlclwiPlxuXG4gIDxkaXYgKm5nSWY9XCJyb290Tm9kZS5xdWVzdGlvbi5yZW5kZXJpbmdUeXBlID09PSAnZm9ybSdcIiBjbGFzcz1cImZvcm1cIj5cbiAgICA8ZGl2ICpuZ0Zvcj1cImxldCBxdWVzdGlvbiBvZiByb290Tm9kZS5xdWVzdGlvbi5xdWVzdGlvbnM7IGxldCBpID0gaW5kZXg7XCI+XG4gICAgICA8ZGl2ICpuZ0lmPVwicXVlc3Rpb25zQW5zd2VyZWQocm9vdE5vZGUuY2hpbGRyZW5bcXVlc3Rpb24ua2V5XSlcIj5cbiAgICAgICAgPGRpdiBbYXR0ci5pZF09XCIncGFnZScraVwiIGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPlxuICAgICAgICAgIDxwIGNsYXNzPVwicGFnZS1sYWJlbCBwYW5lbC1oZWFkaW5nIHRleHQtcHJpbWFyeVwiPnt7cXVlc3Rpb24ubGFiZWx9fTwvcD5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxuICAgICAgICAgICAgPGVuY291bnRlci12aWV3ZXIgW25vZGVdPVwicm9vdE5vZGUuY2hpbGRyZW5bcXVlc3Rpb24ua2V5XVwiIFtzY2hlbWFdPVwiX3NjaGVtYVwiIFtwYXJlbnRDb21wb25lbnRdPVwidGhpc1wiIFtwYXJlbnRHcm91cF09XCJyb290Tm9kZS5jb250cm9sXCI+PC9lbmNvdW50ZXItdmlld2VyPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cblxuICA8ZGl2ICpuZ0lmPVwicm9vdE5vZGUucXVlc3Rpb24ucmVuZGVyaW5nVHlwZSA9PT0gJ3BhZ2UnXCIgY2xhc3M9XCJwYWdlXCI+XG4gICAgPGVuY291bnRlci12aWV3ZXIgKm5nRm9yPVwibGV0IHF1ZXN0aW9uIG9mIHJvb3ROb2RlLnF1ZXN0aW9uLnF1ZXN0aW9uc1wiIFtwYXJlbnRDb21wb25lbnRdPVwidGhpc1wiIFtub2RlXT1cInJvb3ROb2RlLmNoaWxkcmVuW3F1ZXN0aW9uLmtleV1cIlxuICAgICAgW3NjaGVtYV09XCJfc2NoZW1hXCIgW3BhcmVudEdyb3VwXT1cInBhcmVudEdyb3VwXCI+PC9lbmNvdW50ZXItdmlld2VyPlxuICA8L2Rpdj5cblxuXG4gIDxkaXYgKm5nSWY9XCJyb290Tm9kZS5xdWVzdGlvbi5yZW5kZXJpbmdUeXBlID09PSAnc2VjdGlvbicmJiBxdWVzdGlvbnNBbnN3ZXJlZChyb290Tm9kZSlcIlxuICAgIGNsYXNzPVwic2VjdGlvblwiPlxuICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1wcmltYXJ5XCI+XG4gICAgICA8cCBjbGFzcz1cInBhbmVsLWhlYWRpbmcgc2VjdGlvbi1sYWJlbFwiPnt7IHJvb3ROb2RlLnF1ZXN0aW9uLmxhYmVsIH19PC9wPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgKm5nRm9yPVwibGV0IHF1ZXN0aW9uIG9mIHJvb3ROb2RlLnF1ZXN0aW9uLnF1ZXN0aW9uc1wiPlxuICAgICAgPGVuY291bnRlci12aWV3ZXIgW25vZGVdPVwicm9vdE5vZGUuY2hpbGRyZW5bcXVlc3Rpb24ua2V5XVwiIFtwYXJlbnRDb21wb25lbnRdPVwidGhpc1wiIFtzY2hlbWFdPVwiX3NjaGVtYVwiIFtwYXJlbnRHcm91cF09XCJwYXJlbnRHcm91cFwiPjwvZW5jb3VudGVyLXZpZXdlcj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5cbiAgPCEtLUxlYWYgQ29udHJvbHMtLT5cbiAgPGRpdiBzdHlsZT1cIm1hcmdpbi1sZWZ0OjEwcHg7XCI+XG4gIDxmb3JtICpuZ0lmPVwicm9vdE5vZGUucXVlc3Rpb24uY29udHJvbFR5cGUgPT09IDBcIiBbZm9ybUdyb3VwXT1cInBhcmVudEdyb3VwXCI+XG4gICAgPGRpdiAqbmdJZj1cInJvb3ROb2RlLmNvbnRyb2wudmFsdWVcIj5cbiAgICA8ZGl2IGNsYXNzPVwicXVlc3Rpb24tYW5zd2VyXCI+XG4gICAgICA8bGFiZWwgKm5nSWY9XCJyb290Tm9kZS5xdWVzdGlvbi5sYWJlbFwiIFthdHRyLmZvcl09XCJyb290Tm9kZS5xdWVzdGlvbi5rZXlcIiBzdHlsZT1cImZvbnQtd2VpZ2h0OjQwMDtcIj5cbiAgICAgICAgICB7eyByb290Tm9kZS5xdWVzdGlvbi5sYWJlbCB9fVxuICAgICAgPC9sYWJlbD5cbiAgICAgIDxzcGFuICpuZ0lmPVwiY2hlY2tGb3JDb2xvbihyb290Tm9kZS5xdWVzdGlvbi5sYWJlbClcIj46PC9zcGFuPlxuICAgICAgPGRpdiBbbmdTd2l0Y2hdPVwicm9vdE5vZGUucXVlc3Rpb24ucmVuZGVyaW5nVHlwZVwiIHN0eWxlPVwiZGlzcGxheTppbmxpbmUtYmxvY2s7IGZvbnQtd2VpZ2h0OmJvbGQ7XCI+XG4gICAgICAgICAgPGRpdiAqbmdTd2l0Y2hDYXNlPVwiICdmaWxlJyBcIj5cbiAgICAgICAgICAgIDxmaWxlLXByZXZpZXcgW2Zvcm1Db250cm9sTmFtZV09XCJyb290Tm9kZS5xdWVzdGlvbi5rZXlcIiBbaWRdPVwicm9vdE5vZGUucXVlc3Rpb24ua2V5ICsgJ2lkJ1wiIFtkYXRhU291cmNlXT1cImZpbGVEYXRhU291cmNlXCI+PC9maWxlLXByZXZpZXc+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiAqbmdTd2l0Y2hDYXNlPVwiJ3JlbW90ZS1zZWxlY3QnXCI+XG4gICAgICAgICAgICA8cmVtb3RlLWFuc3dlciBbZm9ybUNvbnRyb2xOYW1lXT1cInJvb3ROb2RlLnF1ZXN0aW9uLmtleVwiIFtpZF09XCJyb290Tm9kZS5xdWVzdGlvbi5rZXkgKyAnaWQnXCIgW2RhdGFTb3VyY2VdPVwicmVtb3RlRGF0YVNvdXJjZVwiPjwvcmVtb3RlLWFuc3dlcj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2ICpuZ1N3aXRjaERlZmF1bHQgc3R5bGU9XCJkaXNwbGF5OmlubGluZS1ibG9ja1wiPlxuICAgICAgICAgICAgICA8cXVlc3Rpb24tY29udHJvbCBbc2NoZW1hXT1cIl9zY2hlbWFcIiBbdmFsdWVdPVwicm9vdE5vZGUuY29udHJvbC52YWx1ZVwiIFtkYXRhU291cmNlXT1cImN1c3RvbURhdGFTb3VyY2VcIj48L3F1ZXN0aW9uLWNvbnRyb2w+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICBcbiAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9mb3JtPlxuPC9kaXY+XG5cbiAgPCEtLUFycmF5IENvbnRyb2xzLS0+XG4gIDxkaXYgKm5nSWY9XCJyb290Tm9kZS5xdWVzdGlvbi5jb250cm9sVHlwZSA9PT0gMSAmJiBxdWVzdGlvbnNBbnN3ZXJlZChyb290Tm9kZSlcIj5cbiAgICA8ZGl2IFtuZ1N3aXRjaF09XCJyb290Tm9kZS5xdWVzdGlvbi5yZW5kZXJpbmdUeXBlXCI+XG4gICAgICA8ZGl2ICpuZ1N3aXRjaENhc2U9XCIgJ3JlcGVhdGluZycgXCI+XG4gICAgICAgIDxkaXYgW25nU3dpdGNoXT1cInJvb3ROb2RlLnF1ZXN0aW9uLmV4dHJhcy50eXBlXCI+XG4gICAgICAgICAgPGRpdiAqbmdTd2l0Y2hDYXNlPVwiJ3Rlc3RPcmRlcidcIj5cbiAgICAgICAgICAgIDxsYWJlbD57e3Jvb3ROb2RlLnF1ZXN0aW9uLmxhYmVsfX06PC9sYWJlbD5cbiAgICAgICAgICAgIDxkaXYgKm5nRm9yPVwibGV0IGNoaWxkIG9mIHJvb3ROb2RlLmNoaWxkcmVuOyBsZXQgaT1pbmRleCBcIj5cbiAgICAgICAgICAgICAgPGVuY291bnRlci12aWV3ZXIgKm5nRm9yPVwibGV0IHF1ZXN0aW9uIG9mIGNoaWxkLnF1ZXN0aW9uLnF1ZXN0aW9ucyBcIiBbcGFyZW50Q29tcG9uZW50XT1cInRoaXNcIiBbbm9kZV09XCJjaGlsZC5jaGlsZHJlbltxdWVzdGlvbi5rZXldXG4gICAgICAgICAgICAgICAgXCIgW3BhcmVudEdyb3VwXT1cImNoaWxkLmNvbnRyb2wgXCIgW3NjaGVtYV09XCJfc2NoZW1hXCI+PC9lbmNvdW50ZXItdmlld2VyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgXG4gICAgICAgICAgPGRpdiAqbmdTd2l0Y2hDYXNlPVwiJ29ic0dyb3VwJ1wiPlxuICAgICAgICAgICAgPGRpdiAqbmdGb3I9XCJsZXQgY2hpbGQgb2Ygcm9vdE5vZGUuY2hpbGRyZW47IGxldCBpPWluZGV4IFwiPlxuICAgICAgICAgICAgICA8ZW5jb3VudGVyLXZpZXdlciAqbmdGb3I9XCJsZXQgcXVlc3Rpb24gb2YgY2hpbGQucXVlc3Rpb24ucXVlc3Rpb25zIFwiIFtwYXJlbnRDb21wb25lbnRdPVwidGhpc1wiIFtub2RlXT1cImNoaWxkLmNoaWxkcmVuW3F1ZXN0aW9uLmtleV1cbiAgICAgICAgICAgICAgICBcIiBbcGFyZW50R3JvdXBdPVwiY2hpbGQuY29udHJvbCBcIiBbc2NoZW1hXT1cIl9zY2hlbWFcIj48L2VuY291bnRlci12aWV3ZXI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5cbiAgPGRpdiAqbmdJZj1cInJvb3ROb2RlLnF1ZXN0aW9uLmNvbnRyb2xUeXBlID09PSAyXCI+XG5cbiAgICA8IS0tR1JPVVAtLT5cbiAgICA8ZGl2IFtuZ1N3aXRjaF09XCJyb290Tm9kZS5xdWVzdGlvbi5yZW5kZXJpbmdUeXBlIFwiPlxuICAgICAgPGRpdiAqbmdTd2l0Y2hDYXNlPVwiICdncm91cCcgXCI+XG4gICAgICAgIDxlbmNvdW50ZXItdmlld2VyICpuZ0Zvcj1cImxldCBxdWVzdGlvbiBvZiByb290Tm9kZS5xdWVzdGlvbi5xdWVzdGlvbnMgXCIgW3BhcmVudENvbXBvbmVudF09XCJ0aGlzXCIgW25vZGVdPVwicm9vdE5vZGUuY2hpbGRyZW5bcXVlc3Rpb24ua2V5XVxuICAgICAgICAgICAgICAgICAgXCIgW3BhcmVudEdyb3VwXT1cInJvb3ROb2RlLmNvbnRyb2wgXCIgW3NjaGVtYV09XCJfc2NoZW1hXCI+PC9lbmNvdW50ZXItdmlld2VyPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2ICpuZ1N3aXRjaENhc2U9XCIgJ2ZpZWxkLXNldCcgXCI+XG4gICAgICAgIDxlbmNvdW50ZXItdmlld2VyICpuZ0Zvcj1cImxldCBxdWVzdGlvbiBvZiByb290Tm9kZS5xdWVzdGlvbi5xdWVzdGlvbnMgXCIgW3BhcmVudENvbXBvbmVudF09XCJ0aGlzXCIgW25vZGVdPVwicm9vdE5vZGUuY2hpbGRyZW5bcXVlc3Rpb24ua2V5XVxuICAgICAgICAgICAgICAgICAgXCIgW3BhcmVudEdyb3VwXT1cInJvb3ROb2RlLmNvbnRyb2wgXCIgW3NjaGVtYV09XCJfc2NoZW1hXCI+PC9lbmNvdW50ZXItdmlld2VyPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuXG5cblxuICA8L2Rpdj5cbmAsXG4gICAgc3R5bGVzOiBbYC5wYWdlLWxhYmVse2ZvbnQtc2l6ZToyMHB4O2ZvbnQtd2VpZ2h0OjcwMH0uc2VjdGlvbi1sYWJlbHtmb250LXNpemU6MThweDtmb250LXdlaWdodDo1MDB9LnBhbmVsLXByaW1hcnl7Ym9yZGVyOm5vbmUhaW1wb3J0YW50fS5xdWVzdGlvbi1hbnN3ZXJ7Zm9udC1zaXplOjE2cHh9LnBhbmVse21hcmdpbi1ib3R0b206NXB4fWRpdi5zZWN0aW9ue21hcmdpbi1ib3R0b206MTVweCFpbXBvcnRhbnR9LmxpbmUtYnJlYWtlcnt3aGl0ZS1zcGFjZTpwcmUtbGluZX1ocnttYXJnaW46MTBweH1gXSxcbn0pXG5leHBvcnQgY2xhc3MgRW5jb3VudGVyVmlld2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBwdWJsaWMgcm9vdE5vZGU6IE5vZGVCYXNlO1xuICAgIHB1YmxpYyBlbmM6IGFueTtcbiAgICBwdWJsaWMgZmlsZURhdGFTb3VyY2U6IERhdGFTb3VyY2U7XG4gICAgcHVibGljIHJlbW90ZURhdGFTb3VyY2U6IERhdGFTb3VyY2U7XG4gICAgcHVibGljIGN1c3RvbURhdGFTb3VyY2U6IERhdGFTb3VyY2U7XG4gICAgcHVibGljIF9zY2hlbWE7XG4gICAgQElucHV0KCkgcHVibGljIHBhcmVudEdyb3VwOiBBZmVGb3JtR3JvdXA7XG4gICAgQElucHV0KCkgcHVibGljIHBhcmVudENvbXBvbmVudDogRW5jb3VudGVyVmlld2VyQ29tcG9uZW50O1xuICAgIEBJbnB1dCgpIHNldCBub2RlKHJvb3ROb2RlOiBOb2RlQmFzZSkge1xuICAgICAgICB0aGlzLnJvb3ROb2RlID0gcm9vdE5vZGU7XG4gICAgfVxuXG4gICAgQElucHV0KCkgcHVibGljIHNldCBzY2hlbWEoc2NoZW1hOiBhbnkpIHtcbiAgICAgICAgdGhpcy5fc2NoZW1hID0gc2NoZW1hO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIHB1YmxpYyBzZXQgZW5jb3VudGVyKGVuYzogYW55KSB7XG4gICAgICAgIHRoaXMuZW5jID0gZW5jO1xuICAgIH1cbiAgICAgQElucHV0KCkgc2V0IGZvcm0oZm9ybTogYW55KSB7XG4gICAgICAgICB0aGlzLnJvb3ROb2RlID0gZm9ybS5yb290Tm9kZTtcbiAgICAgICAgIHRoaXMuX3NjaGVtYSA9IGZvcm0uc2NoZW1hO1xuICAgICAgICAgY29uc29sZS5sb2codGhpcy5nZXRRdWVzdGlvbk5vZGVzKHRoaXMudHJhdmVyc2UodGhpcy5yb290Tm9kZSkpKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBlbmNvdW50ZXJWaWV3ZXJTZXJ2aWNlOiBFbmNvdW50ZXJWaWV3ZXJTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIGRhdGFTb3VyY2VzOiBEYXRhU291cmNlcykge31cbiAgICBcbiAgICBnZXRRdWVzdGlvbk5vZGVzKHBhZ2VzKSB7XG4gICAgICAgIGNvbnN0IG1lcmdlZCA9IFtdO1xuICAgICAgICBjb25zdCBhcnJheXMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBwYWdlIG9mIHBhZ2VzKSB7XG4gICAgICAgICAgICBhcnJheXMucHVzaChwYWdlLnBhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXJnZWQuY29uY2F0LmFwcGx5KFtdLCBhcnJheXMpO1xuICAgIH1cbiAgICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgICAgIGlmKHRoaXMucm9vdE5vZGUpe1xuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucm9vdE5vZGUgJiYgdGhpcy5yb290Tm9kZS5xdWVzdGlvbi5leHRyYXNcbiAgICAgICAgICAgICYmIHRoaXMucm9vdE5vZGUucXVlc3Rpb24ucmVuZGVyaW5nVHlwZSA9PT0gJ2ZpbGUnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWxlRGF0YVNvdXJjZSA9XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhU291cmNlcy5kYXRhU291cmNlc1t0aGlzLnJvb3ROb2RlLnF1ZXN0aW9uLmRhdGFTb3VyY2VdO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucm9vdE5vZGUgJiYgdGhpcy5yb290Tm9kZS5xdWVzdGlvbi5leHRyYXNcbiAgICAgICAgICAgICYmIHRoaXMucm9vdE5vZGUucXVlc3Rpb24ucmVuZGVyaW5nVHlwZSA9PT0gJ3JlbW90ZS1zZWxlY3QnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdGVEYXRhU291cmNlID1cbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFTb3VyY2VzLmRhdGFTb3VyY2VzW3RoaXMucm9vdE5vZGUucXVlc3Rpb24uZGF0YVNvdXJjZV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VzdG9tRGF0YVNvdXJjZSA9IHRoaXMuZW5jb3VudGVyVmlld2VyU2VydmljZTtcbiAgICAgICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcXVlc3Rpb25zQW5zd2VyZWQobm9kZTogYW55KSB7XG4gICAgICAgIGNvbnN0ICRhbnN3ZXJlZCA9IHRoaXMuZW5jb3VudGVyVmlld2VyU2VydmljZS5xdWVzdGlvbnNBbnN3ZXJlZChub2RlKTtcbiAgICAgICAgcmV0dXJuICRhbnN3ZXJlZDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcXVlc3Rpb25BbnN3ZXJlZChub2RlOiBOb2RlQmFzZSkge1xuICAgICAgICBjb25zdCBhbnN3ZXJlZCA9IHRoaXMuZW5jb3VudGVyVmlld2VyU2VydmljZS5oYXNBbnN3ZXIobm9kZSk7XG4gICAgICAgIHJldHVybiBhbnN3ZXJlZDtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2hlY2tGb3JDb2xvbihxdWVzdGlvbkxhYmVsOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHF1ZXN0aW9uTGFiZWwuaW5kZXhPZignOicpID09PSAtMSkgeyByZXR1cm4gdHJ1ZTsgfSBlbHNlIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfVxuXG4gICAgdHJhdmVyc2UobywgdHlwZT8pIHtcbiAgICAgICAgY29uc3QgcXVlc3Rpb25zID0gW107XG4gICAgICAgIGlmIChvLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBpZiAoby5jaGlsZHJlbiBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmV0dXJuZWQgPSB0aGlzLnJlcGVhdGluZ0dyb3VwKG8uY2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXR1cm5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvLmNoaWxkcmVuIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gby5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoby5jaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKG8uY2hpbGRyZW5ba2V5XS5xdWVzdGlvbi5yZW5kZXJpbmdUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncGFnZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhZ2UgPSB0aGlzLnRyYXZlcnNlKG8uY2hpbGRyZW5ba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9ucy5wdXNoKHsgcGFnZTogcGFnZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnc2VjdGlvbic6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlY3Rpb24gPSB0aGlzLnRyYXZlcnNlKG8uY2hpbGRyZW5ba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9ucy5wdXNoKHsgc2VjdGlvbjogc2VjdGlvbiB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZ3JvdXAnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBxcyA9IHRoaXMudHJhdmVyc2Uoby5jaGlsZHJlbltrZXldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb25zLnB1c2goeyBub2RlOiBvLmNoaWxkcmVuW2tleV0sIHF1ZXN0aW9uOiBvLmNoaWxkcmVuW2tleV0ucXVlc3Rpb24sIGdyb3VwTWVtYmVyczogcXMgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3JlcGVhdGluZyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlcCA9IHRoaXMucmVwZWF0aW5nR3JvdXAoby5jaGlsZHJlbltrZXldLmNoaWxkcmVuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb25zLnB1c2goeyBub2RlOiBvLmNoaWxkcmVuW2tleV0sIHF1ZXN0aW9uOiBvLmNoaWxkcmVuW2tleV0ucXVlc3Rpb24sIGdyb3VwTWVtYmVyczogcmVwIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbnMucHVzaChvLmNoaWxkcmVuW2tleV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NvbnNvbGUubG9nJyxvKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBxdWVzdGlvbnM7XG4gICAgfVxuXG4gICAgcmVwZWF0aW5nR3JvdXAobm9kZXMpIHtcbiAgICAgICAgY29uc3QgdG9SZXR1cm4gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIG5vZGVzKSB7XG4gICAgICAgICAgICB0b1JldHVybi5wdXNoKHsgcXVlc3Rpb246IG5vZGUucXVlc3Rpb24sIGdyb3VwTWVtYmVyczogdGhpcy50cmF2ZXJzZShub2RlKSB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgfVxuXG59XG4iXX0=