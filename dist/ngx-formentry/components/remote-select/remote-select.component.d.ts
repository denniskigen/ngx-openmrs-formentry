import { OnInit, EventEmitter, Renderer2 } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { DataSource } from '../../form-entry/question-models/interfaces/data-source';
export declare class RemoteSelectComponent implements OnInit, ControlValueAccessor {
    private renderer;
    placeholder: string;
    componentID: string;
    items: any[];
    value: any[];
    loading: boolean;
    searchText: string;
    notFoundMsg: string;
    done: EventEmitter<any>;
    characters: any[];
    private selectC;
    private _dataSource;
    dataSource: DataSource;
    constructor(renderer: Renderer2);
    ngOnInit(): void;
    subscribeToDataSourceDataChanges(): void;
    typed(value: any): void;
    search(value: string): void;
    restoreSelectedValue(value: any, results: any): void;
    canSearch(searchText: string): boolean;
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(): void;
    onChange(event: any): void;
    removed(event: any): void;
    selected(event: any): void;
    private propagateChange;
}
