import { Form } from '../form-entry/form-factory/form';
import { ObsValueAdapter } from '../form-entry/value-adapters/obs.adapter';
import { EncounterViewerService } from './encounter-viewer.service';
import 'pdfmake/build/vfs_fonts.js';
export declare class EncounterPdfViewerService {
    private encounterViewerService;
    private obsValueAdapter;
    innerValue: any;
    constructor(encounterViewerService: EncounterViewerService, obsValueAdapter: ObsValueAdapter);
    getPages(pages: any, form: Form): any[];
    getSections(sections: any, form: Form): any[];
    getSectionData(nodes: any, form: Form): any;
    resolveValue(value: any, form: Form, arrayElement?: boolean): any;
    generatePdfDefinition(form: Form): any;
    displayPdf(form: any): void;
    isDate(val: any): boolean;
    isUuid(value: string): boolean;
}
