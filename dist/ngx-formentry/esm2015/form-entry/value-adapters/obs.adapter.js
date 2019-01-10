/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import 'rxjs';
import * as _ from 'lodash';
import { LeafNode, GroupNode } from '../form-factory/form-node';
import { ObsAdapterHelper } from './obs-adapter-helper';
export class ObsValueAdapter {
    /**
     * @param {?} helper
     */
    constructor(helper) {
        this.helper = helper;
    }
    /**
     * @param {?} form
     * @return {?}
     */
    generateFormPayload(form) {
        return this.helper.getObsNodePayload(form.rootNode);
        // TODO: Get rid of the section below when the helper is stable.
        // // Traverse  to get all nodes
        // let pages = this.traverse(form.rootNode);
        // // Extract actual question nodes
        // let questionNodes = this.getQuestionNodes(pages);
        // // Get obs Payload
        // return this.getObsPayload(questionNodes);
    }
    /**
     * @param {?} form
     * @param {?} payload
     * @return {?}
     */
    populateForm(form, payload) {
        this.helper.setNodeValue(form.rootNode, payload);
        // TODO: Get rid of the section below when the helper is stable.
        // // Traverse  to get all nodes
        // let pages = this.traverse(form.rootNode);
        // // Extract actual question nodes
        // let questionNodes = this.getQuestionNodes(pages);
        // // Extract set obs
        // this.setValues(questionNodes, payload);
    }
    // TODO: Get rid of all the functions below as they will not be needed
    // once the helper is stable
    /**
     * @param {?} nodes
     * @param {?=} payload
     * @param {?=} forcegroup
     * @return {?}
     */
    setValues(nodes, payload, forcegroup) {
        if (nodes) {
            for (const node of nodes) {
                if (node instanceof LeafNode) {
                    this.setObsValue(node, payload);
                    if (node.question.enableHistoricalValue && node.initialValue !== undefined) {
                        node.question.setHistoricalValue(false);
                    }
                }
                else if (node.question && node.question.extras && node.question.renderingType === 'group' || forcegroup) {
                    /** @type {?} */
                    const groupObs = _.find(payload, (o) => {
                        return o.concept.uuid === node.question.extras.questionOptions.concept && o.groupMembers;
                    });
                    if (groupObs) {
                        if (node.node) {
                            node.node['initialValue'] = groupObs;
                        }
                        this.setValues(node.groupMembers, groupObs.groupMembers);
                    }
                    if (forcegroup && node.payload) {
                        this.setValues(node.groupMembers, node.payload.groupMembers);
                    }
                }
                else if (node instanceof GroupNode && node.question.extras.type === 'complex-obs') {
                    this.setComplexObsValue(node, payload);
                }
                else if (node.question && node.question.extras && node.question.renderingType === 'repeating' && !forcegroup) {
                    this.setRepeatingGroupValues(node, payload);
                    node.node.control.updateValueAndValidity();
                }
                else {
                    throw new Error('not implemented');
                }
            }
        }
    }
    /**
     * @param {?} node
     * @param {?} payload
     * @return {?}
     */
    setObsValue(node, payload) {
        if (node.question && node.question.extras &&
            (node.question.extras.type === 'obs' ||
                (node.question.extras.type === 'complex-obs-child' &&
                    node.question.extras.questionOptions.obsField === 'value')) &&
            node.question.extras.questionOptions.rendering !== 'multiCheckbox' ||
            node.question.extras.questionOptions.rendering !== 'checkbox' ||
            node.question.extras.questionOptions.rendering !== 'multi-select') {
            /** @type {?} */
            const obs = _.find(payload, (o) => {
                return o.concept.uuid === node.question.extras.questionOptions.concept;
            });
            if (obs) {
                if (obs.value instanceof Object) {
                    node.control.setValue(obs.value.uuid);
                    node.control.updateValueAndValidity();
                }
                else {
                    node.control.setValue(obs.value);
                    node.control.updateValueAndValidity();
                }
                node['initialValue'] = { obsUuid: obs.uuid, value: obs.value };
            }
        }
        else {
            /** @type {?} */
            const multiObs = _.filter(payload, (o) => {
                return o.concept.uuid === node.question.extras.questionOptions.concept;
            });
            if (multiObs && multiObs.length > 0) {
                node.control.setValue(this.getMultiselectValues(multiObs));
                node.control.updateValueAndValidity();
                node['initialValue'] = multiObs;
            }
        }
    }
    /**
     * @param {?} node
     * @param {?} payload
     * @return {?}
     */
    setComplexObsValue(node, payload) {
        /** @type {?} */
        let valueField;
        /** @type {?} */
        let dateField;
        // tslint:disable-next-line:forin
        for (const o in node.children) {
            if (((/** @type {?} */ (node.children[o]))).question.extras.questionOptions.obsField === 'value') {
                valueField = node.children[o];
            }
            if (((/** @type {?} */ (node.children[o]))).question.extras.questionOptions.obsField === 'obsDatetime') {
                dateField = node.children[o];
            }
        }
        // set the usual obs value
        this.setObsValue(valueField, payload);
        // set the obs date
        /** @type {?} */
        const obs = _.find(payload, (o) => {
            return o.concept.uuid === node.question.extras.questionOptions.concept;
        });
        if (obs) {
            dateField['initialValue'] = { obsUuid: obs.uuid, value: obs.obsDatetime };
            ((/** @type {?} */ (dateField))).control.setValue(obs.obsDatetime);
            ((/** @type {?} */ (dateField))).control.updateValueAndValidity();
        }
    }
    /**
     * @param {?} multiObs
     * @return {?}
     */
    getMultiselectValues(multiObs) {
        /** @type {?} */
        const values = [];
        for (const m of multiObs) {
            values.push(m.value.uuid);
        }
        return values;
    }
    /**
     * @param {?} node
     * @param {?} payload
     * @return {?}
     */
    setRepeatingGroupValues(node, payload) {
        /** @type {?} */
        const groupRepeatingObs = _.filter(payload, (o) => {
            /** @type {?} */
            const found = o.concept.uuid === node.question.extras.questionOptions.concept;
            /** @type {?} */
            let intersect = false;
            if (found && o.groupMembers) {
                /** @type {?} */
                const obs = o.groupMembers.map((a) => {
                    return a.concept.uuid;
                });
                /** @type {?} */
                const schemaQuestions = node.question.questions.map((a) => {
                    return a.extras.questionOptions.concept;
                });
                intersect = (_.intersection(obs, schemaQuestions).length > 0);
            }
            return found && intersect;
        });
        if (groupRepeatingObs.length > 0) {
            node.node['initialValue'] = groupRepeatingObs;
            for (let i = 0; i < groupRepeatingObs.length; i++) {
                node.node.createChildNode();
            }
        }
        /** @type {?} */
        const groups = [];
        /** @type {?} */
        let index = 0;
        for (const child of node.node.children) {
            /** @type {?} */
            const children = Object.keys(child.children).map(function (key) { return child.children[key]; });
            /** @type {?} */
            const groupPayload = groupRepeatingObs[index];
            groups.push({ question: node.question, groupMembers: children, payload: groupPayload });
            index++;
        }
        this.setValues(groups, groupRepeatingObs, true);
    }
    /**
     * @param {?} pages
     * @return {?}
     */
    getQuestionNodes(pages) {
        /** @type {?} */
        const merged = [];
        /** @type {?} */
        const arrays = [];
        for (const page of pages) {
            for (const section of page.page) {
                arrays.push(section.section);
            }
        }
        return merged.concat.apply([], arrays);
    }
    /**
     * @param {?} nodes
     * @return {?}
     */
    repeatingGroup(nodes) {
        /** @type {?} */
        const toReturn = [];
        for (const node of nodes) {
            toReturn.push({ question: node.question, groupMembers: this.traverse(node) });
        }
        return toReturn;
    }
    /**
     * @param {?} obs
     * @param {?} obsPayload
     * @return {?}
     */
    processGroup(obs, obsPayload) {
        if (obs.question && obs.question.extras && obs.question.extras.questionOptions.rendering === 'group') {
            /** @type {?} */
            const members = _.filter(this.getObsPayload(obs.groupMembers), (o) => {
                return o.value !== '';
            });
            /** @type {?} */
            const mappedMembers = members.map((a) => {
                return a.voided;
            });
            if (members.length > 0 && mappedMembers.every(Boolean)) {
                obsPayload.push({
                    uuid: obs.node.initialValue.uuid,
                    voided: true
                });
            }
            else if (members.length > 0) {
                if (obs.node.initialValue) {
                    obsPayload.push({
                        uuid: obs.node.initialValue.uuid,
                        groupMembers: members
                    });
                }
                else {
                    obsPayload.push({
                        concept: obs.question.extras.questionOptions.concept,
                        groupMembers: members
                    });
                }
            }
        }
    }
    /**
     * @param {?} group
     * @return {?}
     */
    mapInitialGroup(group) {
        /** @type {?} */
        let current = {};
        for (const member of group.groupMembers) {
            /** @type {?} */
            let value = '';
            if (member.value instanceof Object) {
                value = member.value.uuid;
            }
            else if (member.value) {
                value = member.value;
            }
            else if (member.groupMembers && member.groupMembers.length > 0) {
                current = this.mapInitialGroup(group);
            }
            current[member.concept.uuid + ':' + value] = value;
        }
        return current;
    }
    /**
     * @param {?} node
     * @param {?} value
     * @return {?}
     */
    mapModelGroup(node, value) {
        /** @type {?} */
        const current = {};
        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                /** @type {?} */
                const groupQuestion = _.find(node.question.questions, { key: key });
                /** @type {?} */
                const modelValue = value[key];
                if (modelValue instanceof Object) {
                }
                else if (modelValue !== '') {
                    current[groupQuestion.extras.questionOptions.concept + ':'
                        + modelValue] = modelValue;
                }
            }
        }
        return current;
    }
    /**
     * @param {?} node
     * @param {?} obsPayload
     * @return {?}
     */
    processRepeatingGroups(node, obsPayload) {
        /** @type {?} */
        const initialValues = [];
        if (node.node.initialValue) {
            for (const group of node.node.initialValue) {
                initialValues.push({ uuid: group.uuid, value: this.mapInitialGroup(group) });
            }
        }
        /** @type {?} */
        const repeatingModel = [];
        for (const value of node.node.control.value) {
            repeatingModel.push({ value: this.mapModelGroup(node, value) });
        }
        /** @type {?} */
        const deleted = this.leftOuterJoinArrays(initialValues, repeatingModel);
        /** @type {?} */
        const newObs = this.leftOuterJoinArrays(repeatingModel, initialValues);
        /** @type {?} */
        const groupConcept = node.question.extras.questionOptions.concept;
        /** @type {?} */
        let newObsPayload = [];
        if (deleted.length > 0) {
            /** @type {?} */
            const deletedObs = this.createGroupDeletedObs(deleted);
            for (const d of deletedObs) {
                obsPayload.push(d);
            }
            if (newObs.length > 0) {
                newObsPayload = this.createGroupNewObs(newObs, groupConcept);
            }
        }
        else {
            newObsPayload = this.createGroupNewObs(newObs, groupConcept);
        }
        if (newObsPayload.length > 0) {
            for (const p of newObsPayload) {
                obsPayload.push(p);
            }
        }
    }
    /**
     * @param {?} first
     * @param {?} second
     * @return {?}
     */
    leftOuterJoinArrays(first, second) {
        /** @type {?} */
        const unique = first.filter(function (obj) {
            return !second.some(function (obj2) {
                return _.isEqual(obj.value, obj2.value);
            });
        });
        return unique;
    }
    /**
     * @param {?} payload
     * @param {?} groupConcept
     * @return {?}
     */
    createGroupNewObs(payload, groupConcept) {
        /** @type {?} */
        const newPayload = [];
        for (const obs of payload) {
            /** @type {?} */
            const groupPayload = [];
            /* tslint:disable */
            for (let key in obs.value) {
                /** @type {?} */
                let concept = key.split(':')[0];
                /** @type {?} */
                let value = key.split(':')[1];
                groupPayload.push({ concept: concept, value: value });
            }
            newPayload.push({ concept: groupConcept, groupMembers: groupPayload });
            /* tslint:enable */
        }
        return newPayload;
    }
    /**
     * @param {?} payload
     * @return {?}
     */
    createGroupDeletedObs(payload) {
        /** @type {?} */
        const deletedObs = [];
        for (const d of payload) {
            deletedObs.push({ uuid: d.uuid, voided: true });
        }
        return deletedObs;
    }
    /**
     * @param {?} datetime
     * @return {?}
     */
    getExactTime(datetime) {
        return datetime.substring(0, 19).replace('T', ' ');
    }
    /**
     * @param {?} obs
     * @param {?} obsPayload
     * @return {?}
     */
    processObs(obs, obsPayload) {
        if (obs.control && obs.question.extras) {
            /** @type {?} */
            const obsValue = {
                concept: obs.question.extras.questionOptions.concept,
                value: (obs.question.extras.questionOptions.rendering === 'date' && !this.isEmpty(obs.control.value)) ?
                    this.getExactTime(obs.control.value) : obs.control.value
            };
            if (obs.question.extras.questionOptions.rendering === 'multiCheckbox' ||
                obs.question.extras.questionOptions.rendering === 'checkbox' ||
                obs.question.extras.questionOptions.rendering === 'multi-select') {
                /** @type {?} */
                const multis = this.processMultiSelect(obs.question.extras.questionOptions.concept, obs.control.value);
                if (obs.initialValue) {
                    /** @type {?} */
                    const mappedInitial = obs.initialValue.map((a) => {
                        return { uuid: a.uuid, value: { concept: a.concept.uuid, value: a.value.uuid } };
                    });
                    /** @type {?} */
                    const mappedCurrent = multis.map((a) => {
                        return { value: a };
                    });
                    /** @type {?} */
                    const deletedObs = this.leftOuterJoinArrays(mappedInitial, mappedCurrent);
                    /** @type {?} */
                    const newObs = this.leftOuterJoinArrays(mappedCurrent, mappedInitial);
                    this.processDeletedMultiSelectObs(deletedObs, obsPayload);
                    this.processNewMultiSelectObs(newObs, obsPayload);
                }
                else {
                    this.processNewMultiSelectObs(multis, obsPayload);
                }
            }
            else {
                if (obs.initialValue && obs.initialValue.value && obsValue) {
                    this.updateOrVoidObs(obsValue, obs.initialValue, obsPayload);
                }
                else if (obsValue.value !== '' && obsValue.value !== null) {
                    obsPayload.push(obsValue);
                }
            }
        }
    }
    /**
     * @param {?} node
     * @param {?} obsPayload
     * @return {?}
     */
    processComplexObs(node, obsPayload) {
        /** @type {?} */
        let valueField;
        /** @type {?} */
        let dateField;
        // tslint:disable-next-line:forin
        for (const o in node.children) {
            if (((/** @type {?} */ (node.children[o]))).question.extras.questionOptions.obsField === 'value') {
                valueField = node.children[o];
            }
            if (((/** @type {?} */ (node.children[o]))).question.extras.questionOptions.obsField === 'obsDatetime') {
                dateField = node.children[o];
            }
        }
        if (valueField) {
            // process obs as usual
            this.processObs(valueField, obsPayload);
            // obtain the last inserted obs and set the obsDatetime
            /** @type {?} */
            const createdPayload = obsPayload.length > 0 ? obsPayload[obsPayload.length - 1] : undefined;
            if (createdPayload &&
                ((createdPayload.concept && createdPayload.concept === node.question.extras.questionOptions.concept) ||
                    (valueField.initialValue && createdPayload.uuid === valueField.initialValue.obsUuid))) {
                if (dateField.initialValue && dateField.control.value !== dateField.initialValue.value) {
                    createdPayload.obsDatetime = dateField.control.value;
                }
            }
        }
    }
    /**
     * @param {?} values
     * @param {?} obsPayload
     * @return {?}
     */
    processDeletedMultiSelectObs(values, obsPayload) {
        for (const value of values) {
            obsPayload.push({ uuid: value.uuid, voided: true });
        }
    }
    /**
     * @param {?} values
     * @param {?} obsPayload
     * @return {?}
     */
    processNewMultiSelectObs(values, obsPayload) {
        for (const multi of values) {
            if (multi.value instanceof Object) {
                obsPayload.push(multi.value);
            }
            else {
                obsPayload.push(multi);
            }
        }
    }
    /**
     * @param {?} obsValue
     * @param {?} initialValue
     * @param {?} obsPayload
     * @return {?}
     */
    updateOrVoidObs(obsValue, initialValue, obsPayload) {
        if (this.isEmpty(obsValue.value) && initialValue.value) {
            obsPayload.push({ uuid: initialValue.obsUuid, voided: true });
        }
        else if (!this.isEmpty(obsValue.value) && initialValue.value) {
            obsPayload.push({ uuid: initialValue.obsUuid, value: obsValue.value });
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    isEmpty(value) {
        if (value === '' ||
            value === null ||
            value === undefined
        // || value === [] ||
        // value === {}
        ) {
            return true;
        }
        return false;
    }
    /**
     * @param {?} o
     * @param {?=} type
     * @return {?}
     */
    traverse(o, type) {
        /** @type {?} */
        const questions = [];
        if (o.children) {
            if (o.children instanceof Array) {
                /** @type {?} */
                const returned = this.repeatingGroup(o.children);
                return returned;
            }
            if (o.children instanceof Object) {
                for (const key in o.children) {
                    if (o.children.hasOwnProperty(key)) {
                        switch (o.children[key].question.renderingType) {
                            case 'page':
                                /** @type {?} */
                                const page = this.traverse(o.children[key]);
                                questions.push({ page: page, label: o.children[key].question.label });
                                break;
                            case 'section':
                                /** @type {?} */
                                const section = this.traverse(o.children[key]);
                                questions.push({ section: section, node: o.children[key], label: o.children[key].question.label });
                                break;
                            case 'group':
                                /** @type {?} */
                                const qs = this.traverse(o.children[key]);
                                questions.push({ node: o.children[key], question: o.children[key].question, groupMembers: qs });
                                break;
                            case 'repeating':
                                /** @type {?} */
                                const rep = this.repeatingGroup(o.children[key].children);
                                questions.push({ node: o.children[key], question: o.children[key].question, groupMembers: rep });
                                break;
                            default:
                                questions.push(o.children[key]);
                                break;
                        }
                    }
                }
            }
        }
        return questions;
    }
    /**
     * @param {?} concept
     * @param {?} values
     * @return {?}
     */
    processMultiSelect(concept, values) {
        /** @type {?} */
        const multiSelectObs = [];
        if (values && values !== null) {
            for (const value of values) {
                /** @type {?} */
                const obs = {
                    concept: concept,
                    value: value
                };
                multiSelectObs.push(obs);
            }
        }
        return multiSelectObs;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    isObs(node) {
        return (node.question.extras.type === 'obs' ||
            node.question.extras.type === 'obsGroup' ||
            node.question.extras.type === 'complex-obs');
    }
    /**
     * @param {?} nodes
     * @return {?}
     */
    getObsPayload(nodes) {
        /** @type {?} */
        const obsPayload = [];
        for (const node of nodes) {
            if (this.isObs(node)) {
                if (node.groupMembers, node.question.extras.questionOptions.rendering === 'group') {
                    this.processGroup(node, obsPayload);
                }
                else if (node.groupMembers, node.question.extras.questionOptions.rendering === 'repeating') {
                    this.processRepeatingGroups(node, obsPayload);
                }
                else if (node instanceof GroupNode && ((/** @type {?} */ (node))).question.extras.type === 'complex-obs') {
                    this.processComplexObs(node, obsPayload);
                }
                else {
                    this.processObs(node, obsPayload);
                }
            }
        }
        return obsPayload;
    }
}
ObsValueAdapter.decorators = [
    { type: Injectable }
];
/** @nocollapse */
ObsValueAdapter.ctorParameters = () => [
    { type: ObsAdapterHelper }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    ObsValueAdapter.prototype.helper;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JzLmFkYXB0ZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtb3Blbm1ycy1mb3JtZW50cnkvIiwic291cmNlcyI6WyJmb3JtLWVudHJ5L3ZhbHVlLWFkYXB0ZXJzL29icy5hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sTUFBTSxDQUFDO0FBRWQsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7QUFFNUIsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUdoRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUd4RCxNQUFNLE9BQU8sZUFBZTs7OztJQUV4QixZQUFvQixNQUF3QjtRQUF4QixXQUFNLEdBQU4sTUFBTSxDQUFrQjtJQUFJLENBQUM7Ozs7O0lBRWpELG1CQUFtQixDQUFDLElBQVU7UUFDMUIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwRCxnRUFBZ0U7UUFDaEUsZ0NBQWdDO1FBQ2hDLDRDQUE0QztRQUM1QyxtQ0FBbUM7UUFDbkMsb0RBQW9EO1FBQ3BELHFCQUFxQjtRQUNyQiw0Q0FBNEM7SUFDaEQsQ0FBQzs7Ozs7O0lBRUQsWUFBWSxDQUFDLElBQVUsRUFBRSxPQUFPO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFakQsZ0VBQWdFO1FBQ2hFLGdDQUFnQztRQUNoQyw0Q0FBNEM7UUFDNUMsbUNBQW1DO1FBQ25DLG9EQUFvRDtRQUNwRCxxQkFBcUI7UUFDckIsMENBQTBDO0lBQzlDLENBQUM7Ozs7Ozs7OztJQUtELFNBQVMsQ0FBQyxLQUFLLEVBQUUsT0FBUSxFQUFFLFVBQVc7UUFDbEMsSUFBSSxLQUFLLEVBQUU7WUFDUCxLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtnQkFDdEIsSUFBSSxJQUFJLFlBQVksUUFBUSxFQUFFO29CQUMxQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFDaEMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLHFCQUFxQixJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssU0FBUyxFQUFFO3dCQUN4RSxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUMzQztpQkFFSjtxQkFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEtBQUssT0FBTyxJQUFJLFVBQVUsRUFBRTs7MEJBQ2pHLFFBQVEsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQU0sRUFBRSxFQUFFO3dCQUN4QyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQztvQkFDN0YsQ0FBQyxDQUFDO29CQUNGLElBQUksUUFBUSxFQUFFO3dCQUNWLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTs0QkFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLFFBQVEsQ0FBQzt5QkFDeEM7d0JBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztxQkFDNUQ7b0JBQ0QsSUFBSSxVQUFVLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTt3QkFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7cUJBQ2hFO2lCQUdKO3FCQUFNLElBQUksSUFBSSxZQUFZLFNBQVMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssYUFBYSxFQUFFO29CQUNqRixJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2lCQUMxQztxQkFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEtBQUssV0FBVyxJQUFJLENBQUMsVUFBVSxFQUFFO29CQUM1RyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO2lCQUM5QztxQkFBTTtvQkFDSCxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7aUJBQ3RDO2FBQ0o7U0FDSjtJQUNMLENBQUM7Ozs7OztJQUVELFdBQVcsQ0FBQyxJQUFJLEVBQUUsT0FBTztRQUNyQixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNO1lBQ3JDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLEtBQUs7Z0JBQ3BDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLG1CQUFtQjtvQkFDbEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsU0FBUyxLQUFLLGVBQWU7WUFDbEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLFNBQVMsS0FBSyxVQUFVO1lBQzdELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEtBQUssY0FBYyxFQUFFOztrQkFDN0QsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBTSxFQUFFLEVBQUU7Z0JBQ25DLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQztZQUMzRSxDQUFDLENBQUM7WUFDRixJQUFJLEdBQUcsRUFBRTtnQkFDTCxJQUFJLEdBQUcsQ0FBQyxLQUFLLFlBQVksTUFBTSxFQUFFO29CQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFzQixFQUFFLENBQUM7aUJBQ3pDO3FCQUFNO29CQUNILElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO2lCQUN6QztnQkFDRCxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ2xFO1NBQ0o7YUFBTTs7a0JBQ0csUUFBUSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBTSxFQUFFLEVBQUU7Z0JBQzFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQztZQUMzRSxDQUFDLENBQUM7WUFDRixJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQzNELElBQUksQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztnQkFDdEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLFFBQVEsQ0FBQzthQUNuQztTQUNKO0lBQ0wsQ0FBQzs7Ozs7O0lBRUQsa0JBQWtCLENBQUMsSUFBSSxFQUFFLE9BQU87O1lBQ3hCLFVBQWU7O1lBQ2YsU0FBYztRQUVsQixpQ0FBaUM7UUFDakMsS0FBSyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQzNCLElBQUksQ0FBQyxtQkFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFFO2dCQUNyRixVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNqQztZQUVELElBQUksQ0FBQyxtQkFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEtBQUssYUFBYSxFQUFFO2dCQUMzRixTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNoQztTQUNKO1FBQ0QsMEJBQTBCO1FBQzFCLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDOzs7Y0FHaEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBTSxFQUFFLEVBQUU7WUFDbkMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDO1FBQzNFLENBQUMsQ0FBQztRQUVGLElBQUksR0FBRyxFQUFFO1lBQ0wsU0FBUyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUMxRSxDQUFDLG1CQUFBLFNBQVMsRUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDMUQsQ0FBQyxtQkFBQSxTQUFTLEVBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1NBQzVEO0lBQ0wsQ0FBQzs7Ozs7SUFFRCxvQkFBb0IsQ0FBQyxRQUFROztjQUNuQixNQUFNLEdBQUcsRUFBRTtRQUNqQixLQUFLLE1BQU0sQ0FBQyxJQUFJLFFBQVEsRUFBRTtZQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDN0I7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDOzs7Ozs7SUFFRCx1QkFBdUIsQ0FBQyxJQUFJLEVBQUUsT0FBTzs7Y0FDM0IsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFNLEVBQUUsRUFBRTs7a0JBQzdDLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsT0FBTzs7Z0JBQ3pFLFNBQVMsR0FBRyxLQUFLO1lBQ3JCLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUU7O3NCQUNuQixHQUFHLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtvQkFDakMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDMUIsQ0FBQyxDQUFDOztzQkFFSSxlQUFlLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7b0JBQ3RELE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDO2dCQUM1QyxDQUFDLENBQUM7Z0JBRUYsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsZUFBZSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ2pFO1lBQ0QsT0FBTyxLQUFLLElBQUksU0FBUyxDQUFDO1FBQzlCLENBQUMsQ0FBQztRQUNGLElBQUksaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLGlCQUFpQixDQUFDO1lBQzlDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQy9DLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7YUFDL0I7U0FDSjs7Y0FDSyxNQUFNLEdBQUcsRUFBRTs7WUFDYixLQUFLLEdBQUcsQ0FBQztRQUNiLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7O2tCQUM5QixRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7a0JBQzFGLFlBQVksR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUM7WUFDN0MsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7WUFDeEYsS0FBSyxFQUFFLENBQUM7U0FDWDtRQUNELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLGlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3BELENBQUM7Ozs7O0lBRUQsZ0JBQWdCLENBQUMsS0FBSzs7Y0FDWixNQUFNLEdBQUcsRUFBRTs7Y0FDWCxNQUFNLEdBQUcsRUFBRTtRQUNqQixLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtZQUN0QixLQUFLLE1BQU0sT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ2hDO1NBQ0o7UUFDRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMzQyxDQUFDOzs7OztJQUVELGNBQWMsQ0FBQyxLQUFLOztjQUNWLFFBQVEsR0FBRyxFQUFFO1FBQ25CLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1lBQ3RCLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDakY7UUFDRCxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDOzs7Ozs7SUFFRCxZQUFZLENBQUMsR0FBRyxFQUFFLFVBQVU7UUFDeEIsSUFBSSxHQUFHLENBQUMsUUFBUSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEtBQUssT0FBTyxFQUFFOztrQkFDNUYsT0FBTyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFNLEVBQUUsRUFBRTtnQkFDdEUsT0FBTyxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQztZQUMxQixDQUFDLENBQUM7O2tCQUVJLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3BDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUNwQixDQUFDLENBQUM7WUFDRixJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ3BELFVBQVUsQ0FBQyxJQUFJLENBQUM7b0JBQ1osSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUk7b0JBQ2hDLE1BQU0sRUFBRSxJQUFJO2lCQUNmLENBQUMsQ0FBQzthQUNOO2lCQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQzNCLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7b0JBQ3ZCLFVBQVUsQ0FBQyxJQUFJLENBQUM7d0JBQ1osSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUk7d0JBQ2hDLFlBQVksRUFBRSxPQUFPO3FCQUN4QixDQUFDLENBQUM7aUJBQ047cUJBQU07b0JBQ0gsVUFBVSxDQUFDLElBQUksQ0FBQzt3QkFDWixPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU87d0JBQ3BELFlBQVksRUFBRSxPQUFPO3FCQUN4QixDQUFDLENBQUM7aUJBQ047YUFDSjtTQUNKO0lBQ0wsQ0FBQzs7Ozs7SUFFRCxlQUFlLENBQUMsS0FBSzs7WUFDYixPQUFPLEdBQUcsRUFBRTtRQUNoQixLQUFLLE1BQU0sTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUU7O2dCQUNqQyxLQUFLLEdBQVEsRUFBRTtZQUNuQixJQUFJLE1BQU0sQ0FBQyxLQUFLLFlBQVksTUFBTSxFQUFFO2dCQUNoQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7YUFDN0I7aUJBQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO2dCQUNyQixLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQzthQUN4QjtpQkFBTSxJQUFJLE1BQU0sQ0FBQyxZQUFZLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUM5RCxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN6QztZQUNELE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQ3REO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQzs7Ozs7O0lBRUQsYUFBYSxDQUFDLElBQUksRUFBRSxLQUFLOztjQUNmLE9BQU8sR0FBRyxFQUFFO1FBQ2xCLEtBQUssTUFBTSxHQUFHLElBQUksS0FBSyxFQUFFO1lBQ3JCLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTs7c0JBQ3JCLGFBQWEsR0FBUSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDOztzQkFDbEUsVUFBVSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7Z0JBQzdCLElBQUksVUFBVSxZQUFZLE1BQU0sRUFBRTtpQkFDakM7cUJBQU0sSUFBSSxVQUFVLEtBQUssRUFBRSxFQUFFO29CQUMxQixPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsT0FBTyxHQUFHLEdBQUc7MEJBQ3BELFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztpQkFDbEM7YUFDSjtTQUVKO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQzs7Ozs7O0lBRUQsc0JBQXNCLENBQUMsSUFBSSxFQUFFLFVBQVU7O2NBQzdCLGFBQWEsR0FBRyxFQUFFO1FBQ3hCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDeEIsS0FBSyxNQUFNLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDeEMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUNoRjtTQUNKOztjQUNLLGNBQWMsR0FBRyxFQUFFO1FBQ3pCLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ3pDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ25FOztjQUNLLE9BQU8sR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLGNBQWMsQ0FBQzs7Y0FDakUsTUFBTSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLEVBQUUsYUFBYSxDQUFDOztjQUNoRSxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU87O1lBQzdELGFBQWEsR0FBRyxFQUFFO1FBQ3RCLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7O2tCQUNkLFVBQVUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDO1lBQ3RELEtBQUssTUFBTSxDQUFDLElBQUksVUFBVSxFQUFFO2dCQUN4QixVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3RCO1lBQ0QsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDbkIsYUFBYSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7YUFDaEU7U0FDSjthQUFNO1lBQ0gsYUFBYSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7U0FDaEU7UUFFRCxJQUFJLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzFCLEtBQUssTUFBTSxDQUFDLElBQUksYUFBYSxFQUFFO2dCQUMzQixVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3RCO1NBQ0o7SUFDTCxDQUFDOzs7Ozs7SUFFRCxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsTUFBTTs7Y0FDdkIsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHO1lBQ3JDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSTtnQkFDOUIsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVDLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDO1FBQ0YsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQzs7Ozs7O0lBRUQsaUJBQWlCLENBQUMsT0FBTyxFQUFFLFlBQVk7O2NBQzdCLFVBQVUsR0FBRyxFQUFFO1FBQ3JCLEtBQUssTUFBTSxHQUFHLElBQUksT0FBTyxFQUFFOztrQkFDakIsWUFBWSxHQUFHLEVBQUU7WUFDdkIsb0JBQW9CO1lBQ3BCLEtBQUssSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTs7b0JBQ25CLE9BQU8sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7b0JBQzNCLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDekQ7WUFDRCxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQTtZQUN0RSxtQkFBbUI7U0FDdEI7UUFDRCxPQUFPLFVBQVUsQ0FBQztJQUN0QixDQUFDOzs7OztJQUVELHFCQUFxQixDQUFDLE9BQU87O2NBQ25CLFVBQVUsR0FBRyxFQUFFO1FBQ3JCLEtBQUssTUFBTSxDQUFDLElBQUksT0FBTyxFQUFFO1lBQ3JCLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUNuRDtRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3RCLENBQUM7Ozs7O0lBRUQsWUFBWSxDQUFDLFFBQWdCO1FBQ3pCLE9BQU8sUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN2RCxDQUFDOzs7Ozs7SUFFRCxVQUFVLENBQUMsR0FBRyxFQUFFLFVBQVU7UUFDdEIsSUFBSSxHQUFHLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFOztrQkFDOUIsUUFBUSxHQUFHO2dCQUNiLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsT0FBTztnQkFDcEQsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLFNBQVMsS0FBSyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSzthQUMvRDtZQUVELElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLFNBQVMsS0FBSyxlQUFlO2dCQUNyRSxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsU0FBUyxLQUFLLFVBQVU7Z0JBQzVELEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEtBQUssY0FBYyxFQUFFOztzQkFDeEQsTUFBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO2dCQUN0RyxJQUFJLEdBQUcsQ0FBQyxZQUFZLEVBQUU7OzBCQUNaLGFBQWEsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO3dCQUM3QyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUM7b0JBQ3JGLENBQUMsQ0FBQzs7MEJBQ0ksYUFBYSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTt3QkFDbkMsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQztvQkFDeEIsQ0FBQyxDQUFDOzswQkFDSSxVQUFVLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUM7OzBCQUNuRSxNQUFNLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUM7b0JBQ3JFLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7b0JBQzFELElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7aUJBQ3JEO3FCQUFNO29CQUNILElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7aUJBQ3JEO2FBQ0o7aUJBQU07Z0JBQ0gsSUFBSSxHQUFHLENBQUMsWUFBWSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxJQUFJLFFBQVEsRUFBRTtvQkFDeEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQztpQkFDaEU7cUJBQU0sSUFBSSxRQUFRLENBQUMsS0FBSyxLQUFLLEVBQUUsSUFBSSxRQUFRLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRTtvQkFDekQsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDN0I7YUFDSjtTQUNKO0lBQ0wsQ0FBQzs7Ozs7O0lBRUQsaUJBQWlCLENBQUMsSUFBSSxFQUFFLFVBQVU7O1lBQzFCLFVBQWU7O1lBQ2YsU0FBYztRQUVsQixpQ0FBaUM7UUFDakMsS0FBSyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQzNCLElBQUksQ0FBQyxtQkFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFFO2dCQUNyRixVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNqQztZQUVELElBQUksQ0FBQyxtQkFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEtBQUssYUFBYSxFQUFFO2dCQUMzRixTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNoQztTQUNKO1FBRUQsSUFBSSxVQUFVLEVBQUU7WUFDWix1QkFBdUI7WUFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7OztrQkFHbEMsY0FBYyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztZQUM1RixJQUFJLGNBQWM7Z0JBQ2QsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxPQUFPLElBQUksY0FBYyxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDO29CQUNoRyxDQUFDLFVBQVUsQ0FBQyxZQUFZLElBQUksY0FBYyxDQUFDLElBQUksS0FBSyxVQUFVLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUU7Z0JBQzNGLElBQUksU0FBUyxDQUFDLFlBQVksSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRTtvQkFDcEYsY0FBYyxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztpQkFDeEQ7YUFDSjtTQUNKO0lBQ0wsQ0FBQzs7Ozs7O0lBRUQsNEJBQTRCLENBQUMsTUFBTSxFQUFFLFVBQVU7UUFDM0MsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQUU7WUFDeEIsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQ3ZEO0lBQ0wsQ0FBQzs7Ozs7O0lBRUQsd0JBQXdCLENBQUMsTUFBTSxFQUFFLFVBQVU7UUFDdkMsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQUU7WUFDeEIsSUFBSSxLQUFLLENBQUMsS0FBSyxZQUFZLE1BQU0sRUFBRTtnQkFDL0IsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDaEM7aUJBQU07Z0JBQ0gsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUMxQjtTQUNKO0lBQ0wsQ0FBQzs7Ozs7OztJQUVELGVBQWUsQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLFVBQVU7UUFDOUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxZQUFZLENBQUMsS0FBSyxFQUFFO1lBQ3BELFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUNqRTthQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxZQUFZLENBQUMsS0FBSyxFQUFFO1lBQzVELFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDMUU7SUFDTCxDQUFDOzs7OztJQUVELE9BQU8sQ0FBQyxLQUFLO1FBQ1QsSUFBSSxLQUFLLEtBQUssRUFBRTtZQUNaLEtBQUssS0FBSyxJQUFJO1lBQ2QsS0FBSyxLQUFLLFNBQVM7UUFDbkIscUJBQXFCO1FBQ3JCLGVBQWU7VUFDakI7WUFDRSxPQUFPLElBQUksQ0FBQztTQUNmO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQzs7Ozs7O0lBRUQsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFLOztjQUNQLFNBQVMsR0FBRyxFQUFFO1FBQ3BCLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRTtZQUNaLElBQUksQ0FBQyxDQUFDLFFBQVEsWUFBWSxLQUFLLEVBQUU7O3NCQUN2QixRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO2dCQUNoRCxPQUFPLFFBQVEsQ0FBQzthQUNuQjtZQUNELElBQUksQ0FBQyxDQUFDLFFBQVEsWUFBWSxNQUFNLEVBQUU7Z0JBQzlCLEtBQUssTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRTtvQkFDMUIsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTt3QkFDaEMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUU7NEJBQzVDLEtBQUssTUFBTTs7c0NBQ0QsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQ0FDM0MsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7Z0NBQ3RFLE1BQU07NEJBQ1YsS0FBSyxTQUFTOztzQ0FDSixPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dDQUM5QyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztnQ0FDbkcsTUFBTTs0QkFDVixLQUFLLE9BQU87O3NDQUNGLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7Z0NBQ3pDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0NBQ2hHLE1BQU07NEJBQ1YsS0FBSyxXQUFXOztzQ0FDTixHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztnQ0FDekQsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztnQ0FDakcsTUFBTTs0QkFDVjtnQ0FDSSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQ0FDaEMsTUFBTTt5QkFFYjtxQkFDSjtpQkFDSjthQUNKO1NBRUo7UUFDRCxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDOzs7Ozs7SUFFRCxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsTUFBTTs7Y0FDeEIsY0FBYyxHQUFHLEVBQUU7UUFDekIsSUFBSSxNQUFNLElBQUksTUFBTSxLQUFLLElBQUksRUFBRTtZQUMzQixLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sRUFBRTs7c0JBQ2xCLEdBQUcsR0FBRztvQkFDUixPQUFPLEVBQUUsT0FBTztvQkFDaEIsS0FBSyxFQUFFLEtBQUs7aUJBQ2Y7Z0JBQ0QsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUM1QjtTQUNKO1FBQ0QsT0FBTyxjQUFjLENBQUM7SUFDMUIsQ0FBQzs7Ozs7SUFHRCxLQUFLLENBQUMsSUFBSTtRQUNOLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssS0FBSztZQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssVUFBVTtZQUN4QyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssYUFBYSxDQUFDLENBQUM7SUFDckQsQ0FBQzs7Ozs7SUFFRCxhQUFhLENBQUMsS0FBSzs7Y0FDVCxVQUFVLEdBQUcsRUFBRTtRQUNyQixLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtZQUN0QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2xCLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsU0FBUyxLQUFLLE9BQU8sRUFBRTtvQkFFL0UsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7aUJBRXZDO3FCQUFNLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsU0FBUyxLQUFLLFdBQVcsRUFBRTtvQkFDMUYsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztpQkFDakQ7cUJBQU0sSUFBSSxJQUFJLFlBQVksU0FBUyxJQUFJLENBQUMsbUJBQUEsSUFBSSxFQUFhLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxhQUFhLEVBQUU7b0JBQ2hHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7aUJBQzVDO3FCQUFNO29CQUNILElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2lCQUNyQzthQUNKO1NBQ0o7UUFDRCxPQUFPLFVBQVUsQ0FBQztJQUN0QixDQUFDOzs7WUEzZkosVUFBVTs7OztZQUZGLGdCQUFnQjs7Ozs7OztJQUtULGlDQUFnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCAncnhqcyc7XG5cbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHsgTGVhZk5vZGUsIEdyb3VwTm9kZSB9IGZyb20gJy4uL2Zvcm0tZmFjdG9yeS9mb3JtLW5vZGUnO1xuaW1wb3J0IHsgRm9ybSB9IGZyb20gJy4uL2Zvcm0tZmFjdG9yeS9mb3JtJztcbmltcG9ydCB7IFZhbHVlQWRhcHRlciB9IGZyb20gJy4vdmFsdWUuYWRhcHRlcic7XG5pbXBvcnQgeyBPYnNBZGFwdGVySGVscGVyIH0gZnJvbSAnLi9vYnMtYWRhcHRlci1oZWxwZXInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgT2JzVmFsdWVBZGFwdGVyIGltcGxlbWVudHMgVmFsdWVBZGFwdGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaGVscGVyOiBPYnNBZGFwdGVySGVscGVyKSB7IH1cblxuICAgIGdlbmVyYXRlRm9ybVBheWxvYWQoZm9ybTogRm9ybSkge1xuICAgICAgICByZXR1cm4gdGhpcy5oZWxwZXIuZ2V0T2JzTm9kZVBheWxvYWQoZm9ybS5yb290Tm9kZSk7XG4gICAgICAgIC8vIFRPRE86IEdldCByaWQgb2YgdGhlIHNlY3Rpb24gYmVsb3cgd2hlbiB0aGUgaGVscGVyIGlzIHN0YWJsZS5cbiAgICAgICAgLy8gLy8gVHJhdmVyc2UgIHRvIGdldCBhbGwgbm9kZXNcbiAgICAgICAgLy8gbGV0IHBhZ2VzID0gdGhpcy50cmF2ZXJzZShmb3JtLnJvb3ROb2RlKTtcbiAgICAgICAgLy8gLy8gRXh0cmFjdCBhY3R1YWwgcXVlc3Rpb24gbm9kZXNcbiAgICAgICAgLy8gbGV0IHF1ZXN0aW9uTm9kZXMgPSB0aGlzLmdldFF1ZXN0aW9uTm9kZXMocGFnZXMpO1xuICAgICAgICAvLyAvLyBHZXQgb2JzIFBheWxvYWRcbiAgICAgICAgLy8gcmV0dXJuIHRoaXMuZ2V0T2JzUGF5bG9hZChxdWVzdGlvbk5vZGVzKTtcbiAgICB9XG5cbiAgICBwb3B1bGF0ZUZvcm0oZm9ybTogRm9ybSwgcGF5bG9hZCkge1xuICAgICAgICB0aGlzLmhlbHBlci5zZXROb2RlVmFsdWUoZm9ybS5yb290Tm9kZSwgcGF5bG9hZCk7XG5cbiAgICAgICAgLy8gVE9ETzogR2V0IHJpZCBvZiB0aGUgc2VjdGlvbiBiZWxvdyB3aGVuIHRoZSBoZWxwZXIgaXMgc3RhYmxlLlxuICAgICAgICAvLyAvLyBUcmF2ZXJzZSAgdG8gZ2V0IGFsbCBub2Rlc1xuICAgICAgICAvLyBsZXQgcGFnZXMgPSB0aGlzLnRyYXZlcnNlKGZvcm0ucm9vdE5vZGUpO1xuICAgICAgICAvLyAvLyBFeHRyYWN0IGFjdHVhbCBxdWVzdGlvbiBub2Rlc1xuICAgICAgICAvLyBsZXQgcXVlc3Rpb25Ob2RlcyA9IHRoaXMuZ2V0UXVlc3Rpb25Ob2RlcyhwYWdlcyk7XG4gICAgICAgIC8vIC8vIEV4dHJhY3Qgc2V0IG9ic1xuICAgICAgICAvLyB0aGlzLnNldFZhbHVlcyhxdWVzdGlvbk5vZGVzLCBwYXlsb2FkKTtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBHZXQgcmlkIG9mIGFsbCB0aGUgZnVuY3Rpb25zIGJlbG93IGFzIHRoZXkgd2lsbCBub3QgYmUgbmVlZGVkXG4gICAgLy8gb25jZSB0aGUgaGVscGVyIGlzIHN0YWJsZVxuXG4gICAgc2V0VmFsdWVzKG5vZGVzLCBwYXlsb2FkPywgZm9yY2Vncm91cD8pIHtcbiAgICAgICAgaWYgKG5vZGVzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygbm9kZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIExlYWZOb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0T2JzVmFsdWUobm9kZSwgcGF5bG9hZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLnF1ZXN0aW9uLmVuYWJsZUhpc3RvcmljYWxWYWx1ZSAmJiBub2RlLmluaXRpYWxWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLnF1ZXN0aW9uLnNldEhpc3RvcmljYWxWYWx1ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZS5xdWVzdGlvbiAmJiBub2RlLnF1ZXN0aW9uLmV4dHJhcyAmJiBub2RlLnF1ZXN0aW9uLnJlbmRlcmluZ1R5cGUgPT09ICdncm91cCcgfHwgZm9yY2Vncm91cCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBncm91cE9icyA9IF8uZmluZChwYXlsb2FkLCAobzogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gby5jb25jZXB0LnV1aWQgPT09IG5vZGUucXVlc3Rpb24uZXh0cmFzLnF1ZXN0aW9uT3B0aW9ucy5jb25jZXB0ICYmIG8uZ3JvdXBNZW1iZXJzO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdyb3VwT2JzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5ub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5ub2RlWydpbml0aWFsVmFsdWUnXSA9IGdyb3VwT2JzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFZhbHVlcyhub2RlLmdyb3VwTWVtYmVycywgZ3JvdXBPYnMuZ3JvdXBNZW1iZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZm9yY2Vncm91cCAmJiBub2RlLnBheWxvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VmFsdWVzKG5vZGUuZ3JvdXBNZW1iZXJzLCBub2RlLnBheWxvYWQuZ3JvdXBNZW1iZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBHcm91cE5vZGUgJiYgbm9kZS5xdWVzdGlvbi5leHRyYXMudHlwZSA9PT0gJ2NvbXBsZXgtb2JzJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldENvbXBsZXhPYnNWYWx1ZShub2RlLCBwYXlsb2FkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUucXVlc3Rpb24gJiYgbm9kZS5xdWVzdGlvbi5leHRyYXMgJiYgbm9kZS5xdWVzdGlvbi5yZW5kZXJpbmdUeXBlID09PSAncmVwZWF0aW5nJyAmJiAhZm9yY2Vncm91cCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFJlcGVhdGluZ0dyb3VwVmFsdWVzKG5vZGUsIHBheWxvYWQpO1xuICAgICAgICAgICAgICAgICAgICBub2RlLm5vZGUuY29udHJvbC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRPYnNWYWx1ZShub2RlLCBwYXlsb2FkKSB7XG4gICAgICAgIGlmIChub2RlLnF1ZXN0aW9uICYmIG5vZGUucXVlc3Rpb24uZXh0cmFzICYmXG4gICAgICAgICAgICAobm9kZS5xdWVzdGlvbi5leHRyYXMudHlwZSA9PT0gJ29icycgfHxcbiAgICAgICAgICAgIChub2RlLnF1ZXN0aW9uLmV4dHJhcy50eXBlID09PSAnY29tcGxleC1vYnMtY2hpbGQnICYmXG4gICAgICAgICAgICBub2RlLnF1ZXN0aW9uLmV4dHJhcy5xdWVzdGlvbk9wdGlvbnMub2JzRmllbGQgPT09ICd2YWx1ZScpKSAmJlxuICAgICAgICAgICAgbm9kZS5xdWVzdGlvbi5leHRyYXMucXVlc3Rpb25PcHRpb25zLnJlbmRlcmluZyAhPT0gJ211bHRpQ2hlY2tib3gnIHx8XG4gICAgICAgICAgICBub2RlLnF1ZXN0aW9uLmV4dHJhcy5xdWVzdGlvbk9wdGlvbnMucmVuZGVyaW5nICE9PSAnY2hlY2tib3gnIHx8XG4gICAgICAgICAgICBub2RlLnF1ZXN0aW9uLmV4dHJhcy5xdWVzdGlvbk9wdGlvbnMucmVuZGVyaW5nICE9PSAnbXVsdGktc2VsZWN0Jykge1xuICAgICAgICAgICAgY29uc3Qgb2JzID0gXy5maW5kKHBheWxvYWQsIChvOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gby5jb25jZXB0LnV1aWQgPT09IG5vZGUucXVlc3Rpb24uZXh0cmFzLnF1ZXN0aW9uT3B0aW9ucy5jb25jZXB0O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAob2JzKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9icy52YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLmNvbnRyb2wuc2V0VmFsdWUob2JzLnZhbHVlLnV1aWQpO1xuICAgICAgICAgICAgICAgICAgICBub2RlLmNvbnRyb2wudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuY29udHJvbC5zZXRWYWx1ZShvYnMudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBub2RlLmNvbnRyb2wudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBub2RlWydpbml0aWFsVmFsdWUnXSA9IHsgb2JzVXVpZDogb2JzLnV1aWQsIHZhbHVlOiBvYnMudmFsdWUgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG11bHRpT2JzID0gXy5maWx0ZXIocGF5bG9hZCwgKG86IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBvLmNvbmNlcHQudXVpZCA9PT0gbm9kZS5xdWVzdGlvbi5leHRyYXMucXVlc3Rpb25PcHRpb25zLmNvbmNlcHQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChtdWx0aU9icyAmJiBtdWx0aU9icy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5jb250cm9sLnNldFZhbHVlKHRoaXMuZ2V0TXVsdGlzZWxlY3RWYWx1ZXMobXVsdGlPYnMpKTtcbiAgICAgICAgICAgICAgICBub2RlLmNvbnRyb2wudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpO1xuICAgICAgICAgICAgICAgIG5vZGVbJ2luaXRpYWxWYWx1ZSddID0gbXVsdGlPYnM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDb21wbGV4T2JzVmFsdWUobm9kZSwgcGF5bG9hZCkge1xuICAgICAgICBsZXQgdmFsdWVGaWVsZDogYW55O1xuICAgICAgICBsZXQgZGF0ZUZpZWxkOiBhbnk7XG5cbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmZvcmluXG4gICAgICAgIGZvciAoY29uc3QgbyBpbiBub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBpZiAoKG5vZGUuY2hpbGRyZW5bb10gYXMgTGVhZk5vZGUpLnF1ZXN0aW9uLmV4dHJhcy5xdWVzdGlvbk9wdGlvbnMub2JzRmllbGQgPT09ICd2YWx1ZScpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZUZpZWxkID0gbm9kZS5jaGlsZHJlbltvXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKChub2RlLmNoaWxkcmVuW29dIGFzIExlYWZOb2RlKS5xdWVzdGlvbi5leHRyYXMucXVlc3Rpb25PcHRpb25zLm9ic0ZpZWxkID09PSAnb2JzRGF0ZXRpbWUnKSB7XG4gICAgICAgICAgICAgICAgZGF0ZUZpZWxkID0gbm9kZS5jaGlsZHJlbltvXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBzZXQgdGhlIHVzdWFsIG9icyB2YWx1ZVxuICAgICAgICB0aGlzLnNldE9ic1ZhbHVlKHZhbHVlRmllbGQsIHBheWxvYWQpO1xuXG4gICAgICAgIC8vIHNldCB0aGUgb2JzIGRhdGVcbiAgICAgICAgY29uc3Qgb2JzID0gXy5maW5kKHBheWxvYWQsIChvOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBvLmNvbmNlcHQudXVpZCA9PT0gbm9kZS5xdWVzdGlvbi5leHRyYXMucXVlc3Rpb25PcHRpb25zLmNvbmNlcHQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChvYnMpIHtcbiAgICAgICAgICAgIGRhdGVGaWVsZFsnaW5pdGlhbFZhbHVlJ10gPSB7IG9ic1V1aWQ6IG9icy51dWlkLCB2YWx1ZTogb2JzLm9ic0RhdGV0aW1lIH07XG4gICAgICAgICAgICAoZGF0ZUZpZWxkIGFzIExlYWZOb2RlKS5jb250cm9sLnNldFZhbHVlKG9icy5vYnNEYXRldGltZSk7XG4gICAgICAgICAgICAoZGF0ZUZpZWxkIGFzIExlYWZOb2RlKS5jb250cm9sLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldE11bHRpc2VsZWN0VmFsdWVzKG11bHRpT2JzKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IG0gb2YgbXVsdGlPYnMpIHtcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKG0udmFsdWUudXVpZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9XG5cbiAgICBzZXRSZXBlYXRpbmdHcm91cFZhbHVlcyhub2RlLCBwYXlsb2FkKSB7XG4gICAgICAgIGNvbnN0IGdyb3VwUmVwZWF0aW5nT2JzID0gXy5maWx0ZXIocGF5bG9hZCwgKG86IGFueSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZm91bmQgPSBvLmNvbmNlcHQudXVpZCA9PT0gbm9kZS5xdWVzdGlvbi5leHRyYXMucXVlc3Rpb25PcHRpb25zLmNvbmNlcHQ7XG4gICAgICAgICAgICBsZXQgaW50ZXJzZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoZm91bmQgJiYgby5ncm91cE1lbWJlcnMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvYnMgPSBvLmdyb3VwTWVtYmVycy5tYXAoKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEuY29uY2VwdC51dWlkO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2NoZW1hUXVlc3Rpb25zID0gbm9kZS5xdWVzdGlvbi5xdWVzdGlvbnMubWFwKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhLmV4dHJhcy5xdWVzdGlvbk9wdGlvbnMuY29uY2VwdDtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGludGVyc2VjdCA9IChfLmludGVyc2VjdGlvbihvYnMsIHNjaGVtYVF1ZXN0aW9ucykubGVuZ3RoID4gMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZm91bmQgJiYgaW50ZXJzZWN0O1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGdyb3VwUmVwZWF0aW5nT2JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIG5vZGUubm9kZVsnaW5pdGlhbFZhbHVlJ10gPSBncm91cFJlcGVhdGluZ09icztcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBSZXBlYXRpbmdPYnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBub2RlLm5vZGUuY3JlYXRlQ2hpbGROb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZ3JvdXBzID0gW107XG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5ub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBjb25zdCBjaGlsZHJlbiA9IE9iamVjdC5rZXlzKGNoaWxkLmNoaWxkcmVuKS5tYXAoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gY2hpbGQuY2hpbGRyZW5ba2V5XTsgfSk7XG4gICAgICAgICAgICBjb25zdCBncm91cFBheWxvYWQgPSBncm91cFJlcGVhdGluZ09ic1tpbmRleF07XG4gICAgICAgICAgICBncm91cHMucHVzaCh7IHF1ZXN0aW9uOiBub2RlLnF1ZXN0aW9uLCBncm91cE1lbWJlcnM6IGNoaWxkcmVuLCBwYXlsb2FkOiBncm91cFBheWxvYWQgfSk7XG4gICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0VmFsdWVzKGdyb3VwcywgZ3JvdXBSZXBlYXRpbmdPYnMsIHRydWUpO1xuICAgIH1cblxuICAgIGdldFF1ZXN0aW9uTm9kZXMocGFnZXMpIHtcbiAgICAgICAgY29uc3QgbWVyZ2VkID0gW107XG4gICAgICAgIGNvbnN0IGFycmF5cyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHBhZ2Ugb2YgcGFnZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgc2VjdGlvbiBvZiBwYWdlLnBhZ2UpIHtcbiAgICAgICAgICAgICAgICBhcnJheXMucHVzaChzZWN0aW9uLnNlY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXJnZWQuY29uY2F0LmFwcGx5KFtdLCBhcnJheXMpO1xuICAgIH1cblxuICAgIHJlcGVhdGluZ0dyb3VwKG5vZGVzKSB7XG4gICAgICAgIGNvbnN0IHRvUmV0dXJuID0gW107XG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlcykge1xuICAgICAgICAgICAgdG9SZXR1cm4ucHVzaCh7IHF1ZXN0aW9uOiBub2RlLnF1ZXN0aW9uLCBncm91cE1lbWJlcnM6IHRoaXMudHJhdmVyc2Uobm9kZSkgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgIH1cblxuICAgIHByb2Nlc3NHcm91cChvYnMsIG9ic1BheWxvYWQpIHtcbiAgICAgICAgaWYgKG9icy5xdWVzdGlvbiAmJiBvYnMucXVlc3Rpb24uZXh0cmFzICYmIG9icy5xdWVzdGlvbi5leHRyYXMucXVlc3Rpb25PcHRpb25zLnJlbmRlcmluZyA9PT0gJ2dyb3VwJykge1xuICAgICAgICAgICAgY29uc3QgbWVtYmVycyA9IF8uZmlsdGVyKHRoaXMuZ2V0T2JzUGF5bG9hZChvYnMuZ3JvdXBNZW1iZXJzKSwgKG86IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBvLnZhbHVlICE9PSAnJztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBtYXBwZWRNZW1iZXJzID0gbWVtYmVycy5tYXAoKGEpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS52b2lkZWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChtZW1iZXJzLmxlbmd0aCA+IDAgJiYgbWFwcGVkTWVtYmVycy5ldmVyeShCb29sZWFuKSkge1xuICAgICAgICAgICAgICAgIG9ic1BheWxvYWQucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHV1aWQ6IG9icy5ub2RlLmluaXRpYWxWYWx1ZS51dWlkLFxuICAgICAgICAgICAgICAgICAgICB2b2lkZWQ6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWVtYmVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9icy5ub2RlLmluaXRpYWxWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBvYnNQYXlsb2FkLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXVpZDogb2JzLm5vZGUuaW5pdGlhbFZhbHVlLnV1aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cE1lbWJlcnM6IG1lbWJlcnNcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb2JzUGF5bG9hZC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmNlcHQ6IG9icy5xdWVzdGlvbi5leHRyYXMucXVlc3Rpb25PcHRpb25zLmNvbmNlcHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cE1lbWJlcnM6IG1lbWJlcnNcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWFwSW5pdGlhbEdyb3VwKGdyb3VwKSB7XG4gICAgICAgIGxldCBjdXJyZW50ID0ge307XG4gICAgICAgIGZvciAoY29uc3QgbWVtYmVyIG9mIGdyb3VwLmdyb3VwTWVtYmVycykge1xuICAgICAgICAgICAgbGV0IHZhbHVlOiBhbnkgPSAnJztcbiAgICAgICAgICAgIGlmIChtZW1iZXIudmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG1lbWJlci52YWx1ZS51dWlkO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtZW1iZXIudmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG1lbWJlci52YWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWVtYmVyLmdyb3VwTWVtYmVycyAmJiBtZW1iZXIuZ3JvdXBNZW1iZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gdGhpcy5tYXBJbml0aWFsR3JvdXAoZ3JvdXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudFttZW1iZXIuY29uY2VwdC51dWlkICsgJzonICsgdmFsdWVdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgfVxuXG4gICAgbWFwTW9kZWxHcm91cChub2RlLCB2YWx1ZSkge1xuICAgICAgICBjb25zdCBjdXJyZW50ID0ge307XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwUXVlc3Rpb246IGFueSA9IF8uZmluZChub2RlLnF1ZXN0aW9uLnF1ZXN0aW9ucywgeyBrZXk6IGtleSB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCBtb2RlbFZhbHVlID0gdmFsdWVba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAobW9kZWxWYWx1ZSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobW9kZWxWYWx1ZSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFtncm91cFF1ZXN0aW9uLmV4dHJhcy5xdWVzdGlvbk9wdGlvbnMuY29uY2VwdCArICc6J1xuICAgICAgICAgICAgICAgICAgICAgICAgKyBtb2RlbFZhbHVlXSA9IG1vZGVsVmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgfVxuXG4gICAgcHJvY2Vzc1JlcGVhdGluZ0dyb3Vwcyhub2RlLCBvYnNQYXlsb2FkKSB7XG4gICAgICAgIGNvbnN0IGluaXRpYWxWYWx1ZXMgPSBbXTtcbiAgICAgICAgaWYgKG5vZGUubm9kZS5pbml0aWFsVmFsdWUpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZ3JvdXAgb2Ygbm9kZS5ub2RlLmluaXRpYWxWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGluaXRpYWxWYWx1ZXMucHVzaCh7IHV1aWQ6IGdyb3VwLnV1aWQsIHZhbHVlOiB0aGlzLm1hcEluaXRpYWxHcm91cChncm91cCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVwZWF0aW5nTW9kZWwgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCB2YWx1ZSBvZiBub2RlLm5vZGUuY29udHJvbC52YWx1ZSkge1xuICAgICAgICAgICAgcmVwZWF0aW5nTW9kZWwucHVzaCh7IHZhbHVlOiB0aGlzLm1hcE1vZGVsR3JvdXAobm9kZSwgdmFsdWUpIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlbGV0ZWQgPSB0aGlzLmxlZnRPdXRlckpvaW5BcnJheXMoaW5pdGlhbFZhbHVlcywgcmVwZWF0aW5nTW9kZWwpO1xuICAgICAgICBjb25zdCBuZXdPYnMgPSB0aGlzLmxlZnRPdXRlckpvaW5BcnJheXMocmVwZWF0aW5nTW9kZWwsIGluaXRpYWxWYWx1ZXMpO1xuICAgICAgICBjb25zdCBncm91cENvbmNlcHQgPSBub2RlLnF1ZXN0aW9uLmV4dHJhcy5xdWVzdGlvbk9wdGlvbnMuY29uY2VwdDtcbiAgICAgICAgbGV0IG5ld09ic1BheWxvYWQgPSBbXTtcbiAgICAgICAgaWYgKGRlbGV0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgZGVsZXRlZE9icyA9IHRoaXMuY3JlYXRlR3JvdXBEZWxldGVkT2JzKGRlbGV0ZWQpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBkIG9mIGRlbGV0ZWRPYnMpIHtcbiAgICAgICAgICAgICAgICBvYnNQYXlsb2FkLnB1c2goZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobmV3T2JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBuZXdPYnNQYXlsb2FkID0gdGhpcy5jcmVhdGVHcm91cE5ld09icyhuZXdPYnMsIGdyb3VwQ29uY2VwdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdPYnNQYXlsb2FkID0gdGhpcy5jcmVhdGVHcm91cE5ld09icyhuZXdPYnMsIGdyb3VwQ29uY2VwdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV3T2JzUGF5bG9hZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHAgb2YgbmV3T2JzUGF5bG9hZCkge1xuICAgICAgICAgICAgICAgIG9ic1BheWxvYWQucHVzaChwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxlZnRPdXRlckpvaW5BcnJheXMoZmlyc3QsIHNlY29uZCkge1xuICAgICAgICBjb25zdCB1bmlxdWUgPSBmaXJzdC5maWx0ZXIoZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgcmV0dXJuICFzZWNvbmQuc29tZShmdW5jdGlvbiAob2JqMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBfLmlzRXF1YWwob2JqLnZhbHVlLCBvYmoyLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHVuaXF1ZTtcbiAgICB9XG5cbiAgICBjcmVhdGVHcm91cE5ld09icyhwYXlsb2FkLCBncm91cENvbmNlcHQpIHtcbiAgICAgICAgY29uc3QgbmV3UGF5bG9hZCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IG9icyBvZiBwYXlsb2FkKSB7XG4gICAgICAgICAgICBjb25zdCBncm91cFBheWxvYWQgPSBbXTtcbiAgICAgICAgICAgIC8qIHRzbGludDpkaXNhYmxlICovXG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gb2JzLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbmNlcHQgPSBrZXkuc3BsaXQoJzonKVswXTtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBrZXkuc3BsaXQoJzonKVsxXTtcbiAgICAgICAgICAgICAgICBncm91cFBheWxvYWQucHVzaCh7IGNvbmNlcHQ6IGNvbmNlcHQsIHZhbHVlOiB2YWx1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld1BheWxvYWQucHVzaCh7IGNvbmNlcHQ6IGdyb3VwQ29uY2VwdCwgZ3JvdXBNZW1iZXJzOiBncm91cFBheWxvYWQgfSlcbiAgICAgICAgICAgIC8qIHRzbGludDplbmFibGUgKi9cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3UGF5bG9hZDtcbiAgICB9XG5cbiAgICBjcmVhdGVHcm91cERlbGV0ZWRPYnMocGF5bG9hZCkge1xuICAgICAgICBjb25zdCBkZWxldGVkT2JzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgZCBvZiBwYXlsb2FkKSB7XG4gICAgICAgICAgICBkZWxldGVkT2JzLnB1c2goeyB1dWlkOiBkLnV1aWQsIHZvaWRlZDogdHJ1ZSB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVsZXRlZE9icztcbiAgICB9XG5cbiAgICBnZXRFeGFjdFRpbWUoZGF0ZXRpbWU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gZGF0ZXRpbWUuc3Vic3RyaW5nKDAsIDE5KS5yZXBsYWNlKCdUJywgJyAnKTtcbiAgICB9XG5cbiAgICBwcm9jZXNzT2JzKG9icywgb2JzUGF5bG9hZCkge1xuICAgICAgICBpZiAob2JzLmNvbnRyb2wgJiYgb2JzLnF1ZXN0aW9uLmV4dHJhcykge1xuICAgICAgICAgICAgY29uc3Qgb2JzVmFsdWUgPSB7XG4gICAgICAgICAgICAgICAgY29uY2VwdDogb2JzLnF1ZXN0aW9uLmV4dHJhcy5xdWVzdGlvbk9wdGlvbnMuY29uY2VwdCxcbiAgICAgICAgICAgICAgICB2YWx1ZTogKG9icy5xdWVzdGlvbi5leHRyYXMucXVlc3Rpb25PcHRpb25zLnJlbmRlcmluZyA9PT0gJ2RhdGUnICYmICF0aGlzLmlzRW1wdHkob2JzLmNvbnRyb2wudmFsdWUpKSA/XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0RXhhY3RUaW1lKG9icy5jb250cm9sLnZhbHVlKSA6IG9icy5jb250cm9sLnZhbHVlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAob2JzLnF1ZXN0aW9uLmV4dHJhcy5xdWVzdGlvbk9wdGlvbnMucmVuZGVyaW5nID09PSAnbXVsdGlDaGVja2JveCcgfHxcbiAgICAgICAgICAgIG9icy5xdWVzdGlvbi5leHRyYXMucXVlc3Rpb25PcHRpb25zLnJlbmRlcmluZyA9PT0gJ2NoZWNrYm94JyB8fFxuICAgICAgICAgICAgb2JzLnF1ZXN0aW9uLmV4dHJhcy5xdWVzdGlvbk9wdGlvbnMucmVuZGVyaW5nID09PSAnbXVsdGktc2VsZWN0Jykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG11bHRpcyA9IHRoaXMucHJvY2Vzc011bHRpU2VsZWN0KG9icy5xdWVzdGlvbi5leHRyYXMucXVlc3Rpb25PcHRpb25zLmNvbmNlcHQsIG9icy5jb250cm9sLnZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAob2JzLmluaXRpYWxWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXBwZWRJbml0aWFsID0gb2JzLmluaXRpYWxWYWx1ZS5tYXAoKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHV1aWQ6IGEudXVpZCwgdmFsdWU6IHsgY29uY2VwdDogYS5jb25jZXB0LnV1aWQsIHZhbHVlOiBhLnZhbHVlLnV1aWQgfSB9O1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWFwcGVkQ3VycmVudCA9IG11bHRpcy5tYXAoKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBhIH07XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkT2JzID0gdGhpcy5sZWZ0T3V0ZXJKb2luQXJyYXlzKG1hcHBlZEluaXRpYWwsIG1hcHBlZEN1cnJlbnQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdPYnMgPSB0aGlzLmxlZnRPdXRlckpvaW5BcnJheXMobWFwcGVkQ3VycmVudCwgbWFwcGVkSW5pdGlhbCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0RlbGV0ZWRNdWx0aVNlbGVjdE9icyhkZWxldGVkT2JzLCBvYnNQYXlsb2FkKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzTmV3TXVsdGlTZWxlY3RPYnMobmV3T2JzLCBvYnNQYXlsb2FkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NOZXdNdWx0aVNlbGVjdE9icyhtdWx0aXMsIG9ic1BheWxvYWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG9icy5pbml0aWFsVmFsdWUgJiYgb2JzLmluaXRpYWxWYWx1ZS52YWx1ZSAmJiBvYnNWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU9yVm9pZE9icyhvYnNWYWx1ZSwgb2JzLmluaXRpYWxWYWx1ZSwgb2JzUGF5bG9hZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvYnNWYWx1ZS52YWx1ZSAhPT0gJycgJiYgb2JzVmFsdWUudmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JzUGF5bG9hZC5wdXNoKG9ic1ZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm9jZXNzQ29tcGxleE9icyhub2RlLCBvYnNQYXlsb2FkKSB7XG4gICAgICAgIGxldCB2YWx1ZUZpZWxkOiBhbnk7XG4gICAgICAgIGxldCBkYXRlRmllbGQ6IGFueTtcblxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Zm9yaW5cbiAgICAgICAgZm9yIChjb25zdCBvIGluIG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGlmICgobm9kZS5jaGlsZHJlbltvXSBhcyBMZWFmTm9kZSkucXVlc3Rpb24uZXh0cmFzLnF1ZXN0aW9uT3B0aW9ucy5vYnNGaWVsZCA9PT0gJ3ZhbHVlJykge1xuICAgICAgICAgICAgICAgIHZhbHVlRmllbGQgPSBub2RlLmNoaWxkcmVuW29dO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoKG5vZGUuY2hpbGRyZW5bb10gYXMgTGVhZk5vZGUpLnF1ZXN0aW9uLmV4dHJhcy5xdWVzdGlvbk9wdGlvbnMub2JzRmllbGQgPT09ICdvYnNEYXRldGltZScpIHtcbiAgICAgICAgICAgICAgICBkYXRlRmllbGQgPSBub2RlLmNoaWxkcmVuW29dO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlRmllbGQpIHtcbiAgICAgICAgICAgIC8vIHByb2Nlc3Mgb2JzIGFzIHVzdWFsXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NPYnModmFsdWVGaWVsZCwgb2JzUGF5bG9hZCk7XG5cbiAgICAgICAgICAgIC8vIG9idGFpbiB0aGUgbGFzdCBpbnNlcnRlZCBvYnMgYW5kIHNldCB0aGUgb2JzRGF0ZXRpbWVcbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZWRQYXlsb2FkID0gb2JzUGF5bG9hZC5sZW5ndGggPiAwID8gb2JzUGF5bG9hZFtvYnNQYXlsb2FkLmxlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKGNyZWF0ZWRQYXlsb2FkICYmXG4gICAgICAgICAgICAgICAgKChjcmVhdGVkUGF5bG9hZC5jb25jZXB0ICYmIGNyZWF0ZWRQYXlsb2FkLmNvbmNlcHQgPT09IG5vZGUucXVlc3Rpb24uZXh0cmFzLnF1ZXN0aW9uT3B0aW9ucy5jb25jZXB0KSB8fFxuICAgICAgICAgICAgICAgICAgICAodmFsdWVGaWVsZC5pbml0aWFsVmFsdWUgJiYgY3JlYXRlZFBheWxvYWQudXVpZCA9PT0gdmFsdWVGaWVsZC5pbml0aWFsVmFsdWUub2JzVXVpZCkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGVGaWVsZC5pbml0aWFsVmFsdWUgJiYgZGF0ZUZpZWxkLmNvbnRyb2wudmFsdWUgIT09IGRhdGVGaWVsZC5pbml0aWFsVmFsdWUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZFBheWxvYWQub2JzRGF0ZXRpbWUgPSBkYXRlRmllbGQuY29udHJvbC52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm9jZXNzRGVsZXRlZE11bHRpU2VsZWN0T2JzKHZhbHVlcywgb2JzUGF5bG9hZCkge1xuICAgICAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgICAgICAgb2JzUGF5bG9hZC5wdXNoKHsgdXVpZDogdmFsdWUudXVpZCwgdm9pZGVkOiB0cnVlIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvY2Vzc05ld011bHRpU2VsZWN0T2JzKHZhbHVlcywgb2JzUGF5bG9hZCkge1xuICAgICAgICBmb3IgKGNvbnN0IG11bHRpIG9mIHZhbHVlcykge1xuICAgICAgICAgICAgaWYgKG11bHRpLnZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgb2JzUGF5bG9hZC5wdXNoKG11bHRpLnZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb2JzUGF5bG9hZC5wdXNoKG11bHRpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZU9yVm9pZE9icyhvYnNWYWx1ZSwgaW5pdGlhbFZhbHVlLCBvYnNQYXlsb2FkKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW1wdHkob2JzVmFsdWUudmFsdWUpICYmIGluaXRpYWxWYWx1ZS52YWx1ZSkge1xuICAgICAgICAgICAgb2JzUGF5bG9hZC5wdXNoKHsgdXVpZDogaW5pdGlhbFZhbHVlLm9ic1V1aWQsIHZvaWRlZDogdHJ1ZSB9KTtcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5pc0VtcHR5KG9ic1ZhbHVlLnZhbHVlKSAmJiBpbml0aWFsVmFsdWUudmFsdWUpIHtcbiAgICAgICAgICAgIG9ic1BheWxvYWQucHVzaCh7IHV1aWQ6IGluaXRpYWxWYWx1ZS5vYnNVdWlkLCB2YWx1ZTogb2JzVmFsdWUudmFsdWUgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc0VtcHR5KHZhbHVlKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gJycgfHxcbiAgICAgICAgICAgIHZhbHVlID09PSBudWxsIHx8XG4gICAgICAgICAgICB2YWx1ZSA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAvLyB8fCB2YWx1ZSA9PT0gW10gfHxcbiAgICAgICAgICAgIC8vIHZhbHVlID09PSB7fVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0cmF2ZXJzZShvLCB0eXBlPykge1xuICAgICAgICBjb25zdCBxdWVzdGlvbnMgPSBbXTtcbiAgICAgICAgaWYgKG8uY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGlmIChvLmNoaWxkcmVuIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXR1cm5lZCA9IHRoaXMucmVwZWF0aW5nR3JvdXAoby5jaGlsZHJlbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldHVybmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG8uY2hpbGRyZW4gaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBvLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvLmNoaWxkcmVuLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoby5jaGlsZHJlbltrZXldLnF1ZXN0aW9uLnJlbmRlcmluZ1R5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdwYWdlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFnZSA9IHRoaXMudHJhdmVyc2Uoby5jaGlsZHJlbltrZXldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb25zLnB1c2goeyBwYWdlOiBwYWdlLCBsYWJlbDogby5jaGlsZHJlbltrZXldLnF1ZXN0aW9uLmxhYmVsIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdzZWN0aW9uJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VjdGlvbiA9IHRoaXMudHJhdmVyc2Uoby5jaGlsZHJlbltrZXldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb25zLnB1c2goeyBzZWN0aW9uOiBzZWN0aW9uLCBub2RlOiBvLmNoaWxkcmVuW2tleV0sIGxhYmVsOiBvLmNoaWxkcmVuW2tleV0ucXVlc3Rpb24ubGFiZWwgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2dyb3VwJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcXMgPSB0aGlzLnRyYXZlcnNlKG8uY2hpbGRyZW5ba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9ucy5wdXNoKHsgbm9kZTogby5jaGlsZHJlbltrZXldLCBxdWVzdGlvbjogby5jaGlsZHJlbltrZXldLnF1ZXN0aW9uLCBncm91cE1lbWJlcnM6IHFzIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdyZXBlYXRpbmcnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXAgPSB0aGlzLnJlcGVhdGluZ0dyb3VwKG8uY2hpbGRyZW5ba2V5XS5jaGlsZHJlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9ucy5wdXNoKHsgbm9kZTogby5jaGlsZHJlbltrZXldLCBxdWVzdGlvbjogby5jaGlsZHJlbltrZXldLnF1ZXN0aW9uLCBncm91cE1lbWJlcnM6IHJlcCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb25zLnB1c2goby5jaGlsZHJlbltrZXldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBxdWVzdGlvbnM7XG4gICAgfVxuXG4gICAgcHJvY2Vzc011bHRpU2VsZWN0KGNvbmNlcHQsIHZhbHVlcykge1xuICAgICAgICBjb25zdCBtdWx0aVNlbGVjdE9icyA9IFtdO1xuICAgICAgICBpZiAodmFsdWVzICYmIHZhbHVlcyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvYnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmNlcHQ6IGNvbmNlcHQsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbXVsdGlTZWxlY3RPYnMucHVzaChvYnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtdWx0aVNlbGVjdE9icztcbiAgICB9XG5cblxuICAgIGlzT2JzKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIChub2RlLnF1ZXN0aW9uLmV4dHJhcy50eXBlID09PSAnb2JzJyB8fFxuICAgICAgICAgICAgbm9kZS5xdWVzdGlvbi5leHRyYXMudHlwZSA9PT0gJ29ic0dyb3VwJyB8fFxuICAgICAgICAgICAgbm9kZS5xdWVzdGlvbi5leHRyYXMudHlwZSA9PT0gJ2NvbXBsZXgtb2JzJyk7XG4gICAgfVxuXG4gICAgZ2V0T2JzUGF5bG9hZChub2Rlcykge1xuICAgICAgICBjb25zdCBvYnNQYXlsb2FkID0gW107XG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNPYnMobm9kZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5ncm91cE1lbWJlcnMsIG5vZGUucXVlc3Rpb24uZXh0cmFzLnF1ZXN0aW9uT3B0aW9ucy5yZW5kZXJpbmcgPT09ICdncm91cCcpIHtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NHcm91cChub2RlLCBvYnNQYXlsb2FkKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZS5ncm91cE1lbWJlcnMsIG5vZGUucXVlc3Rpb24uZXh0cmFzLnF1ZXN0aW9uT3B0aW9ucy5yZW5kZXJpbmcgPT09ICdyZXBlYXRpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc1JlcGVhdGluZ0dyb3Vwcyhub2RlLCBvYnNQYXlsb2FkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBHcm91cE5vZGUgJiYgKG5vZGUgYXMgR3JvdXBOb2RlKS5xdWVzdGlvbi5leHRyYXMudHlwZSA9PT0gJ2NvbXBsZXgtb2JzJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NDb21wbGV4T2JzKG5vZGUsIG9ic1BheWxvYWQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc09icyhub2RlLCBvYnNQYXlsb2FkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9ic1BheWxvYWQ7XG4gICAgfVxufVxuIl19