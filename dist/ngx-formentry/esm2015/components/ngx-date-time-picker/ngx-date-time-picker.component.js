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
const moment = moment_;
/** @type {?} */
export const MY_FORMATS = {
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
export class NgxDateTimePickerComponent {
    constructor() {
        // public date = new FormControl(moment());
        this.selectedTime = moment().format();
        this.selectedDate = moment().format();
        this.loadInitial = false;
        this.showTimePicker = false;
        this.weeks = [0, 2, 4, 6, 8, 12, 16, 24];
        this.showTime = false;
        this.showWeeks = true;
        this.onDateChange = new EventEmitter();
        this.onChange = () => { };
        this.onTouched = () => { };
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.value = value;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onTimeSelect($event) {
        /** @type {?} */
        const setDate = moment(this.selectedDate);
        /** @type {?} */
        const setTime = $event;
        this.setDateTime(setDate, setTime);
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onDateSelect($event) {
        /** @type {?} */
        const setDate = moment($event.value);
        /** @type {?} */
        const setTime = this.selectedTime;
        /** @type {?} */
        const dateString = this.setDateTime(setDate, setTime);
        /** @type {?} */
        const selectedDate = $event.value;
        this.value = dateString;
    }
    /**
     * @param {?} status
     * @return {?}
     */
    toggleTimePicker(status) {
        this.showTimePicker = status;
        return;
    }
    /**
     * @return {?}
     */
    setCurrentTime() {
        /** @type {?} */
        const setDate = moment(this.selectedDate);
        /** @type {?} */
        const currentTime = moment().format('HH:mm:ss');
        this.setDateTime(setDate, currentTime);
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    weekSelect($event) {
        /** @type {?} */
        const dateToUse = moment().format();
        /** @type {?} */
        const nextWeekDate = moment(dateToUse).add($event.value, 'weeks');
        /** @type {?} */
        const nextWeekTime = dateToUse;
        this.setDateTime(nextWeekDate, nextWeekTime);
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    selectionChange($event) {
        console.log('Week selected', $event);
    }
    /**
     * @return {?}
     */
    getWeekPickerCssClass() {
        if (this.showTime) {
            return 'col-sm-2 form-group';
        }
        return 'col-sm-3 form-group';
    }
    /**
     * @return {?}
     */
    getDatePickerCssClass() {
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
    }
    /**
     * @return {?}
     */
    getTimePickerCssClass() {
        if (this.showTime && this.showWeeks) {
            return 'col-sm-5 form-group';
        }
        if (this.showWeeks === true) {
            return 'col-sm-9 form-group';
        }
        return 'col-sm-4 form-group';
    }
    /**
     * @param {?} setDate
     * @param {?} setTime
     * @return {?}
     */
    setDateTime(setDate, setTime) {
        /** @type {?} */
        const newDate = moment(setDate).format('DD-MM-YYYY');
        /** @type {?} */
        let newTime;
        if (this.showTime) {
            newTime = moment(setTime).format('HH:mm:ss');
        }
        else {
            newTime = '00:00:00';
        }
        /** @type {?} */
        const newDateTime = moment(newDate + '' + newTime, 'DD-MM-YYYY HH:mm:ss');
        /** @type {?} */
        const dateTimeString = moment(newDateTime).format();
        this.selectedDate = dateTimeString;
        this.selectedTime = dateTimeString;
        this.value = dateTimeString;
        this.onChange(this.value);
        return dateTimeString;
    }
}
NgxDateTimePickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-date-time-picker',
                template: "<div>\n  <div class=\"row\">\n    <div [class]=\"getDatePickerCssClass()\">\n      <div class=\"input-group\">\n        <input matInput \n              [matDatepicker]=\"picker\" \n              class=\"form-control\" \n              [value]=\"value\" \n              placeholder=\"Choose a date\" \n              (dateChange)=\"onDateSelect($event)\"\n              (click)=\"picker.open()\"\n              readonly\n        >\n        <mat-datepicker #picker disabled=\"false\"></mat-datepicker>\n        <mat-datepicker-toggle matSuffix [for]=\"picker\" class=\"input-group-btn\"></mat-datepicker-toggle>\n      </div>\n    </div>\n    <div [class]=\"getWeekPickerCssClass()\" *ngIf=\"showWeeks\">\n      <mat-select placeholder=\"Select Weeks\"  class=\"form-control\" name=\"weeks\" (selectionChange) =\"weekSelect($event)\">\n        <mat-option *ngFor=\"let count of weeks\" [value]=\"count\">\n          {{count}} Weeks\n        </mat-option>\n      </mat-select>\n    </div>\n    <div [class]=\"getTimePickerCssClass()\" *ngIf=\"showTime\">\n          <input type=\"text\" class=\"form-control\" [value]=\"value | date: 'shortTime'\" (focus)=\"toggleTimePicker(true)\" readonly placeholder=\"Select Time\"\n          />\n          <time-picker *ngIf=\"showTimePicker\" [initTime]=\"value\" [use12Hour]=\"true\" (onSelectTime)=\"onTimeSelect($event)\" (onTimePickerCancel)=\"toggleTimePicker($event)\"></time-picker>\n    </div>\n  </div>\n</div>\n\n",
                providers: [
                    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
                    { provide: DateAdapter, useClass: MomentDateAdapter },
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => NgxDateTimePickerComponent),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRhdGUtdGltZS1waWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LW9wZW5tcnMtZm9ybWVudHJ5LyIsInNvdXJjZXMiOlsiY29tcG9uZW50cy9uZ3gtZGF0ZS10aW1lLXBpY2tlci9uZ3gtZGF0ZS10aW1lLXBpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNGLE9BQU8sRUFBd0IsaUJBQWlCLEVBQWUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN0RixPQUFPLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckUsT0FBTyxLQUFLLE9BQU8sTUFBTSxRQUFRLENBQUM7O01BQzVCLE1BQU0sR0FBRyxPQUFPOztBQUV0QixNQUFNLE9BQU8sVUFBVSxHQUFHO0lBQ3RCLEtBQUssRUFBRTtRQUNILFNBQVMsRUFBRSxJQUFJO0tBQ2xCO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsU0FBUyxFQUFFLElBQUk7UUFDZixjQUFjLEVBQUUsVUFBVTtRQUMxQixhQUFhLEVBQUUsSUFBSTtRQUNuQixrQkFBa0IsRUFBRSxXQUFXO0tBQ2xDO0NBQ0o7QUFnQkQsTUFBTSxPQUFPLDBCQUEwQjtJQWR2Qzs7UUFpQlcsaUJBQVksR0FBRyxNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNqQyxpQkFBWSxHQUFHLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pDLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBRXBCLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLFVBQUssR0FBYSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENB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QUUsaUJBQWlCLEVBQUU7b0JBQ3JEO3dCQUNJLE9BQU8sRUFBRSxpQkFBaUI7d0JBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsMEJBQTBCLENBQUM7d0JBQ3pELEtBQUssRUFBRSxJQUFJO3FCQUNkO2lCQUNKOzthQUNKOzs7b0JBU0ksS0FBSzt5QkFDTCxLQUFLO3VCQUNMLEtBQUs7d0JBQ0wsS0FBSzsyQkFDTCxNQUFNOzs7O0lBVFAsa0RBQXdDOztJQUN4QyxrREFBd0M7O0lBQ3hDLGlEQUEyQjs7SUFDM0IsMkNBQWE7O0lBQ2Isb0RBQThCOztJQUM5QiwyQ0FBdUQ7O0lBQ3ZELGdEQUF5Qjs7SUFDekIsOENBQTBCOztJQUMxQiwrQ0FBMEI7O0lBQzFCLGtEQUFpRDs7SUFDakQsOENBQWlDOztJQUNqQywrQ0FBa0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb21lbnQgfSBmcm9tICdtb21lbnQvbW9tZW50JztcblxuaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBmb3J3YXJkUmVmLCBFdmVudEVtaXR0ZXIsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SLCBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IERhdGVBZGFwdGVyLCBNQVRfREFURV9GT1JNQVRTIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQgeyBNb21lbnREYXRlQWRhcHRlciB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsLW1vbWVudC1hZGFwdGVyJztcbmltcG9ydCAqIGFzIG1vbWVudF8gZnJvbSAnbW9tZW50JztcbmNvbnN0IG1vbWVudCA9IG1vbWVudF87XG5cbmV4cG9ydCBjb25zdCBNWV9GT1JNQVRTID0ge1xuICAgIHBhcnNlOiB7XG4gICAgICAgIGRhdGVJbnB1dDogJ0xMJyxcbiAgICB9LFxuICAgIGRpc3BsYXk6IHtcbiAgICAgICAgZGF0ZUlucHV0OiAnTEwnLFxuICAgICAgICBtb250aFllYXJMYWJlbDogJ01NTSBZWVlZJyxcbiAgICAgICAgZGF0ZUExMXlMYWJlbDogJ0xMJyxcbiAgICAgICAgbW9udGhZZWFyQTExeUxhYmVsOiAnTU1NTSBZWVlZJyxcbiAgICB9LFxufTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICduZ3gtZGF0ZS10aW1lLXBpY2tlcicsXG4gICAgdGVtcGxhdGVVcmw6ICcuL25neC1kYXRlLXRpbWUtcGlja2VyLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9uZ3gtZGF0ZS10aW1lLXBpY2tlci5jb21wb25lbnQuY3NzJ10sXG4gICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHsgcHJvdmlkZTogTUFUX0RBVEVfRk9STUFUUywgdXNlVmFsdWU6IE1ZX0ZPUk1BVFMgfSxcbiAgICAgICAgeyBwcm92aWRlOiBEYXRlQWRhcHRlciwgdXNlQ2xhc3M6IE1vbWVudERhdGVBZGFwdGVyIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmd4RGF0ZVRpbWVQaWNrZXJDb21wb25lbnQpLFxuICAgICAgICAgICAgbXVsdGk6IHRydWVcbiAgICAgICAgfVxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgTmd4RGF0ZVRpbWVQaWNrZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcblxuICAgIC8vIHB1YmxpYyBkYXRlID0gbmV3IEZvcm1Db250cm9sKG1vbWVudCgpKTtcbiAgICBwdWJsaWMgc2VsZWN0ZWRUaW1lID0gbW9tZW50KCkuZm9ybWF0KCk7XG4gICAgcHVibGljIHNlbGVjdGVkRGF0ZSA9IG1vbWVudCgpLmZvcm1hdCgpO1xuICAgIHB1YmxpYyBsb2FkSW5pdGlhbCA9IGZhbHNlO1xuICAgIHB1YmxpYyB2YWx1ZTtcbiAgICBwdWJsaWMgc2hvd1RpbWVQaWNrZXIgPSBmYWxzZTtcbiAgICBASW5wdXQoKSB3ZWVrczogbnVtYmVyW10gPSBbMCwgMiwgNCwgNiwgOCwgMTIsIDE2LCAyNF07XG4gICAgQElucHV0KCkgbW9kZWxWYWx1ZTogYW55O1xuICAgIEBJbnB1dCgpIHNob3dUaW1lID0gZmFsc2U7XG4gICAgQElucHV0KCkgc2hvd1dlZWtzID0gdHJ1ZTtcbiAgICBAT3V0cHV0KCkgb25EYXRlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gICAgcHVibGljIG9uQ2hhbmdlOiBhbnkgPSAoKSA9PiB7IH07XG4gICAgcHVibGljIG9uVG91Y2hlZDogYW55ID0gKCkgPT4geyB9O1xuICAgIHB1YmxpYyBuZ09uSW5pdCgpIHtcblxuICAgIH1cblxuXG4gICAgcHVibGljIHdyaXRlVmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWdpc3Rlck9uQ2hhbmdlKGZuKSB7XG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVnaXN0ZXJPblRvdWNoZWQoZm4pIHtcblxuICAgIH1cblxuICAgIHB1YmxpYyBvblRpbWVTZWxlY3QoJGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IHNldERhdGUgPSBtb21lbnQodGhpcy5zZWxlY3RlZERhdGUpO1xuICAgICAgICBjb25zdCBzZXRUaW1lID0gJGV2ZW50O1xuICAgICAgICB0aGlzLnNldERhdGVUaW1lKHNldERhdGUsIHNldFRpbWUpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbkRhdGVTZWxlY3QoJGV2ZW50KSB7XG5cbiAgICAgICAgY29uc3Qgc2V0RGF0ZSA9IG1vbWVudCgkZXZlbnQudmFsdWUpO1xuICAgICAgICBjb25zdCBzZXRUaW1lID0gdGhpcy5zZWxlY3RlZFRpbWU7XG4gICAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSB0aGlzLnNldERhdGVUaW1lKHNldERhdGUsIHNldFRpbWUpO1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkRGF0ZSA9ICRldmVudC52YWx1ZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IGRhdGVTdHJpbmc7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgdG9nZ2xlVGltZVBpY2tlcihzdGF0dXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zaG93VGltZVBpY2tlciA9IHN0YXR1cztcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuXG4gICAgcHVibGljIHNldEN1cnJlbnRUaW1lKCkge1xuXG4gICAgICAgIGNvbnN0IHNldERhdGUgPSBtb21lbnQodGhpcy5zZWxlY3RlZERhdGUpO1xuICAgICAgICBjb25zdCBjdXJyZW50VGltZSA9IG1vbWVudCgpLmZvcm1hdCgnSEg6bW06c3MnKTtcbiAgICAgICAgdGhpcy5zZXREYXRlVGltZShzZXREYXRlLCBjdXJyZW50VGltZSk7XG4gICAgfVxuXG4gICAgcHVibGljIHdlZWtTZWxlY3QoJGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGRhdGVUb1VzZSA9IG1vbWVudCgpLmZvcm1hdCgpO1xuICAgICAgICBjb25zdCBuZXh0V2Vla0RhdGUgPSBtb21lbnQoZGF0ZVRvVXNlKS5hZGQoJGV2ZW50LnZhbHVlLCAnd2Vla3MnKTtcbiAgICAgICAgY29uc3QgbmV4dFdlZWtUaW1lID0gZGF0ZVRvVXNlO1xuICAgICAgICB0aGlzLnNldERhdGVUaW1lKG5leHRXZWVrRGF0ZSwgbmV4dFdlZWtUaW1lKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2VsZWN0aW9uQ2hhbmdlKCRldmVudCkge1xuICAgICAgICBjb25zb2xlLmxvZygnV2VlayBzZWxlY3RlZCcsICRldmVudCk7XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgZ2V0V2Vla1BpY2tlckNzc0NsYXNzKCkge1xuICAgICAgICBpZiAodGhpcy5zaG93VGltZSkge1xuICAgICAgICAgICAgcmV0dXJuICdjb2wtc20tMiBmb3JtLWdyb3VwJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ2NvbC1zbS0zIGZvcm0tZ3JvdXAnO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXREYXRlUGlja2VyQ3NzQ2xhc3MoKSB7XG4gICAgICAgIGlmICh0aGlzLnNob3dUaW1lICYmIHRoaXMuc2hvd1dlZWtzKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2NvbC1zbS01IGZvcm0tZ3JvdXAnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2hvd1dlZWtzID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2NvbC1zbS05IGZvcm0tZ3JvdXAnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2hvd1RpbWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiAnY29sLXNtLTggZm9ybS1ncm91cCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdjb2wtc20tMTIgZm9ybS1ncm91cCc7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFRpbWVQaWNrZXJDc3NDbGFzcygpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hvd1RpbWUgJiYgdGhpcy5zaG93V2Vla3MpIHtcbiAgICAgICAgICAgIHJldHVybiAnY29sLXNtLTUgZm9ybS1ncm91cCc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zaG93V2Vla3MgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiAnY29sLXNtLTkgZm9ybS1ncm91cCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdjb2wtc20tNCBmb3JtLWdyb3VwJztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0RGF0ZVRpbWUoc2V0RGF0ZSwgc2V0VGltZSkge1xuICAgICAgICBjb25zdCBuZXdEYXRlID0gbW9tZW50KHNldERhdGUpLmZvcm1hdCgnREQtTU0tWVlZWScpO1xuICAgICAgICBsZXQgbmV3VGltZTtcbiAgICAgICAgaWYgKHRoaXMuc2hvd1RpbWUpIHtcbiAgICAgICAgICAgIG5ld1RpbWUgPSBtb21lbnQoc2V0VGltZSkuZm9ybWF0KCdISDptbTpzcycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3VGltZSA9ICcwMDowMDowMCc7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV3RGF0ZVRpbWUgPSBtb21lbnQobmV3RGF0ZSArICcnICsgbmV3VGltZSwgJ0RELU1NLVlZWVkgSEg6bW06c3MnKTtcbiAgICAgICAgY29uc3QgZGF0ZVRpbWVTdHJpbmcgPSBtb21lbnQobmV3RGF0ZVRpbWUpLmZvcm1hdCgpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZSA9IGRhdGVUaW1lU3RyaW5nO1xuICAgICAgICB0aGlzLnNlbGVjdGVkVGltZSA9IGRhdGVUaW1lU3RyaW5nO1xuICAgICAgICB0aGlzLnZhbHVlID0gZGF0ZVRpbWVTdHJpbmc7XG4gICAgICAgIHRoaXMub25DaGFuZ2UodGhpcy52YWx1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGRhdGVUaW1lU3RyaW5nO1xuXG5cbiAgICB9XG59XG4iXX0=