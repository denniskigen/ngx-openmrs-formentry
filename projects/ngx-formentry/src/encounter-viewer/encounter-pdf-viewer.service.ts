import { Injectable } from '@angular/core';

import { Form } from '../form-entry/form-factory/form';
import { ObsValueAdapter } from '../form-entry/value-adapters/obs.adapter';
import { EncounterViewerService } from './encounter-viewer.service';

import * as moment_ from 'moment';
import * as _ from 'lodash';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import 'pdfmake/build/vfs_fonts.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

const moment = moment_;

@Injectable({
  providedIn: 'root'
})

export class EncounterPdfViewerService {
  public innerValue: any = '';

  constructor(
    private encounterViewerService: EncounterViewerService,
    private obsValueAdapter: ObsValueAdapter
  ) {}

  getPages(pages: any, form: Form): any[] {
    let content = [];
    for (let page of pages) {
      for (let question of form.rootNode.question.questions) {
        if (
          page.label === form.rootNode.children[question.key].question.label &&
          this.encounterViewerService.questionsAnswered(
            form.rootNode.children[question.key]
          )
        ) {
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

  getSections(sections: any, form: Form): any[] {
    let content = [];
    for (let section of sections) {
      if (this.encounterViewerService.questionsAnswered(section.node)) {
        content.push([
          {
            table: {
              widths: ['*'],
              body: [
                [{ text: section.label, style: 'tableSubheader', margin: [5, 5] }],
                [ this.getSectionData(section.section, form) ]
              ]
            },
            layout: 'noBorders'
          }
        ]);
      } else {
        content.push([{ text: '' }]);
      }
    }
    return content;
  }

  getSectionData(nodes: any, form: Form): any {
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
            const groupMembers = [];
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
          let answer = node.control.value;
          this.resolveValue(answer, form);

          if (this.innerValue) {
            questions.stack.push({
              text: [
                `${node.question.label}${
                  node.question.label.indexOf(':') > 1 ? '' : ':'
                } `,
                { text: `${this.innerValue}`, bold: true }
              ], margin: [5, 2]
            });
          }
      }
    }
    return questions;
  }

  resolveValue(value: any, form: Form, arrayElement?: boolean): any {
    if (value !== this.innerValue) {
      if (this.isUuid(value)) {
        const val = this.encounterViewerService.resolveSelectedValueFromSchema(value, form.schema);
        if (!arrayElement) {
          if (val) {
            this.innerValue = val.toUpperCase();
          } else {
            this.innerValue = value;
          }
        } else {
          return val;
        }
      } else if (_.isArray(value)) {
        const arr = [];
        _.forEach(value, elem => {
          arr.push(this.resolveValue(elem, form, true));
        });
        this.innerValue = arr;
      } else if (this.isDate(value)) {
        if (!arrayElement) {
          this.innerValue = this.encounterViewerService.convertTime(value);
        } else {
          return this.encounterViewerService.convertTime(value);
        }
      } else if (typeof value === 'object') {
        const values = [];
        let result = Object.keys(value).map((key) => [key, value[key]]);

        values.push(result);
        this.innerValue = values;
      } else {
        if (!arrayElement) {
          this.innerValue = value;
        } else {
          return value;
        }
      }
    }
  }

  generatePdfDefinition(form: Form): any {
    const docDefinition = {
      content: this.getPages(
        this.obsValueAdapter.traverse(form.rootNode),
        form
      ),
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

  displayPdf(form) {
    let pdf = pdfMake;
    pdf.vfs = pdfFonts.pdfMake.vfs;
    let docDefinition = this.generatePdfDefinition(form);

    docDefinition.footer = {
      columns: [
        {
          stack: [
            {
              text:
                'Note: Confidentiality is one of the core duties of all medical practitioners.',
              style: 'confidential'
            },
            {
              text:
                ` Patients' personal health information should be kept private.`,
              style: 'confidential'
            }
          ]
        }
      ]
    };

    var win = window.open('', '_blank');
    pdf.createPdf(docDefinition).open({}, win);
  }

  isDate(val: any) {
    return moment(val, moment.ISO_8601, true).isValid();
  }

  isUuid(value: string) {
    // Consider matching against a uuid regexp
    return (value.length === 36 && value.indexOf(' ') === -1 && value.indexOf('.') === -1);
  }
}
