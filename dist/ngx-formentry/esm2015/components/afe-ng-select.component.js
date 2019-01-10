/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Option } from '../form-entry/question-models/select-option';
export class AfeNgSelectComponent {
    constructor() {
        this.question_options = [];
        this.errors = [];
        this.propagateChange = (_) => { };
    }
    /**
     * @param {?} event
     * @return {?}
     */
    getChangingText(event) {
        // console.log(event);
        this.getData(event).subscribe((options) => {
            this.question_options = options;
        });
    }
    /**
     * @param {?} obj
     * @return {?}
     */
    writeValue(obj) {
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) { }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.extras) {
            if (this.extras.originalValue) {
                this.resolveSelectedOption(this.extras.originalValue).subscribe((option) => {
                    this.selected_question_option = option;
                });
            }
        }
    }
    /**
     * @param {?} searchText
     * @return {?}
     */
    getData(searchText) {
        this.subject = new BehaviorSubject([]);
        /** @type {?} */
        const OptionsObservable = this.dataSource.searchOptions(searchText);
        OptionsObservable.subscribe((options) => {
            // console.log('options', options);
            /** @type {?} */
            const mappedOptions = new Array();
            for (let i = 0; i < options.length; i++) {
                mappedOptions.push(new Option(options[i]));
            }
            this.subject.next(mappedOptions);
        }, (error) => {
            this.subject.error(error);
        });
        return this.subject.asObservable();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onValueChange(event) { }
    /**
     * @param {?} value
     * @return {?}
     */
    resolveSelectedOption(value) {
        this.subjectOption = new BehaviorSubject(null);
        /** @type {?} */
        const OptionObservable = this.dataSource.resolveSelectedValue(value);
        OptionObservable.subscribe((option) => {
            // console.log('option', option);
            this.subjectOption.next(option);
        }, (error) => {
            this.subjectOption.error(error);
        });
        return this.subjectOption.asObservable();
    }
    /**
     * @return {?}
     */
    resetOptions() {
        this.subject.next(new Array());
    }
}
AfeNgSelectComponent.decorators = [
    { type: Component, args: [{
                selector: 'afe-ng-select',
                template: `<ng-select
                   (searchInputText)="getChangingText($event)"
                    (ngModelChange)="onValueChange($event)"
                    [options]="question_options"
                    [multiple]="multiple" >
            </ng-select>
  `,
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => AfeNgSelectComponent),
                        multi: true
                    }
                ]
            }] }
];
AfeNgSelectComponent.propDecorators = {
    dataSource: [{ type: Input }],
    multiple: [{ type: Input }],
    extras: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    AfeNgSelectComponent.prototype.subject;
    /** @type {?} */
    AfeNgSelectComponent.prototype.subjectOption;
    /** @type {?} */
    AfeNgSelectComponent.prototype.dataSource;
    /** @type {?} */
    AfeNgSelectComponent.prototype.multiple;
    /** @type {?} */
    AfeNgSelectComponent.prototype.extras;
    /** @type {?} */
    AfeNgSelectComponent.prototype.question_options;
    /** @type {?} */
    AfeNgSelectComponent.prototype.selected_question_option;
    /** @type {?} */
    AfeNgSelectComponent.prototype.errors;
    /** @type {?} */
    AfeNgSelectComponent.prototype.propagateChange;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWZlLW5nLXNlbGVjdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtb3Blbm1ycy1mb3JtZW50cnkvIiwic291cmNlcyI6WyJjb21wb25lbnRzL2FmZS1uZy1zZWxlY3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQzdCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RSxPQUFPLEVBQWMsZUFBZSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQXFCckUsTUFBTSxPQUFPLG9CQUFvQjtJQWhCakM7UUFzQkUscUJBQWdCLEdBQVEsRUFBRSxDQUFDO1FBRTNCLFdBQU0sR0FBUSxFQUFFLENBQUM7UUFDakIsb0JBQWUsR0FBRyxDQUFDLENBQU0sRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBaUZwQyxDQUFDOzs7OztJQS9FQyxlQUFlLENBQUMsS0FBSztRQUNuQixzQkFBc0I7UUFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUN4QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7Ozs7SUFFRCxVQUFVLENBQUMsR0FBUTtJQUVuQixDQUFDOzs7OztJQUNELGdCQUFnQixDQUFDLEVBQU87UUFDdEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7SUFFNUIsQ0FBQzs7Ozs7SUFFRCxpQkFBaUIsQ0FBQyxFQUFPLElBQVUsQ0FBQzs7Ozs7SUFFcEMsV0FBVyxDQUFDLE9BQVksSUFBSSxDQUFDOzs7O0lBRTdCLFFBQVE7UUFDTixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDZixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO2dCQUM3QixJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtvQkFDekUsSUFBSSxDQUFDLHdCQUF3QixHQUFHLE1BQU0sQ0FBQztnQkFDekMsQ0FBQyxDQUFDLENBQUM7YUFDSjtTQUVGO0lBRUgsQ0FBQzs7Ozs7SUFFRCxPQUFPLENBQUMsVUFBa0I7UUFFeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGVBQWUsQ0FBVyxFQUFFLENBQUMsQ0FBQzs7Y0FFM0MsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDO1FBRW5FLGlCQUFpQixDQUFDLFNBQVMsQ0FDekIsQ0FBQyxPQUFPLEVBQUUsRUFBRTs7O2tCQUVKLGFBQWEsR0FBYSxJQUFJLEtBQUssRUFBVTtZQUVuRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDdkMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzVDO1lBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbkMsQ0FBQyxFQUNELENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDUixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQ0YsQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNyQyxDQUFDOzs7OztJQUVELGFBQWEsQ0FBQyxLQUFLLElBQUksQ0FBQzs7Ozs7SUFDeEIscUJBQXFCLENBQUMsS0FBVTtRQUU5QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksZUFBZSxDQUFTLElBQUksQ0FBQyxDQUFDOztjQUNqRCxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQztRQUVwRSxnQkFBZ0IsQ0FBQyxTQUFTLENBQ3hCLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDVCxpQ0FBaUM7WUFDakMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxFQUNELENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDUixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQ0YsQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMzQyxDQUFDOzs7O0lBRUQsWUFBWTtRQUNWLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFVLENBQUMsQ0FBQztJQUV6QyxDQUFDOzs7WUF4R0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxlQUFlO2dCQUN6QixRQUFRLEVBQUU7Ozs7OztHQU1UO2dCQUNELFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxPQUFPLEVBQUUsaUJBQWlCO3dCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLG9CQUFvQixDQUFDO3dCQUNuRCxLQUFLLEVBQUUsSUFBSTtxQkFDWjtpQkFBQzthQUNMOzs7eUJBSUUsS0FBSzt1QkFDTCxLQUFLO3FCQUNMLEtBQUs7Ozs7SUFKTix1Q0FBbUM7O0lBQ25DLDZDQUF1Qzs7SUFDdkMsMENBQWdDOztJQUNoQyx3Q0FBMkI7O0lBQzNCLHNDQUFxQjs7SUFDckIsZ0RBQTJCOztJQUMzQix3REFBOEI7O0lBQzlCLHNDQUFpQjs7SUFDakIsK0NBQWtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LCBJbnB1dCwgZm9yd2FyZFJlZiwgT25Jbml0LCBPbkNoYW5nZXNcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IE9wdGlvbiB9IGZyb20gJy4uL2Zvcm0tZW50cnkvcXVlc3Rpb24tbW9kZWxzL3NlbGVjdC1vcHRpb24nO1xuXG5pbXBvcnQgeyBEYXRhU291cmNlIH0gZnJvbSAnLi4vZm9ybS1lbnRyeS9xdWVzdGlvbi1tb2RlbHMvaW50ZXJmYWNlcy9kYXRhLXNvdXJjZSc7XG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWZlLW5nLXNlbGVjdCcsXG4gIHRlbXBsYXRlOiBgPG5nLXNlbGVjdFxuICAgICAgICAgICAgICAgICAgIChzZWFyY2hJbnB1dFRleHQpPVwiZ2V0Q2hhbmdpbmdUZXh0KCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICAobmdNb2RlbENoYW5nZSk9XCJvblZhbHVlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICBbb3B0aW9uc109XCJxdWVzdGlvbl9vcHRpb25zXCJcbiAgICAgICAgICAgICAgICAgICAgW211bHRpcGxlXT1cIm11bHRpcGxlXCIgPlxuICAgICAgICAgICAgPC9uZy1zZWxlY3Q+XG4gIGAsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQWZlTmdTZWxlY3RDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9XVxufSlcbmV4cG9ydCBjbGFzcyBBZmVOZ1NlbGVjdENvbXBvbmVudCBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gIHN1YmplY3Q6IEJlaGF2aW9yU3ViamVjdDxPcHRpb25bXT47XG4gIHN1YmplY3RPcHRpb246IEJlaGF2aW9yU3ViamVjdDxPcHRpb24+O1xuICBASW5wdXQoKSBkYXRhU291cmNlOiBEYXRhU291cmNlO1xuICBASW5wdXQoKSBtdWx0aXBsZTogYm9vbGVhbjtcbiAgQElucHV0KCkgZXh0cmFzOiBhbnk7XG4gIHF1ZXN0aW9uX29wdGlvbnM6IGFueSA9IFtdO1xuICBzZWxlY3RlZF9xdWVzdGlvbl9vcHRpb246IGFueTtcbiAgZXJyb3JzOiBhbnkgPSBbXTtcbiAgcHJvcGFnYXRlQ2hhbmdlID0gKF86IGFueSkgPT4geyB9O1xuXG4gIGdldENoYW5naW5nVGV4dChldmVudCkge1xuICAgIC8vIGNvbnNvbGUubG9nKGV2ZW50KTtcbiAgICB0aGlzLmdldERhdGEoZXZlbnQpLnN1YnNjcmliZSgob3B0aW9ucykgPT4ge1xuICAgICAgdGhpcy5xdWVzdGlvbl9vcHRpb25zID0gb3B0aW9ucztcbiAgICB9KTtcbiAgfVxuXG4gIHdyaXRlVmFsdWUob2JqOiBhbnkpOiB2b2lkIHtcblxuICB9XG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMucHJvcGFnYXRlQ2hhbmdlID0gZm47XG5cbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHsgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IGFueSkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuZXh0cmFzKSB7XG4gICAgICBpZiAodGhpcy5leHRyYXMub3JpZ2luYWxWYWx1ZSkge1xuICAgICAgICB0aGlzLnJlc29sdmVTZWxlY3RlZE9wdGlvbih0aGlzLmV4dHJhcy5vcmlnaW5hbFZhbHVlKS5zdWJzY3JpYmUoKG9wdGlvbikgPT4ge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRfcXVlc3Rpb25fb3B0aW9uID0gb3B0aW9uO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIH1cblxuICB9XG5cbiAgZ2V0RGF0YShzZWFyY2hUZXh0OiBzdHJpbmcpOiBPYnNlcnZhYmxlPE9wdGlvbltdPiB7XG5cbiAgICB0aGlzLnN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PE9wdGlvbltdPihbXSk7XG5cbiAgICBjb25zdCBPcHRpb25zT2JzZXJ2YWJsZSA9IHRoaXMuZGF0YVNvdXJjZS5zZWFyY2hPcHRpb25zKHNlYXJjaFRleHQpO1xuXG4gICAgT3B0aW9uc09ic2VydmFibGUuc3Vic2NyaWJlKFxuICAgICAgKG9wdGlvbnMpID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ29wdGlvbnMnLCBvcHRpb25zKTtcbiAgICAgICAgY29uc3QgbWFwcGVkT3B0aW9uczogT3B0aW9uW10gPSBuZXcgQXJyYXk8T3B0aW9uPigpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIG1hcHBlZE9wdGlvbnMucHVzaChuZXcgT3B0aW9uKG9wdGlvbnNbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN1YmplY3QubmV4dChtYXBwZWRPcHRpb25zKTtcbiAgICAgIH0sXG4gICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5zdWJqZWN0LmVycm9yKGVycm9yKTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgcmV0dXJuIHRoaXMuc3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIG9uVmFsdWVDaGFuZ2UoZXZlbnQpIHsgfVxuICByZXNvbHZlU2VsZWN0ZWRPcHRpb24odmFsdWU6IGFueSk6IE9ic2VydmFibGU8T3B0aW9uPiB7XG5cbiAgICB0aGlzLnN1YmplY3RPcHRpb24gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PE9wdGlvbj4obnVsbCk7XG4gICAgY29uc3QgT3B0aW9uT2JzZXJ2YWJsZSA9IHRoaXMuZGF0YVNvdXJjZS5yZXNvbHZlU2VsZWN0ZWRWYWx1ZSh2YWx1ZSk7XG5cbiAgICBPcHRpb25PYnNlcnZhYmxlLnN1YnNjcmliZShcbiAgICAgIChvcHRpb24pID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ29wdGlvbicsIG9wdGlvbik7XG4gICAgICAgIHRoaXMuc3ViamVjdE9wdGlvbi5uZXh0KG9wdGlvbik7XG4gICAgICB9LFxuICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgIHRoaXMuc3ViamVjdE9wdGlvbi5lcnJvcihlcnJvcik7XG4gICAgICB9XG4gICAgKTtcblxuICAgIHJldHVybiB0aGlzLnN1YmplY3RPcHRpb24uYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICByZXNldE9wdGlvbnMoKSB7XG4gICAgdGhpcy5zdWJqZWN0Lm5leHQobmV3IEFycmF5PE9wdGlvbj4oKSk7XG5cbiAgfVxuXG59XG4iXX0=