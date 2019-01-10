/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
            console.log(this.rootNode);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    EncounterViewerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
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
    EncounterViewerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'encounter-viewer',
                    template: "<div class=\"viewer\">\n\n  <div *ngIf=\"rootNode.question.renderingType === 'form'\" class=\"form\">\n    <div *ngFor=\"let question of rootNode.question.questions; let i = index;\">\n      <div *ngIf=\"questionsAnswered(rootNode.children[question.key])\">\n        <div [attr.id]=\"'page'+i\" class=\"panel panel-default\">\n          <p class=\"page-label panel-heading text-primary\">{{question.label}}</p>\n          <div class=\"panel-body\">\n            <encounter-viewer [node]=\"rootNode.children[question.key]\" [schema]=\"_schema\" [parentComponent]=\"this\" [parentGroup]=\"rootNode.control\"></encounter-viewer>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div *ngIf=\"rootNode.question.renderingType === 'page'\" class=\"page\">\n    <encounter-viewer *ngFor=\"let question of rootNode.question.questions\" [parentComponent]=\"this\" [node]=\"rootNode.children[question.key]\"\n      [schema]=\"_schema\" [parentGroup]=\"parentGroup\"></encounter-viewer>\n  </div>\n\n\n  <div *ngIf=\"rootNode.question.renderingType === 'section'&& questionsAnswered(rootNode)\"\n    class=\"section\">\n    <div class=\"panel panel-primary\">\n      <p class=\"panel-heading section-label\">{{ rootNode.question.label }}</p>\n    </div>\n    <div *ngFor=\"let question of rootNode.question.questions\">\n      <encounter-viewer [node]=\"rootNode.children[question.key]\" [parentComponent]=\"this\" [schema]=\"_schema\" [parentGroup]=\"parentGroup\"></encounter-viewer>\n    </div>\n  </div>\n\n  <!--Leaf Controls-->\n  <div style=\"margin-left:10px;\">\n  <form *ngIf=\"rootNode.question.controlType === 0\" [formGroup]=\"parentGroup\">\n    <div *ngIf=\"rootNode.control.value\">\n    <div class=\"question-answer\">\n      <label *ngIf=\"rootNode.question.label\" [attr.for]=\"rootNode.question.key\" style=\"font-weight:400;\">\n          {{ rootNode.question.label }}\n      </label>\n      <span *ngIf=\"checkForColon(rootNode.question.label)\">:</span>\n      <div [ngSwitch]=\"rootNode.question.renderingType\" style=\"display:inline-block; font-weight:bold;\">\n          <div *ngSwitchCase=\" 'file' \">\n            <file-preview [formControlName]=\"rootNode.question.key\" [id]=\"rootNode.question.key + 'id'\" [dataSource]=\"fileDataSource\"></file-preview>\n          </div>\n          <div *ngSwitchCase=\"'remote-select'\">\n            <remote-answer [formControlName]=\"rootNode.question.key\" [id]=\"rootNode.question.key + 'id'\" [dataSource]=\"remoteDataSource\"></remote-answer>\n          </div>\n          <div *ngSwitchDefault style=\"display:inline-block\">\n              <question-control [schema]=\"_schema\" [value]=\"rootNode.control.value\" [dataSource]=\"customDataSource\"></question-control>\n            </div>\n      </div>\n     \n    </div>\n    </div>\n  </form>\n</div>\n\n  <!--Array Controls-->\n  <div *ngIf=\"rootNode.question.controlType === 1 && questionsAnswered(rootNode)\">\n    <div [ngSwitch]=\"rootNode.question.renderingType\">\n      <div *ngSwitchCase=\" 'repeating' \">\n        <div [ngSwitch]=\"rootNode.question.extras.type\">\n          <div *ngSwitchCase=\"'testOrder'\">\n            <label>{{rootNode.question.label}}:</label>\n            <div *ngFor=\"let child of rootNode.children; let i=index \">\n              <encounter-viewer *ngFor=\"let question of child.question.questions \" [parentComponent]=\"this\" [node]=\"child.children[question.key]\n                \" [parentGroup]=\"child.control \" [schema]=\"_schema\"></encounter-viewer>\n            </div>\n          </div>\n          \n          <div *ngSwitchCase=\"'obsGroup'\">\n            <div *ngFor=\"let child of rootNode.children; let i=index \">\n              <encounter-viewer *ngFor=\"let question of child.question.questions \" [parentComponent]=\"this\" [node]=\"child.children[question.key]\n                \" [parentGroup]=\"child.control \" [schema]=\"_schema\"></encounter-viewer>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div *ngIf=\"rootNode.question.controlType === 2\">\n\n    <!--GROUP-->\n    <div [ngSwitch]=\"rootNode.question.renderingType \">\n      <div *ngSwitchCase=\" 'group' \">\n        <encounter-viewer *ngFor=\"let question of rootNode.question.questions \" [parentComponent]=\"this\" [node]=\"rootNode.children[question.key]\n                  \" [parentGroup]=\"rootNode.control \" [schema]=\"_schema\"></encounter-viewer>\n      </div>\n      <div *ngSwitchCase=\" 'field-set' \">\n        <encounter-viewer *ngFor=\"let question of rootNode.question.questions \" [parentComponent]=\"this\" [node]=\"rootNode.children[question.key]\n                  \" [parentGroup]=\"rootNode.control \" [schema]=\"_schema\"></encounter-viewer>\n      </div>\n    </div>\n  </div>\n\n\n\n  </div>\n",
                    styles: [".page-label{font-size:20px;font-weight:700}.section-label{font-size:18px;font-weight:500}.panel-primary{border:none!important}.question-answer{font-size:16px}.panel{margin-bottom:5px}div.section{margin-bottom:15px!important}.line-breaker{white-space:pre-line}hr{margin:10px}"]
                }] }
    ];
    /** @nocollapse */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb3VudGVyLXZpZXdlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtb3Blbm1ycy1mb3JtZW50cnkvIiwic291cmNlcyI6WyJlbmNvdW50ZXItdmlld2VyL2VuY291bnRlci12aWV3L2VuY291bnRlci12aWV3ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUNqRSxPQUFPLEVBQUUsUUFBUSxFQUF1QixNQUFNLHlDQUF5QyxDQUFDO0FBSXhGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUNoRixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFHekUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFckU7SUErQkksa0NBQW9CLHNCQUE4QyxFQUN0RCxXQUF3QjtRQURoQiwyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1FBQ3RELGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBQ3BDLENBQUM7SUFuQkQsc0JBQWEsMENBQUk7Ozs7O1FBQWpCLFVBQWtCLFFBQWtCO1lBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQzdCLENBQUM7OztPQUFBO0lBRUQsc0JBQW9CLDRDQUFNOzs7OztRQUExQixVQUEyQixNQUFXO1lBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQzFCLENBQUM7OztPQUFBO0lBRUQsc0JBQW9CLCtDQUFTOzs7OztRQUE3QixVQUE4QixHQUFRO1lBQ2xDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ25CLENBQUM7OztPQUFBO0lBQ0Esc0JBQWEsMENBQUk7Ozs7O1FBQWpCLFVBQWtCLElBQVM7WUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoQyxDQUFDOzs7T0FBQTs7OztJQU1NLDJDQUFROzs7SUFBZjtRQUNJLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNO2VBQzNDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGFBQWEsS0FBSyxNQUFNLEVBQUU7WUFDaEQsSUFBSSxDQUFDLGNBQWM7Z0JBQ25CLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3ZFO2FBQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU07ZUFDbEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsYUFBYSxLQUFLLGVBQWUsRUFBRTtZQUN6RCxJQUFJLENBQUMsZ0JBQWdCO2dCQUNyQixJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNuRTthQUFNO1lBQ0gsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztTQUN2RDtJQUNULENBQUM7Ozs7O0lBRU0sb0RBQWlCOzs7O0lBQXhCLFVBQXlCLElBQVM7O1lBQ3hCLFNBQVMsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDO1FBQ3JFLE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7Ozs7O0lBRU0sbURBQWdCOzs7O0lBQXZCLFVBQXdCLElBQWM7O1lBQzVCLFFBQVEsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztRQUM1RCxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDOzs7OztJQUVNLGdEQUFhOzs7O0lBQXBCLFVBQXFCLGFBQXFCO1FBQ3RDLElBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFDO1NBQUU7YUFBTTtZQUFFLE9BQU8sS0FBSyxDQUFDO1NBQUU7SUFDbEYsQ0FBQzs7Z0JBN0RKLFNBQVMsU0FBQztvQkFDUCxRQUFRLEVBQUUsa0JBQWtCO29CQUM1QixpdkpBQWdEOztpQkFFbkQ7Ozs7Z0JBTlEsc0JBQXNCO2dCQUh0QixXQUFXOzs7OEJBaUJmLEtBQUs7a0NBQ0wsS0FBSzt1QkFDTCxLQUFLO3lCQUlMLEtBQUs7NEJBSUwsS0FBSzt1QkFHSixLQUFLOztJQXFDWCwrQkFBQztDQUFBLEFBOURELElBOERDO1NBekRZLHdCQUF3Qjs7O0lBQ2pDLDRDQUEwQjs7SUFDMUIsdUNBQWdCOztJQUNoQixrREFBa0M7O0lBQ2xDLG9EQUFvQzs7SUFDcEMsb0RBQW9DOztJQUNwQywyQ0FBZTs7SUFDZiwrQ0FBMEM7O0lBQzFDLG1EQUEwRDs7Ozs7SUFrQjlDLDBEQUFzRDs7Ozs7SUFDOUQsK0NBQWdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5vZGVCYXNlLCBHcm91cE5vZGUsIExlYWZOb2RlIH0gZnJvbSAnLi4vLi4vZm9ybS1lbnRyeS9mb3JtLWZhY3RvcnkvZm9ybS1ub2RlJztcbmltcG9ydCB7IFF1ZXN0aW9uQmFzZSB9IGZyb20gJy4uLy4uL2Zvcm0tZW50cnkvcXVlc3Rpb24tbW9kZWxzL3F1ZXN0aW9uLWJhc2UnO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgeyBBZmVGb3JtR3JvdXAgfSBmcm9tICcuLi8uLi9hYnN0cmFjdC1jb250cm9scy1leHRlbnNpb24vYWZlLWZvcm0tZ3JvdXAnO1xuaW1wb3J0IHsgRGF0YVNvdXJjZXMgfSBmcm9tICcuLi8uLi9mb3JtLWVudHJ5L2RhdGEtc291cmNlcy9kYXRhLXNvdXJjZXMnO1xuaW1wb3J0IHsgRGF0YVNvdXJjZSB9IGZyb20gJy4uLy4uL2Zvcm0tZW50cnkvcXVlc3Rpb24tbW9kZWxzL2ludGVyZmFjZXMvZGF0YS1zb3VyY2UnO1xuXG5pbXBvcnQgeyBFbmNvdW50ZXJWaWV3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZW5jb3VudGVyLXZpZXdlci5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdlbmNvdW50ZXItdmlld2VyJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vZW5jb3VudGVyLXZpZXdlci5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vZW5jb3VudGVyLXZpZXdlci5jb21wb25lbnQuY3NzJ10sXG59KVxuZXhwb3J0IGNsYXNzIEVuY291bnRlclZpZXdlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgcHVibGljIHJvb3ROb2RlOiBOb2RlQmFzZTtcbiAgICBwdWJsaWMgZW5jOiBhbnk7XG4gICAgcHVibGljIGZpbGVEYXRhU291cmNlOiBEYXRhU291cmNlO1xuICAgIHB1YmxpYyByZW1vdGVEYXRhU291cmNlOiBEYXRhU291cmNlO1xuICAgIHB1YmxpYyBjdXN0b21EYXRhU291cmNlOiBEYXRhU291cmNlO1xuICAgIHB1YmxpYyBfc2NoZW1hO1xuICAgIEBJbnB1dCgpIHB1YmxpYyBwYXJlbnRHcm91cDogQWZlRm9ybUdyb3VwO1xuICAgIEBJbnB1dCgpIHB1YmxpYyBwYXJlbnRDb21wb25lbnQ6IEVuY291bnRlclZpZXdlckNvbXBvbmVudDtcbiAgICBASW5wdXQoKSBzZXQgbm9kZShyb290Tm9kZTogTm9kZUJhc2UpIHtcbiAgICAgICAgdGhpcy5yb290Tm9kZSA9IHJvb3ROb2RlO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIHB1YmxpYyBzZXQgc2NoZW1hKHNjaGVtYTogYW55KSB7XG4gICAgICAgIHRoaXMuX3NjaGVtYSA9IHNjaGVtYTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBwdWJsaWMgc2V0IGVuY291bnRlcihlbmM6IGFueSkge1xuICAgICAgICB0aGlzLmVuYyA9IGVuYztcbiAgICB9XG4gICAgIEBJbnB1dCgpIHNldCBmb3JtKGZvcm06IGFueSkge1xuICAgICAgICAgdGhpcy5yb290Tm9kZSA9IGZvcm0ucm9vdE5vZGU7XG4gICAgICAgICB0aGlzLl9zY2hlbWEgPSBmb3JtLnNjaGVtYTtcbiAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMucm9vdE5vZGUpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZW5jb3VudGVyVmlld2VyU2VydmljZTogRW5jb3VudGVyVmlld2VyU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBkYXRhU291cmNlczogRGF0YVNvdXJjZXMpIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLnJvb3ROb2RlICYmIHRoaXMucm9vdE5vZGUucXVlc3Rpb24uZXh0cmFzXG4gICAgICAgICAgICAmJiB0aGlzLnJvb3ROb2RlLnF1ZXN0aW9uLnJlbmRlcmluZ1R5cGUgPT09ICdmaWxlJykge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsZURhdGFTb3VyY2UgPVxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVNvdXJjZXMuZGF0YVNvdXJjZXNbdGhpcy5yb290Tm9kZS5xdWVzdGlvbi5kYXRhU291cmNlXTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJvb3ROb2RlICYmIHRoaXMucm9vdE5vZGUucXVlc3Rpb24uZXh0cmFzXG4gICAgICAgICAgICAmJiB0aGlzLnJvb3ROb2RlLnF1ZXN0aW9uLnJlbmRlcmluZ1R5cGUgPT09ICdyZW1vdGUtc2VsZWN0Jykge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3RlRGF0YVNvdXJjZSA9XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhU291cmNlcy5kYXRhU291cmNlc1t0aGlzLnJvb3ROb2RlLnF1ZXN0aW9uLmRhdGFTb3VyY2VdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1c3RvbURhdGFTb3VyY2UgPSB0aGlzLmVuY291bnRlclZpZXdlclNlcnZpY2U7XG4gICAgICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHF1ZXN0aW9uc0Fuc3dlcmVkKG5vZGU6IGFueSkge1xuICAgICAgICBjb25zdCAkYW5zd2VyZWQgPSB0aGlzLmVuY291bnRlclZpZXdlclNlcnZpY2UucXVlc3Rpb25zQW5zd2VyZWQobm9kZSk7XG4gICAgICAgIHJldHVybiAkYW5zd2VyZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIHF1ZXN0aW9uQW5zd2VyZWQobm9kZTogTm9kZUJhc2UpIHtcbiAgICAgICAgY29uc3QgYW5zd2VyZWQgPSB0aGlzLmVuY291bnRlclZpZXdlclNlcnZpY2UuaGFzQW5zd2VyKG5vZGUpO1xuICAgICAgICByZXR1cm4gYW5zd2VyZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIGNoZWNrRm9yQ29sb24ocXVlc3Rpb25MYWJlbDogc3RyaW5nKSB7XG4gICAgICAgIGlmIChxdWVzdGlvbkxhYmVsLmluZGV4T2YoJzonKSA9PT0gLTEpIHsgcmV0dXJuIHRydWU7IH0gZWxzZSB7IHJldHVybiBmYWxzZTsgfVxuICAgIH1cbn1cbiJdfQ==