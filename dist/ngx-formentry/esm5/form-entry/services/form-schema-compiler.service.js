/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
var FormSchemaCompiler = /** @class */ (function () {
    function FormSchemaCompiler() {
    }
    /**
     * @param {?} formSchema
     * @param {?} referencedComponents
     * @return {?}
     */
    FormSchemaCompiler.prototype.compileFormSchema = /**
     * @param {?} formSchema
     * @param {?} referencedComponents
     * @return {?}
     */
    function (formSchema, referencedComponents) {
        // get all referenced forms
        /** @type {?} */
        var refForms = this.getReferencedForms(formSchema, referencedComponents);
        if (_.isEmpty(refForms)) {
            return formSchema;
        }
        // get all place-holders from the form schema
        /** @type {?} */
        var placeHolders = this.getAllPlaceholderObjects(formSchema);
        if (_.isEmpty(placeHolders)) {
            return formSchema;
        }
        // replace all placeHolders
        this.replaceAllPlaceholdersWithActualObjects(refForms, placeHolders);
        return formSchema;
    };
    /**
     * @private
     * @param {?} schemaArray
     * @param {?} nameOfSchema
     * @return {?}
     */
    FormSchemaCompiler.prototype.findSchemaByName = /**
     * @private
     * @param {?} schemaArray
     * @param {?} nameOfSchema
     * @return {?}
     */
    function (schemaArray, nameOfSchema) {
        if (_.isEmpty(schemaArray) || _.isEmpty(nameOfSchema)) {
            return;
        }
        /** @type {?} */
        var foundSchema = {};
        _.each(schemaArray, function (schema) {
            if (schema.name === nameOfSchema) {
                foundSchema = schema;
            }
        });
        return foundSchema;
    };
    /**
     * @private
     * @param {?} schema
     * @param {?} pageLabel
     * @return {?}
     */
    FormSchemaCompiler.prototype.getPageInSchemaByLabel = /**
     * @private
     * @param {?} schema
     * @param {?} pageLabel
     * @return {?}
     */
    function (schema, pageLabel) {
        if (_.isEmpty(schema) || _.isEmpty(pageLabel)) {
            return;
        }
        /** @type {?} */
        var foundPage = {};
        _.each(schema.pages, function (page) {
            if (page.label === pageLabel) {
                foundPage = page;
            }
        });
        return foundPage;
    };
    /**
     * @private
     * @param {?} schema
     * @param {?} pageLabel
     * @param {?} sectionLabel
     * @return {?}
     */
    FormSchemaCompiler.prototype.getSectionInSchemaByPageLabelBySectionLabel = /**
     * @private
     * @param {?} schema
     * @param {?} pageLabel
     * @param {?} sectionLabel
     * @return {?}
     */
    function (schema, pageLabel, sectionLabel) {
        if (_.isEmpty(schema) || _.isEmpty(pageLabel) || _.isEmpty(sectionLabel)) {
            return;
        }
        /** @type {?} */
        var foundPage = this.getPageInSchemaByLabel(schema, pageLabel);
        if (_.isEmpty(foundPage)) {
            return;
        }
        /** @type {?} */
        var foundSection = {};
        _.each(foundPage.sections, function (section) {
            if (section.label === sectionLabel) {
                foundSection = section;
            }
        });
        return foundSection;
    };
    /**
     * @private
     * @param {?} schema
     * @param {?} questionId
     * @return {?}
     */
    FormSchemaCompiler.prototype.getQuestionByIdInSchema = /**
     * @private
     * @param {?} schema
     * @param {?} questionId
     * @return {?}
     */
    function (schema, questionId) {
        if (_.isEmpty(schema) || _.isEmpty(questionId)) {
            return;
        }
        if (Array.isArray(schema)) {
            /** @type {?} */
            var question = void 0;
            for (var i = 0; i < schema.length; i++) {
                if (!_.isEmpty(schema[i])) {
                    question = this.getQuestionByIdInSchema(schema[i], questionId);
                }
                if (!_.isEmpty(question)) {
                    break;
                }
            }
            return question;
        }
        else if (typeof schema === 'object') {
            if (this.isQuestionObjectWithId(schema, questionId)) {
                return schema;
            }
            else if (this.isSchemaSubObjectExpandable(schema)) {
                /** @type {?} */
                var toExpand = (schema.pages || schema.sections || schema.questions);
                return this.getQuestionByIdInSchema(toExpand, questionId);
            }
            else {
                return;
            }
        }
        else {
            return;
        }
    };
    /**
     * @private
     * @param {?} schema
     * @param {?} questionId
     * @return {?}
     */
    FormSchemaCompiler.prototype.getQuestionsArrayByQuestionIdInSchema = /**
     * @private
     * @param {?} schema
     * @param {?} questionId
     * @return {?}
     */
    function (schema, questionId) {
        if (_.isEmpty(schema) || _.isEmpty(questionId)) {
            return;
        }
        return this.getQuestionsArrayByQuestionId(schema, schema, questionId);
    };
    /**
     * @private
     * @param {?} parent
     * @param {?} object
     * @param {?} questionId
     * @return {?}
     */
    FormSchemaCompiler.prototype.getQuestionsArrayByQuestionId = /**
     * @private
     * @param {?} parent
     * @param {?} object
     * @param {?} questionId
     * @return {?}
     */
    function (parent, object, questionId) {
        if (Array.isArray(object)) {
            /** @type {?} */
            var returnedValue = void 0;
            for (var i = 0; i < object.length; i++) {
                if (!_.isEmpty(object[i])) {
                    returnedValue = this.getQuestionsArrayByQuestionId(object, object[i], questionId);
                }
                if (!_.isEmpty(returnedValue)) {
                    break;
                }
            }
            return returnedValue;
        }
        else if (typeof object === 'object') {
            if (this.isQuestionObjectWithId(object, questionId)) {
                return parent;
            }
            else if (this.isSchemaSubObjectExpandable(object)) {
                /** @type {?} */
                var toExpand = (object.pages || object.sections || object.questions);
                return this.getQuestionsArrayByQuestionId(toExpand, toExpand, questionId);
            }
            else {
                return;
            }
        }
        else {
            return;
        }
    };
    // object is page or section or question
    // object is page or section or question
    /**
     * @private
     * @param {?} object
     * @return {?}
     */
    FormSchemaCompiler.prototype.isSchemaSubObjectExpandable = 
    // object is page or section or question
    /**
     * @private
     * @param {?} object
     * @return {?}
     */
    function (object) {
        if (typeof object === 'object') {
            /** @type {?} */
            var objectKeys = Object.keys(object);
            if (_.includes(objectKeys, 'pages') ||
                _.includes(objectKeys, 'sections') ||
                _.includes(objectKeys, 'questions')) {
                return true;
            }
        }
        return false;
    };
    /**
     * @private
     * @param {?} object
     * @param {?} id
     * @return {?}
     */
    FormSchemaCompiler.prototype.isQuestionObjectWithId = /**
     * @private
     * @param {?} object
     * @param {?} id
     * @return {?}
     */
    function (object, id) {
        return object['id'] === id;
    };
    /**
     * @private
     * @param {?} schema
     * @return {?}
     */
    FormSchemaCompiler.prototype.getAllPlaceholderObjects = /**
     * @private
     * @param {?} schema
     * @return {?}
     */
    function (schema) {
        /** @type {?} */
        var referencedObjects = [];
        this.extractPlaceholderObjects(schema, referencedObjects);
        return referencedObjects;
    };
    /**
     * @private
     * @param {?} subSchema
     * @param {?} objectsArray
     * @return {?}
     */
    FormSchemaCompiler.prototype.extractPlaceholderObjects = /**
     * @private
     * @param {?} subSchema
     * @param {?} objectsArray
     * @return {?}
     */
    function (subSchema, objectsArray) {
        if (_.isEmpty(subSchema)) {
            return;
        }
        if (Array.isArray(subSchema)) {
            for (var i = 0; i < subSchema.length; i++) {
                if (!_.isEmpty(subSchema[i])) {
                    this.extractPlaceholderObjects(subSchema[i], objectsArray);
                }
            }
        }
        else if (typeof subSchema === 'object') {
            if (!_.isEmpty(subSchema.reference)) {
                objectsArray.push(subSchema);
            }
            else if (this.isSchemaSubObjectExpandable(subSchema)) {
                /** @type {?} */
                var toExpand = (subSchema.pages || subSchema.sections || subSchema.questions);
                this.extractPlaceholderObjects(toExpand, objectsArray);
            }
        }
    };
    /**
     * @private
     * @param {?} placeHolderObject
     * @param {?} referenceObject
     * @return {?}
     */
    FormSchemaCompiler.prototype.fillPlaceholderObject = /**
     * @private
     * @param {?} placeHolderObject
     * @param {?} referenceObject
     * @return {?}
     */
    function (placeHolderObject, referenceObject) {
        for (var member in referenceObject) {
            if (_.isEmpty(placeHolderObject[member])) {
                placeHolderObject[member] = referenceObject[member];
            }
        }
        return placeHolderObject;
    };
    /**
     * @private
     * @param {?} keyValReferencedForms
     * @param {?} placeHoldersArray
     * @return {?}
     */
    FormSchemaCompiler.prototype.replaceAllPlaceholdersWithActualObjects = /**
     * @private
     * @param {?} keyValReferencedForms
     * @param {?} placeHoldersArray
     * @return {?}
     */
    function (keyValReferencedForms, placeHoldersArray) {
        var _this = this;
        _.each(placeHoldersArray, function (placeHolder) {
            /** @type {?} */
            var referencedObject = _this.getReferencedObject(placeHolder.reference, keyValReferencedForms);
            if (_.isEmpty(referencedObject)) {
                console.error('Form compile: Error finding referenced object', placeHolder.reference);
            }
            else {
                placeHolder = _this.fillPlaceholderObject(placeHolder, referencedObject);
                placeHolder = _this.removeExcludedQuestionsFromPlaceholder(placeHolder);
                delete placeHolder['reference'];
            }
        });
        return placeHoldersArray;
    };
    /**
     * @private
     * @param {?} array
     * @param {?} object
     * @return {?}
     */
    FormSchemaCompiler.prototype.removeObjectFromArray = /**
     * @private
     * @param {?} array
     * @param {?} object
     * @return {?}
     */
    function (array, object) {
        /** @type {?} */
        var indexOfObject = array.indexOf(object);
        if (indexOfObject === -1) {
            return;
        }
        array.splice(indexOfObject, 1);
    };
    /**
     * @private
     * @param {?} placeHolder
     * @return {?}
     */
    FormSchemaCompiler.prototype.removeExcludedQuestionsFromPlaceholder = /**
     * @private
     * @param {?} placeHolder
     * @return {?}
     */
    function (placeHolder) {
        var _this = this;
        if (Array.isArray(placeHolder.reference.excludeQuestions)) {
            _.each(placeHolder.reference.excludeQuestions, function (excludedQuestionId) {
                /** @type {?} */
                var questionsArray = _this.getQuestionsArrayByQuestionIdInSchema(placeHolder, excludedQuestionId);
                if (!Array.isArray(questionsArray)) {
                    return;
                }
                /** @type {?} */
                var question = _this.getQuestionByIdInSchema(questionsArray, excludedQuestionId);
                _this.removeObjectFromArray(questionsArray, question);
            });
        }
        return placeHolder;
    };
    /**
     * @private
     * @param {?} referenceData
     * @param {?} keyValReferencedForms
     * @return {?}
     */
    FormSchemaCompiler.prototype.getReferencedObject = /**
     * @private
     * @param {?} referenceData
     * @param {?} keyValReferencedForms
     * @return {?}
     */
    function (referenceData, keyValReferencedForms) {
        if (_.isEmpty(referenceData.form)) {
            console.error('Form compile: reference missing form attribute', referenceData);
            return;
        }
        if (_.isEmpty(keyValReferencedForms[referenceData.form])) {
            console.error('Form compile: referenced form alias not found', referenceData);
            return;
        }
        if (!_.isEmpty(referenceData.questionId)) {
            return this.getQuestionByIdInSchema(keyValReferencedForms[referenceData.form], referenceData.questionId);
        }
        if (!_.isEmpty(referenceData.page) && !_.isEmpty(referenceData.section)) {
            return this.getSectionInSchemaByPageLabelBySectionLabel(keyValReferencedForms[referenceData.form], referenceData.page, referenceData.section);
        }
        if (!_.isEmpty(referenceData.page)) {
            return this.getPageInSchemaByLabel(keyValReferencedForms[referenceData.form], referenceData.page);
        }
        console.error('Form compile: Unsupported reference type', referenceData.reference);
    };
    /**
     * @private
     * @param {?} formSchema
     * @param {?} formSchemasLookupArray
     * @return {?}
     */
    FormSchemaCompiler.prototype.getReferencedForms = /**
     * @private
     * @param {?} formSchema
     * @param {?} formSchemasLookupArray
     * @return {?}
     */
    function (formSchema, formSchemasLookupArray) {
        var _this = this;
        /** @type {?} */
        var referencedForms = formSchema.referencedForms;
        if (_.isEmpty(referencedForms)) {
            return;
        }
        /** @type {?} */
        var keyValReferencedForms = {};
        _.each(referencedForms, function (reference) {
            keyValReferencedForms[reference.alias] =
                _this.findSchemaByName(formSchemasLookupArray, reference.formName);
        });
        return keyValReferencedForms;
    };
    FormSchemaCompiler.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    FormSchemaCompiler.ctorParameters = function () { return []; };
    return FormSchemaCompiler;
}());
export { FormSchemaCompiler };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1zY2hlbWEtY29tcGlsZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1vcGVubXJzLWZvcm1lbnRyeS8iLCJzb3VyY2VzIjpbImZvcm0tZW50cnkvc2VydmljZXMvZm9ybS1zY2hlbWEtY29tcGlsZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUU1QjtJQUVFO0lBRUEsQ0FBQzs7Ozs7O0lBRU0sOENBQWlCOzs7OztJQUF4QixVQUF5QixVQUFrQixFQUFFLG9CQUFnQzs7O1lBRXJFLFFBQVEsR0FBVyxJQUFJLENBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLG9CQUFvQixDQUFDO1FBQ2xGLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUFFLE9BQU8sVUFBVSxDQUFDO1NBQUU7OztZQUd6QyxZQUFZLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQztRQUM5RCxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFBRSxPQUFPLFVBQVUsQ0FBQztTQUFFO1FBRW5ELDJCQUEyQjtRQUMzQixJQUFJLENBQUMsdUNBQXVDLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3JFLE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7Ozs7Ozs7SUFHTyw2Q0FBZ0I7Ozs7OztJQUF4QixVQUF5QixXQUF1QixFQUFFLFlBQW9CO1FBQ3BFLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQUUsT0FBTztTQUFFOztZQUM5RCxXQUFXLEdBQVEsRUFBRTtRQUN6QixDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxVQUFD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QUE3UEQsSUE2UEM7U0E1UFksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRm9ybVNjaGVtYUNvbXBpbGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgfVxuXG4gIHB1YmxpYyBjb21waWxlRm9ybVNjaGVtYShmb3JtU2NoZW1hOiBPYmplY3QsIHJlZmVyZW5jZWRDb21wb25lbnRzOiBBcnJheTxhbnk+KTogT2JqZWN0IHtcbiAgICAvLyBnZXQgYWxsIHJlZmVyZW5jZWQgZm9ybXNcbiAgICBjb25zdCByZWZGb3JtczogT2JqZWN0ID0gdGhpcy5nZXRSZWZlcmVuY2VkRm9ybXMoZm9ybVNjaGVtYSwgcmVmZXJlbmNlZENvbXBvbmVudHMpO1xuICAgIGlmIChfLmlzRW1wdHkocmVmRm9ybXMpKSB7IHJldHVybiBmb3JtU2NoZW1hOyB9XG5cbiAgICAvLyBnZXQgYWxsIHBsYWNlLWhvbGRlcnMgZnJvbSB0aGUgZm9ybSBzY2hlbWFcbiAgICBjb25zdCBwbGFjZUhvbGRlcnMgPSB0aGlzLmdldEFsbFBsYWNlaG9sZGVyT2JqZWN0cyhmb3JtU2NoZW1hKTtcbiAgICBpZiAoXy5pc0VtcHR5KHBsYWNlSG9sZGVycykpIHsgcmV0dXJuIGZvcm1TY2hlbWE7IH1cblxuICAgIC8vIHJlcGxhY2UgYWxsIHBsYWNlSG9sZGVyc1xuICAgIHRoaXMucmVwbGFjZUFsbFBsYWNlaG9sZGVyc1dpdGhBY3R1YWxPYmplY3RzKHJlZkZvcm1zLCBwbGFjZUhvbGRlcnMpO1xuICAgIHJldHVybiBmb3JtU2NoZW1hO1xuICB9XG5cblxuICBwcml2YXRlIGZpbmRTY2hlbWFCeU5hbWUoc2NoZW1hQXJyYXk6IEFycmF5PGFueT4sIG5hbWVPZlNjaGVtYTogc3RyaW5nKTogT2JqZWN0IHtcbiAgICBpZiAoXy5pc0VtcHR5KHNjaGVtYUFycmF5KSB8fCBfLmlzRW1wdHkobmFtZU9mU2NoZW1hKSkgeyByZXR1cm47IH1cbiAgICBsZXQgZm91bmRTY2hlbWE6IGFueSA9IHt9O1xuICAgIF8uZWFjaChzY2hlbWFBcnJheSwgKHNjaGVtYTogYW55KSA9PiB7XG4gICAgICBpZiAoc2NoZW1hLm5hbWUgPT09IG5hbWVPZlNjaGVtYSkge1xuICAgICAgICBmb3VuZFNjaGVtYSA9IHNjaGVtYTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZm91bmRTY2hlbWE7XG4gIH1cblxuICBwcml2YXRlIGdldFBhZ2VJblNjaGVtYUJ5TGFiZWwoc2NoZW1hOiBhbnksIHBhZ2VMYWJlbDogc3RyaW5nKTogT2JqZWN0IHtcbiAgICBpZiAoXy5pc0VtcHR5KHNjaGVtYSkgfHwgXy5pc0VtcHR5KHBhZ2VMYWJlbCkpIHsgcmV0dXJuOyB9XG4gICAgbGV0IGZvdW5kUGFnZTogT2JqZWN0ID0ge307XG4gICAgXy5lYWNoKHNjaGVtYS5wYWdlcywgKHBhZ2UpID0+IHtcbiAgICAgIGlmIChwYWdlLmxhYmVsID09PSBwYWdlTGFiZWwpIHtcbiAgICAgICAgZm91bmRQYWdlID0gcGFnZTtcbiAgICAgIH1cbiAgICB9XG4gICAgKTtcbiAgICByZXR1cm4gZm91bmRQYWdlO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRTZWN0aW9uSW5TY2hlbWFCeVBhZ2VMYWJlbEJ5U2VjdGlvbkxhYmVsXG4gICAgKHNjaGVtYTogT2JqZWN0LCBwYWdlTGFiZWw6IHN0cmluZywgc2VjdGlvbkxhYmVsOiBzdHJpbmcpOiBPYmplY3Qge1xuICAgIGlmIChfLmlzRW1wdHkoc2NoZW1hKSB8fCBfLmlzRW1wdHkocGFnZUxhYmVsKSB8fCBfLmlzRW1wdHkoc2VjdGlvbkxhYmVsKSkgeyByZXR1cm47IH1cbiAgICBjb25zdCBmb3VuZFBhZ2U6IGFueSA9IHRoaXMuZ2V0UGFnZUluU2NoZW1hQnlMYWJlbChzY2hlbWEsIHBhZ2VMYWJlbCk7XG4gICAgaWYgKF8uaXNFbXB0eShmb3VuZFBhZ2UpKSB7IHJldHVybjsgfVxuICAgIGxldCBmb3VuZFNlY3Rpb246IE9iamVjdCA9IHt9O1xuICAgIF8uZWFjaChmb3VuZFBhZ2Uuc2VjdGlvbnMsIChzZWN0aW9uKSA9PiB7XG4gICAgICBpZiAoc2VjdGlvbi5sYWJlbCA9PT0gc2VjdGlvbkxhYmVsKSB7XG4gICAgICAgIGZvdW5kU2VjdGlvbiA9IHNlY3Rpb247XG4gICAgICB9XG4gICAgfVxuICAgICk7XG4gICAgcmV0dXJuIGZvdW5kU2VjdGlvbjtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UXVlc3Rpb25CeUlkSW5TY2hlbWEoc2NoZW1hOiBhbnksIHF1ZXN0aW9uSWQ6IHN0cmluZyk6IEFycmF5PGFueT4ge1xuICAgIGlmIChfLmlzRW1wdHkoc2NoZW1hKSB8fCBfLmlzRW1wdHkocXVlc3Rpb25JZCkpIHsgcmV0dXJuOyB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc2NoZW1hKSkge1xuICAgICAgbGV0IHF1ZXN0aW9uOiBBcnJheTxhbnk+O1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzY2hlbWEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKCFfLmlzRW1wdHkoc2NoZW1hW2ldKSkge1xuICAgICAgICAgIHF1ZXN0aW9uID0gdGhpcy5nZXRRdWVzdGlvbkJ5SWRJblNjaGVtYShzY2hlbWFbaV0sIHF1ZXN0aW9uSWQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghXy5pc0VtcHR5KHF1ZXN0aW9uKSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcXVlc3Rpb247XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc2NoZW1hID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKHRoaXMuaXNRdWVzdGlvbk9iamVjdFdpdGhJZChzY2hlbWEsIHF1ZXN0aW9uSWQpKSB7XG4gICAgICAgIHJldHVybiBzY2hlbWE7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNTY2hlbWFTdWJPYmplY3RFeHBhbmRhYmxlKHNjaGVtYSkpIHtcbiAgICAgICAgY29uc3QgdG9FeHBhbmQgPSAoc2NoZW1hLnBhZ2VzIHx8IHNjaGVtYS5zZWN0aW9ucyB8fCBzY2hlbWEucXVlc3Rpb25zKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UXVlc3Rpb25CeUlkSW5TY2hlbWEodG9FeHBhbmQsIHF1ZXN0aW9uSWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRRdWVzdGlvbnNBcnJheUJ5UXVlc3Rpb25JZEluU2NoZW1hKHNjaGVtYTogYW55LCBxdWVzdGlvbklkOiBzdHJpbmcpOiBBcnJheTxhbnk+IHtcbiAgICBpZiAoXy5pc0VtcHR5KHNjaGVtYSkgfHwgXy5pc0VtcHR5KHF1ZXN0aW9uSWQpKSB7IHJldHVybjsgfVxuICAgIHJldHVybiB0aGlzLmdldFF1ZXN0aW9uc0FycmF5QnlRdWVzdGlvbklkKHNjaGVtYSwgc2NoZW1hLCBxdWVzdGlvbklkKTtcbiAgfVxuXG5cbiAgcHJpdmF0ZSBnZXRRdWVzdGlvbnNBcnJheUJ5UXVlc3Rpb25JZChwYXJlbnQ6IGFueSwgb2JqZWN0OiBhbnksIHF1ZXN0aW9uSWQ6IHN0cmluZyk6IEFycmF5PGFueT4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcbiAgICAgIGxldCByZXR1cm5lZFZhbHVlOiBBcnJheTxhbnk+O1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmplY3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKCFfLmlzRW1wdHkob2JqZWN0W2ldKSkge1xuICAgICAgICAgIHJldHVybmVkVmFsdWUgPSB0aGlzLmdldFF1ZXN0aW9uc0FycmF5QnlRdWVzdGlvbklkKG9iamVjdCwgb2JqZWN0W2ldLCBxdWVzdGlvbklkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIV8uaXNFbXB0eShyZXR1cm5lZFZhbHVlKSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXR1cm5lZFZhbHVlO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmICh0aGlzLmlzUXVlc3Rpb25PYmplY3RXaXRoSWQob2JqZWN0LCBxdWVzdGlvbklkKSkge1xuICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzU2NoZW1hU3ViT2JqZWN0RXhwYW5kYWJsZShvYmplY3QpKSB7XG4gICAgICAgIGNvbnN0IHRvRXhwYW5kID0gKG9iamVjdC5wYWdlcyB8fCBvYmplY3Quc2VjdGlvbnMgfHwgb2JqZWN0LnF1ZXN0aW9ucyk7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFF1ZXN0aW9uc0FycmF5QnlRdWVzdGlvbklkKHRvRXhwYW5kLCB0b0V4cGFuZCwgcXVlc3Rpb25JZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICAvLyBvYmplY3QgaXMgcGFnZSBvciBzZWN0aW9uIG9yIHF1ZXN0aW9uXG4gIHByaXZhdGUgaXNTY2hlbWFTdWJPYmplY3RFeHBhbmRhYmxlKG9iamVjdDogT2JqZWN0KTogQm9vbGVhbiB7XG4gICAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnKSB7XG4gICAgICBjb25zdCBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTtcbiAgICAgIGlmIChfLmluY2x1ZGVzKG9iamVjdEtleXMsICdwYWdlcycpIHx8XG4gICAgICAgIF8uaW5jbHVkZXMob2JqZWN0S2V5cywgJ3NlY3Rpb25zJykgfHxcbiAgICAgICAgXy5pbmNsdWRlcyhvYmplY3RLZXlzLCAncXVlc3Rpb25zJykpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgaXNRdWVzdGlvbk9iamVjdFdpdGhJZChvYmplY3Q6IE9iamVjdCwgaWQ6IGFueSk6IEJvb2xlYW4ge1xuICAgIHJldHVybiBvYmplY3RbJ2lkJ10gPT09IGlkO1xuXG4gIH1cblxuICBwcml2YXRlIGdldEFsbFBsYWNlaG9sZGVyT2JqZWN0cyhzY2hlbWE6IE9iamVjdCk6IEFycmF5PGFueT4ge1xuICAgIGNvbnN0IHJlZmVyZW5jZWRPYmplY3RzOiBBcnJheTxhbnk+ID0gW107XG4gICAgdGhpcy5leHRyYWN0UGxhY2Vob2xkZXJPYmplY3RzKHNjaGVtYSwgcmVmZXJlbmNlZE9iamVjdHMpO1xuICAgIHJldHVybiByZWZlcmVuY2VkT2JqZWN0cztcbiAgfVxuXG4gIHByaXZhdGUgZXh0cmFjdFBsYWNlaG9sZGVyT2JqZWN0cyhzdWJTY2hlbWE6IGFueSwgb2JqZWN0c0FycmF5OiBBcnJheTxPYmplY3Q+KTogdm9pZCB7XG4gICAgaWYgKF8uaXNFbXB0eShzdWJTY2hlbWEpKSB7IHJldHVybjsgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KHN1YlNjaGVtYSkpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3ViU2NoZW1hLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghXy5pc0VtcHR5KHN1YlNjaGVtYVtpXSkpIHtcbiAgICAgICAgICB0aGlzLmV4dHJhY3RQbGFjZWhvbGRlck9iamVjdHMoc3ViU2NoZW1hW2ldLCBvYmplY3RzQXJyYXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc3ViU2NoZW1hID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKCFfLmlzRW1wdHkoc3ViU2NoZW1hLnJlZmVyZW5jZSkpIHtcbiAgICAgICAgb2JqZWN0c0FycmF5LnB1c2goc3ViU2NoZW1hKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc1NjaGVtYVN1Yk9iamVjdEV4cGFuZGFibGUoc3ViU2NoZW1hKSkge1xuICAgICAgICBjb25zdCB0b0V4cGFuZCA9IChzdWJTY2hlbWEucGFnZXMgfHwgc3ViU2NoZW1hLnNlY3Rpb25zIHx8IHN1YlNjaGVtYS5xdWVzdGlvbnMpO1xuICAgICAgICB0aGlzLmV4dHJhY3RQbGFjZWhvbGRlck9iamVjdHModG9FeHBhbmQsIG9iamVjdHNBcnJheSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBmaWxsUGxhY2Vob2xkZXJPYmplY3QocGxhY2VIb2xkZXJPYmplY3Q6IE9iamVjdCwgcmVmZXJlbmNlT2JqZWN0OiBPYmplY3QpOiBPYmplY3Qge1xuICAgIGZvciAoY29uc3QgbWVtYmVyIGluIHJlZmVyZW5jZU9iamVjdCkge1xuICAgICAgaWYgKF8uaXNFbXB0eShwbGFjZUhvbGRlck9iamVjdFttZW1iZXJdKSkge1xuICAgICAgICBwbGFjZUhvbGRlck9iamVjdFttZW1iZXJdID0gcmVmZXJlbmNlT2JqZWN0W21lbWJlcl07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwbGFjZUhvbGRlck9iamVjdDtcbiAgfVxuXG4gIHByaXZhdGUgcmVwbGFjZUFsbFBsYWNlaG9sZGVyc1dpdGhBY3R1YWxPYmplY3RzXG4gICAgKGtleVZhbFJlZmVyZW5jZWRGb3JtczogT2JqZWN0LCBwbGFjZUhvbGRlcnNBcnJheTogQXJyYXk8YW55Pik6IEFycmF5PGFueT4ge1xuICAgIF8uZWFjaChwbGFjZUhvbGRlcnNBcnJheSwgKHBsYWNlSG9sZGVyKSA9PiB7XG4gICAgICBjb25zdCByZWZlcmVuY2VkT2JqZWN0OiBPYmplY3QgPVxuICAgICAgICB0aGlzLmdldFJlZmVyZW5jZWRPYmplY3QocGxhY2VIb2xkZXIucmVmZXJlbmNlLCBrZXlWYWxSZWZlcmVuY2VkRm9ybXMpO1xuXG4gICAgICBpZiAoXy5pc0VtcHR5KHJlZmVyZW5jZWRPYmplY3QpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Zvcm0gY29tcGlsZTogRXJyb3IgZmluZGluZyByZWZlcmVuY2VkIG9iamVjdCcsIHBsYWNlSG9sZGVyLnJlZmVyZW5jZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwbGFjZUhvbGRlciA9IHRoaXMuZmlsbFBsYWNlaG9sZGVyT2JqZWN0KHBsYWNlSG9sZGVyLCByZWZlcmVuY2VkT2JqZWN0KTtcbiAgICAgICAgcGxhY2VIb2xkZXIgPSB0aGlzLnJlbW92ZUV4Y2x1ZGVkUXVlc3Rpb25zRnJvbVBsYWNlaG9sZGVyKHBsYWNlSG9sZGVyKTtcbiAgICAgICAgZGVsZXRlIHBsYWNlSG9sZGVyWydyZWZlcmVuY2UnXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcGxhY2VIb2xkZXJzQXJyYXk7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZU9iamVjdEZyb21BcnJheShhcnJheTogQXJyYXk8YW55Piwgb2JqZWN0OiBPYmplY3QpOiB2b2lkIHtcbiAgICBjb25zdCBpbmRleE9mT2JqZWN0ID0gYXJyYXkuaW5kZXhPZihvYmplY3QpO1xuICAgIGlmIChpbmRleE9mT2JqZWN0ID09PSAtMSkgeyByZXR1cm47IH1cblxuICAgIGFycmF5LnNwbGljZShpbmRleE9mT2JqZWN0LCAxKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlRXhjbHVkZWRRdWVzdGlvbnNGcm9tUGxhY2Vob2xkZXIocGxhY2VIb2xkZXI6IGFueSk6IE9iamVjdCB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGxhY2VIb2xkZXIucmVmZXJlbmNlLmV4Y2x1ZGVRdWVzdGlvbnMpKSB7XG4gICAgICBfLmVhY2gocGxhY2VIb2xkZXIucmVmZXJlbmNlLmV4Y2x1ZGVRdWVzdGlvbnMsIChleGNsdWRlZFF1ZXN0aW9uSWQpID0+IHtcbiAgICAgICAgY29uc3QgcXVlc3Rpb25zQXJyYXk6IEFycmF5PGFueT4gPSB0aGlzLmdldFF1ZXN0aW9uc0FycmF5QnlRdWVzdGlvbklkSW5TY2hlbWEoXG4gICAgICAgICAgcGxhY2VIb2xkZXIsIGV4Y2x1ZGVkUXVlc3Rpb25JZCk7XG5cbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHF1ZXN0aW9uc0FycmF5KSkgeyByZXR1cm47IH1cbiAgICAgICAgY29uc3QgcXVlc3Rpb24gPSB0aGlzLmdldFF1ZXN0aW9uQnlJZEluU2NoZW1hKHF1ZXN0aW9uc0FycmF5LCBleGNsdWRlZFF1ZXN0aW9uSWQpO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlT2JqZWN0RnJvbUFycmF5KHF1ZXN0aW9uc0FycmF5LCBxdWVzdGlvbik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHBsYWNlSG9sZGVyO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRSZWZlcmVuY2VkT2JqZWN0KHJlZmVyZW5jZURhdGE6IGFueSwga2V5VmFsUmVmZXJlbmNlZEZvcm1zOiBPYmplY3QpOiBPYmplY3Qge1xuICAgIGlmIChfLmlzRW1wdHkocmVmZXJlbmNlRGF0YS5mb3JtKSkge1xuICAgICAgY29uc29sZS5lcnJvcignRm9ybSBjb21waWxlOiByZWZlcmVuY2UgbWlzc2luZyBmb3JtIGF0dHJpYnV0ZScsIHJlZmVyZW5jZURhdGEpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoXy5pc0VtcHR5KGtleVZhbFJlZmVyZW5jZWRGb3Jtc1tyZWZlcmVuY2VEYXRhLmZvcm1dKSkge1xuICAgICAgY29uc29sZS5lcnJvcignRm9ybSBjb21waWxlOiByZWZlcmVuY2VkIGZvcm0gYWxpYXMgbm90IGZvdW5kJywgcmVmZXJlbmNlRGF0YSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghXy5pc0VtcHR5KHJlZmVyZW5jZURhdGEucXVlc3Rpb25JZCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFF1ZXN0aW9uQnlJZEluU2NoZW1hKFxuICAgICAgICBrZXlWYWxSZWZlcmVuY2VkRm9ybXNbcmVmZXJlbmNlRGF0YS5mb3JtXSxcbiAgICAgICAgcmVmZXJlbmNlRGF0YS5xdWVzdGlvbklkKTtcbiAgICB9XG5cbiAgICBpZiAoIV8uaXNFbXB0eShyZWZlcmVuY2VEYXRhLnBhZ2UpICYmICFfLmlzRW1wdHkocmVmZXJlbmNlRGF0YS5zZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0U2VjdGlvbkluU2NoZW1hQnlQYWdlTGFiZWxCeVNlY3Rpb25MYWJlbChcbiAgICAgICAga2V5VmFsUmVmZXJlbmNlZEZvcm1zW3JlZmVyZW5jZURhdGEuZm9ybV0sXG4gICAgICAgIHJlZmVyZW5jZURhdGEucGFnZSxcbiAgICAgICAgcmVmZXJlbmNlRGF0YS5zZWN0aW9uXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoIV8uaXNFbXB0eShyZWZlcmVuY2VEYXRhLnBhZ2UpKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRQYWdlSW5TY2hlbWFCeUxhYmVsKFxuICAgICAgICBrZXlWYWxSZWZlcmVuY2VkRm9ybXNbcmVmZXJlbmNlRGF0YS5mb3JtXSxcbiAgICAgICAgcmVmZXJlbmNlRGF0YS5wYWdlXG4gICAgICApO1xuICAgIH1cbiAgICBjb25zb2xlLmVycm9yKCdGb3JtIGNvbXBpbGU6IFVuc3VwcG9ydGVkIHJlZmVyZW5jZSB0eXBlJywgcmVmZXJlbmNlRGF0YS5yZWZlcmVuY2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRSZWZlcmVuY2VkRm9ybXMoZm9ybVNjaGVtYTogYW55LCBmb3JtU2NoZW1hc0xvb2t1cEFycmF5OiBBcnJheTxhbnk+KTogT2JqZWN0IHtcbiAgICBjb25zdCByZWZlcmVuY2VkRm9ybXM6IEFycmF5PGFueT4gPSBmb3JtU2NoZW1hLnJlZmVyZW5jZWRGb3JtcztcblxuICAgIGlmIChfLmlzRW1wdHkocmVmZXJlbmNlZEZvcm1zKSkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGtleVZhbFJlZmVyZW5jZWRGb3JtczogT2JqZWN0ID0ge307XG5cbiAgICBfLmVhY2gocmVmZXJlbmNlZEZvcm1zLCAocmVmZXJlbmNlOiBhbnkpID0+IHtcbiAgICAgIGtleVZhbFJlZmVyZW5jZWRGb3Jtc1tyZWZlcmVuY2UuYWxpYXNdID1cbiAgICAgICAgdGhpcy5maW5kU2NoZW1hQnlOYW1lKGZvcm1TY2hlbWFzTG9va3VwQXJyYXksIHJlZmVyZW5jZS5mb3JtTmFtZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGtleVZhbFJlZmVyZW5jZWRGb3JtcztcbiAgfVxufVxuIl19