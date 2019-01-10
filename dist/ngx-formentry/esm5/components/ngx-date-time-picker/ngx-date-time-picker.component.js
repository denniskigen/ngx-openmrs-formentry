/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, forwardRef, EventEmitter, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment_ from 'moment';
/** @type {?} */
var moment = moment_;
/** @type {?} */
export var MY_FORMATS = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'LL',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};
var NgxDateTimePickerComponent = /** @class */ (function () {
    function NgxDateTimePickerComponent() {
        // public date = new FormControl(moment());
        this.selectedTime = moment().format();
        this.selectedDate = moment().format();
        this.loadInitial = false;
        this.showTimePicker = false;
        this.weeks = [0, 2, 4, 6, 8, 12, 16, 24];
        this.showTime = false;
        this.showWeeks = true;
        this.onDateChange = new EventEmitter();
        this.onChange = function () { };
        this.onTouched = function () { };
    }
    /**
     * @return {?}
     */
    NgxDateTimePickerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @param {?} value
     * @return {?}
     */
    NgxDateTimePickerComponent.prototype.writeValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this.value = value;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgxDateTimePickerComponent.prototype.registerOnChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onChange = fn;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgxDateTimePickerComponent.prototype.registerOnTouched = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    NgxDateTimePickerComponent.prototype.onTimeSelect = /**
     * @param {?} $event
     * @return {?}
     */
    function ($event) {
        /** @type {?} */
        var setDate = moment(this.selectedDate);
        /** @type {?} */
        var setTime = $event;
        this.setDateTime(setDate, setTime);
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    NgxDateTimePickerComponent.prototype.onDateSelect = /**
     * @param {?} $event
     * @return {?}
     */
    function ($event) {
        /** @type {?} */
        var setDate = moment($event.value);
        /** @type {?} */
        var setTime = this.selectedTime;
        /** @type {?} */
        var dateString = this.setDateTime(setDate, setTime);
        /** @type {?} */
        var selectedDate = $event.value;
        this.value = dateString;
    };
    /**
     * @param {?} status
     * @return {?}
     */
    NgxDateTimePickerComponent.prototype.toggleTimePicker = /**
     * @param {?} status
     * @return {?}
     */
    function (status) {
        this.showTimePicker = status;
        return;
    };
    /**
     * @return {?}
     */
    NgxDateTimePickerComponent.prototype.setCurrentTime = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var setDate = moment(this.selectedDate);
        /** @type {?} */
        var currentTime = moment().format('HH:mm:ss');
        this.setDateTime(setDate, currentTime);
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    NgxDateTimePickerComponent.prototype.weekSelect = /**
     * @param {?} $event
     * @return {?}
     */
    function ($event) {
        /** @type {?} */
        var dateToUse = moment().format();
        /** @type {?} */
        var nextWeekDate = moment(dateToUse).add($event.value, 'weeks');
        /** @type {?} */
        var nextWeekTime = dateToUse;
        this.setDateTime(nextWeekDate, nextWeekTime);
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    NgxDateTimePickerComponent.prototype.selectionChange = /**
     * @param {?} $event
     * @return {?}
     */
    function ($event) {
        console.log('Week selected', $event);
    };
    /**
     * @return {?}
     */
    NgxDateTimePickerComponent.prototype.getWeekPickerCssClass = /**
     * @return {?}
     */
    function () {
        if (this.showTime) {
            return 'col-sm-2 form-group';
        }
        return 'col-sm-3 form-group';
    };
    /**
     * @return {?}
     */
    NgxDateTimePickerComponent.prototype.getDatePickerCssClass = /**
     * @return {?}
     */
    function () {
        if (this.showTime && this.showWeeks) {
            return 'col-sm-5 form-group';
        }
        if (this.showWeeks === true) {
            return 'col-sm-9 form-group';
        }
        if (this.showTime === true) {
            return 'col-sm-8 form-group';
        }
        return 'col-sm-12 form-group';
    };
    /**
     * @return {?}
     */
    NgxDateTimePickerComponent.prototype.getTimePickerCssClass = /**
     * @return {?}
     */
    function () {
        if (this.showTime && this.showWeeks) {
            return 'col-sm-5 form-group';
        }
        if (this.showWeeks === true) {
            return 'col-sm-9 form-group';
        }
        return 'col-sm-4 form-group';
    };
    /**
     * @param {?} setDate
     * @param {?} setTime
     * @return {?}
     */
    NgxDateTimePickerComponent.prototype.setDateTime = /**
     * @param {?} setDate
     * @param {?} setTime
     * @return {?}
     */
    function (setDate, setTime) {
        /** @type {?} */
        var newDate = moment(setDate).format('DD-MM-YYYY');
        /** @type {?} */
        var newTime;
        if (this.showTime) {
            newTime = moment(setTime).format('HH:mm:ss');
        }
        else {
            newTime = '00:00:00';
        }
        /** @type {?} */
        var newDateTime = moment(newDate + '' + newTime, 'DD-MM-YYYY HH:mm:ss');
        /** @type {?} */
        var dateTimeString = moment(newDateTime).format();
        this.selectedDate = dateTimeString;
        this.selectedTime = dateTimeString;
        this.value = dateTimeString;
        this.onChange(this.value);
        return dateTimeString;
    };
    NgxDateTimePickerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-date-time-picker',
                    template: "<div>\n  <div class=\"row\">\n    <div [class]=\"getDatePickerCssClass()\">\n      <div class=\"input-group\">\n        <input matInput \n              [matDatepicker]=\"picker\" \n              class=\"form-control\" \n              [value]=\"value\" \n              placeholder=\"Choose a date\" \n              (dateChange)=\"onDateSelect($event)\"\n              (click)=\"picker.open()\"\n              readonly\n        >\n        <mat-datepicker #picker disabled=\"false\"></mat-datepicker>\n        <mat-datepicker-toggle matSuffix [for]=\"picker\" class=\"input-group-btn\"></mat-datepicker-toggle>\n      </div>\n    </div>\n    <div [class]=\"getWeekPickerCssClass()\" *ngIf=\"showWeeks\">\n      <mat-select placeholder=\"Select Weeks\"  class=\"form-control\" name=\"weeks\" (selectionChange) =\"weekSelect($event)\">\n        <mat-option *ngFor=\"let count of weeks\" [value]=\"count\">\n          {{count}} Weeks\n        </mat-option>\n      </mat-select>\n    </div>\n    <div [class]=\"getTimePickerCssClass()\" *ngIf=\"showTime\">\n          <input type=\"text\" class=\"form-control\" [value]=\"value | date: 'shortTime'\" (focus)=\"toggleTimePicker(true)\" readonly placeholder=\"Select Time\"\n          />\n          <time-picker *ngIf=\"showTimePicker\" [initTime]=\"value\" [use12Hour]=\"true\" (onSelectTime)=\"onTimeSelect($event)\" (onTimePickerCancel)=\"toggleTimePicker($event)\"></time-picker>\n    </div>\n  </div>\n</div>\n\n",
                    providers: [
                        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
                        { provide: DateAdapter, useClass: MomentDateAdapter },
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(function () { return NgxDateTimePickerComponent; }),
                            multi: true
                        }
                    ],
                    styles: ["#time-section{display:inline-block}#ngx-atp-time-picker,#ngx-mat-form-field{width:100%}.up{bottom:100%!important;top:auto!important}.time-btn{margin-top:-20px}"]
                }] }
    ];
    NgxDateTimePickerComponent.propDecorators = {
        weeks: [{ type: Input }],
        modelValue: [{ type: Input }],
        showTime: [{ type: Input }],
        showWeeks: [{ type: Input }],
        onDateChange: [{ type: Output }]
    };
    return NgxDateTimePickerComponent;
}());
export { NgxDateTimePickerComponent };
if (false) {
    /** @type {?} */
    NgxDateTimePickerComponent.prototype.selectedTime;
    /** @type {?} */
    NgxDateTimePickerComponent.prototype.selectedDate;
    /** @type {?} */
    NgxDateTimePickerComponent.prototype.loadInitial;
    /** @type {?} */
    NgxDateTimePickerComponent.prototype.value;
    /** @type {?} */
    NgxDateTimePickerComponent.prototype.showTimePicker;
    /** @type {?} */
    NgxDateTimePickerComponent.prototype.weeks;
    /** @type {?} */
    NgxDateTimePickerComponent.prototype.modelValue;
    /** @type {?} */
    NgxDateTimePickerComponent.prototype.showTime;
    /** @type {?} */
    NgxDateTimePickerComponent.prototype.showWeeks;
    /** @type {?} */
    NgxDateTimePickerComponent.prototype.onDateChange;
    /** @type {?} */
    NgxDateTimePickerComponent.prototype.onChange;
    /** @type {?} */
    NgxDateTimePickerComponent.prototype.onTouched;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRhdGUtdGltZS1waWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LW9wZW5tcnMtZm9ybWVudHJ5LyIsInNvdXJjZXMiOlsiY29tcG9uZW50cy9uZ3gtZGF0ZS10aW1lLXBpY2tlci9uZ3gtZGF0ZS10aW1lLXBpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNGLE9BQU8sRUFBd0IsaUJBQWlCLEVBQWUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN0RixPQUFPLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckUsT0FBTyxLQUFLLE9BQU8sTUFBTSxRQUFRLENBQUM7O0lBQzVCLE1BQU0sR0FBRyxPQUFPOztBQUV0QixNQUFNLEtBQU8sVUFBVSxHQUFHO0lBQ3RCLEtBQUssRUFBRTtRQUNILFNBQVMsRUFBRSxJQUFJO0tBQ2xCO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsU0FBUyxFQUFFLElBQUk7UUFDZixjQUFjLEVBQUUsVUFBVTtRQUMxQixhQUFhLEVBQUUsSUFBSTtRQUNuQixrQkFBa0IsRUFBRSxXQUFXO0tBQ2xDO0NBQ0o7QUFFRDtJQUFBOztRQWlCVyxpQkFBWSxHQUFHLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pDLGlCQUFZLEdBQUcsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakMsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFFcEIsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFDckIsVUFBSyxHQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxF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QUFFO3dCQUNQLEVBQUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUU7d0JBQ25ELEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUU7d0JBQ3JEOzRCQUNJLE9BQU8sRUFBRSxpQkFBaUI7NEJBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsY0FBTSxPQUFBLDBCQUEwQixFQUExQixDQUEwQixDQUFDOzRCQUN6RCxLQUFLLEVBQUUsSUFBSTt5QkFDZDtxQkFDSjs7aUJBQ0o7Ozt3QkFTSSxLQUFLOzZCQUNMLEtBQUs7MkJBQ0wsS0FBSzs0QkFDTCxLQUFLOytCQUNMLE1BQU07O0lBa0hYLGlDQUFDO0NBQUEsQUE1SUQsSUE0SUM7U0E5SFksMEJBQTBCOzs7SUFHbkMsa0RBQXdDOztJQUN4QyxrREFBd0M7O0lBQ3hDLGlEQUEyQjs7SUFDM0IsMkNBQWE7O0lBQ2Isb0RBQThCOztJQUM5QiwyQ0FBdUQ7O0lBQ3ZELGdEQUF5Qjs7SUFDekIsOENBQTBCOztJQUMxQiwrQ0FBMEI7O0lBQzFCLGtEQUFpRDs7SUFDakQsOENBQWlDOztJQUNqQywrQ0FBa0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb21lbnQgfSBmcm9tICdtb21lbnQvbW9tZW50JztcblxuaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBmb3J3YXJkUmVmLCBFdmVudEVtaXR0ZXIsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SLCBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IERhdGVBZGFwdGVyLCBNQVRfREFURV9GT1JNQVRTIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQgeyBNb21lbnREYXRlQWRhcHRlciB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsLW1vbWVudC1hZGFwdGVyJztcbmltcG9ydCAqIGFzIG1vbWVudF8gZnJvbSAnbW9tZW50JztcbmNvbnN0IG1vbWVudCA9IG1vbWVudF87XG5cbmV4cG9ydCBjb25zdCBNWV9GT1JNQVRTID0ge1xuICAgIHBhcnNlOiB7XG4gICAgICAgIGRhdGVJbnB1dDogJ0xMJyxcbiAgICB9LFxuICAgIGRpc3BsYXk6IHtcbiAgICAgICAgZGF0ZUlucHV0OiAnTEwnLFxuICAgICAgICBtb250aFllYXJMYWJlbDogJ01NTSBZWVlZJyxcbiAgICAgICAgZGF0ZUExMXlMYWJlbDogJ0xMJyxcbiAgICAgICAgbW9udGhZZWFyQTExeUxhYmVsOiAnTU1NTSBZWVlZJyxcbiAgICB9LFxufTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICduZ3gtZGF0ZS10aW1lLXBpY2tlcicsXG4gICAgdGVtcGxhdGVVcmw6ICcuL25neC1kYXRlLXRpbWUtcGlja2VyLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9uZ3gtZGF0ZS10aW1lLXBpY2tlci5jb21wb25lbnQuY3NzJ10sXG4gICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHsgcHJvdmlkZTogTUFUX0RBVEVfRk9STUFUUywgdXNlVmFsdWU6IE1ZX0ZPUk1BVFMgfSxcbiAgICAgICAgeyBwcm92aWRlOiBEYXRlQWRhcHRlciwgdXNlQ2xhc3M6IE1vbWVudERhdGVBZGFwdGVyIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmd4RGF0ZVRpbWVQaWNrZXJDb21wb25lbnQpLFxuICAgICAgICAgICAgbXVsdGk6IHRydWVcbiAgICAgICAgfVxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgTmd4RGF0ZVRpbWVQaWNrZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcblxuICAgIC8vIHB1YmxpYyBkYXRlID0gbmV3IEZvcm1Db250cm9sKG1vbWVudCgpKTtcbiAgICBwdWJsaWMgc2VsZWN0ZWRUaW1lID0gbW9tZW50KCkuZm9ybWF0KCk7XG4gICAgcHVibGljIHNlbGVjdGVkRGF0ZSA9IG1vbWVudCgpLmZvcm1hdCgpO1xuICAgIHB1YmxpYyBsb2FkSW5pdGlhbCA9IGZhbHNlO1xuICAgIHB1YmxpYyB2YWx1ZTtcbiAgICBwdWJsaWMgc2hvd1RpbWVQaWNrZXIgPSBmYWxzZTtcbiAgICBASW5wdXQoKSB3ZWVrczogbnVtYmVyW10gPSBbMCwgMiwgNCwgNiwgOCwgMTIsIDE2LCAyNF07XG4gICAgQElucHV0KCkgbW9kZWxWYWx1ZTogYW55O1xuICAgIEBJbnB1dCgpIHNob3dUaW1lID0gZmFsc2U7XG4gICAgQElucHV0KCkgc2hvd1dlZWtzID0gdHJ1ZTtcbiAgICBAT3V0cHV0KCkgb25EYXRlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gICAgcHVibGljIG9uQ2hhbmdlOiBhbnkgPSAoKSA9PiB7IH07XG4gICAgcHVibGljIG9uVG91Y2hlZDogYW55ID0gKCkgPT4geyB9O1xuICAgIHB1YmxpYyBuZ09uSW5pdCgpIHtcblxuICAgIH1cblxuXG4gICAgcHVibGljIHdyaXRlVmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWdpc3Rlck9uQ2hhbmdlKGZuKSB7XG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVnaXN0ZXJPblRvdWNoZWQoZm4pIHtcblxuICAgIH1cblxuICAgIHB1YmxpYyBvblRpbWVTZWxlY3QoJGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IHNldERhdGUgPSBtb21lbnQodGhpcy5zZWxlY3RlZERhdGUpO1xuICAgICAgICBjb25zdCBzZXRUaW1lID0gJGV2ZW50O1xuICAgICAgICB0aGlzLnNldERhdGVUaW1lKHNldERhdGUsIHNldFRpbWUpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbkRhdGVTZWxlY3QoJGV2ZW50KSB7XG5cbiAgICAgICAgY29uc3Qgc2V0RGF0ZSA9IG1vbWVudCgkZXZlbnQudmFsdWUpO1xuICAgICAgICBjb25zdCBzZXRUaW1lID0gdGhpcy5zZWxlY3RlZFRpbWU7XG4gICAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSB0aGlzLnNldERhdGVUaW1lKHNldERhdGUsIHNldFRpbWUpO1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkRGF0ZSA9ICRldmVudC52YWx1ZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IGRhdGVTdHJpbmc7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgdG9nZ2xlVGltZVBpY2tlcihzdGF0dXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zaG93VGltZVBpY2tlciA9IHN0YXR1cztcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuXG4gICAgcHVibGljIHNldEN1cnJlbnRUaW1lKCkge1xuXG4gICAgICAgIGNvbnN0IHNldERhdGUgPSBtb21lbnQodGhpcy5zZWxlY3RlZERhdGUpO1xuICAgICAgICBjb25zdCBjdXJyZW50VGltZSA9IG1vbWVudCgpLmZvcm1hdCgnSEg6bW06c3MnKTtcbiAgICAgICAgdGhpcy5zZXREYXRlVGltZShzZXREYXRlLCBjdXJyZW50VGltZSk7XG4gICAgfVxuXG4gICAgcHVibGljIHdlZWtTZWxlY3QoJGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGRhdGVUb1VzZSA9IG1vbWVudCgpLmZvcm1hdCgpO1xuICAgICAgICBjb25zdCBuZXh0V2Vla0RhdGUgPSBtb21lbnQoZGF0ZVRvVXNlKS5hZGQoJGV2ZW50LnZhbHVlLCAnd2Vla3MnKTtcbiAgICAgICAgY29uc3QgbmV4dFdlZWtUaW1lID0gZGF0ZVRvVXNlO1xuICAgICAgICB0aGlzLnNldERhdGVUaW1lKG5leHRXZWVrRGF0ZSwgbmV4dFdlZWtUaW1lKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2VsZWN0aW9uQ2hhbmdlKCRldmVudCkge1xuICAgICAgICBjb25zb2xlLmxvZygnV2VlayBzZWxlY3RlZCcsICRldmVudCk7XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgZ2V0V2Vla1BpY2tlckNzc0NsYXNzKCkge1xuICAgICAgICBpZiAodGhpcy5zaG93VGltZSkge1xuICAgICAgICAgICAgcmV0dXJuICdjb2wtc20tMiBmb3JtLWdyb3VwJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ2NvbC1zbS0zIGZvcm0tZ3JvdXAnO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXREYXRlUGlja2VyQ3NzQ2xhc3MoKSB7XG4gICAgICAgIGlmICh0aGlzLnNob3dUaW1lICYmIHRoaXMuc2hvd1dlZWtzKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2NvbC1zbS01IGZvcm0tZ3JvdXAnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2hvd1dlZWtzID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2NvbC1zbS05IGZvcm0tZ3JvdXAnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2hvd1RpbWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiAnY29sLXNtLTggZm9ybS1ncm91cCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdjb2wtc20tMTIgZm9ybS1ncm91cCc7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFRpbWVQaWNrZXJDc3NDbGFzcygpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hvd1RpbWUgJiYgdGhpcy5zaG93V2Vla3MpIHtcbiAgICAgICAgICAgIHJldHVybiAnY29sLXNtLTUgZm9ybS1ncm91cCc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zaG93V2Vla3MgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiAnY29sLXNtLTkgZm9ybS1ncm91cCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdjb2wtc20tNCBmb3JtLWdyb3VwJztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0RGF0ZVRpbWUoc2V0RGF0ZSwgc2V0VGltZSkge1xuICAgICAgICBjb25zdCBuZXdEYXRlID0gbW9tZW50KHNldERhdGUpLmZvcm1hdCgnREQtTU0tWVlZWScpO1xuICAgICAgICBsZXQgbmV3VGltZTtcbiAgICAgICAgaWYgKHRoaXMuc2hvd1RpbWUpIHtcbiAgICAgICAgICAgIG5ld1RpbWUgPSBtb21lbnQoc2V0VGltZSkuZm9ybWF0KCdISDptbTpzcycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3VGltZSA9ICcwMDowMDowMCc7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV3RGF0ZVRpbWUgPSBtb21lbnQobmV3RGF0ZSArICcnICsgbmV3VGltZSwgJ0RELU1NLVlZWVkgSEg6bW06c3MnKTtcbiAgICAgICAgY29uc3QgZGF0ZVRpbWVTdHJpbmcgPSBtb21lbnQobmV3RGF0ZVRpbWUpLmZvcm1hdCgpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZSA9IGRhdGVUaW1lU3RyaW5nO1xuICAgICAgICB0aGlzLnNlbGVjdGVkVGltZSA9IGRhdGVUaW1lU3RyaW5nO1xuICAgICAgICB0aGlzLnZhbHVlID0gZGF0ZVRpbWVTdHJpbmc7XG4gICAgICAgIHRoaXMub25DaGFuZ2UodGhpcy52YWx1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGRhdGVUaW1lU3RyaW5nO1xuXG5cbiAgICB9XG59XG4iXX0=