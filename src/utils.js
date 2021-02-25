'use strict';
require('@babel/plugin-syntax-class-properties');
const chalk = require('chalk'), Ajv = require("ajv").default;
const ajv = new Ajv({
    strict: false,
    allErrors: true,
});
const error = chalk.bold.red;

class Utils {
    constructor(_options) {
        this._regex = _options && _options.regex || /[C][?\d]{3,6}/gm;
        this._statuses = _options && _options.statuses || {};
        this._status = {
            "failed": 5,
            "passed": 1,
            "pending": this._statuses.pending || this._statuses.skipped || 4,  // "Retest" in TestRail. Need to remove by custom "Skipped" status
        };
    }

    formatCase(testResult) {
        let cases = [];
        const cases_ids = this._formatTitle(testResult.title);
        if (cases_ids) {
            const message = !!testResult.failureMessages.length ? testResult.failureMessages : `**${testResult.status}**`;
            const elapsed = this._formatTime(testResult.duration);
            const status_id = this._status[testResult.status];
            const comment = `#${testResult.ancestorTitles}#`
                + '\n' + testResult.title
                + '\n' + message;
            for (let i=0, len = cases_ids.length; i<len; i++) {
                cases.push({
                    "case_id": parseInt(cases_ids[i]),
                    "status_id": status_id,
                    "comment": comment,
                    "elapsed": elapsed || "",
                    "defects": "",
                    "version": "",
                })
            }
            return cases;
        }
        return false;
    }

    _formatTime(ms) {
        const milsecond = 1000;
        const second = 60;
        const minute = 60;
        if (ms >= minute*second*milsecond) {
            const h = Math.floor(ms/(minute*second*milsecond));
            const m = Math.floor(ms/(second*milsecond)) - h*minute;
            const s = Math.round(ms/milsecond) - m*second;
            return `${h}h ${m}m ${s}s`;
        }
        if (ms >= second*milsecond) {
            const m = Math.floor(ms/(second*milsecond));
            const s = Math.round(ms/milsecond) - m*second;
            return `${m}m ${s}s`;
        }
        if (ms === 0) return false;
        let s = Math.round(ms/milsecond);
        s = !!s ? s : 1;
        return `${s}s`;
    }

    _formatTitle(title) {
        const regex = this._regex;
        const case_ids = [];
        let _t = title.match(regex);
        _t = _t || [];
        for (let i=0, len=_t.length; i<len; i++) {
            case_ids.push(_t[i].match(/\d+/gm)[0])
        }
        return case_ids.length && case_ids;
    }

    forEach(obj, fn) {
        // Don't bother if no value provided
        if (obj === null || typeof obj === 'undefined') {
            return;
        }
        // Force an array if not already something iterable
        if (typeof obj !== 'object') {
            obj = [obj];
        }
        if (this.isArray(obj)) {
            // Iterate over array values
            for (let i = 0, l = obj.length; i < l; i++) {
                fn.call(null, obj[i], i, obj);
            }
        } else {
            // Iterate over object keys
            for (let key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    fn.call(null, obj[key], key, obj);
                }
            }
        }
    }

    /**
     * Group jest test results in a testrail runs or a single cases
     *
     * @param {array} jest_result_list
     * @param {array} tr_tests
     * @return {[] || [{case_id, result}, {run_id, results}]}
     */
    groupCases(jest_result_list, tr_tests) {
        const valid_results = ajv.validate({
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "case_id": {
                            "type": "integer"
                        },
                        "status_id": {
                            "type": "integer"
                        },
                        "comment": {
                            "type": "string"
                        },
                        "elapsed": {
                            "type": "string"
                        },
                        "defects": {
                            "type": "string"
                        },
                        "version": {
                            "type": "string"
                        }
                    },
                    "required": ["case_id", "status_id", "comment", "elapsed"]
                }
            },
            jest_result_list);
        if (!valid_results ) {
            console.log(error(`\nCan not update cases of test JSON schema error
                    \nContext: ${JSON.stringify(ajv.errors, null, 2)}`));
            return [];
        }
        const valid_tests_list = ajv.validate({
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "case_id": {
                            "type": "integer"
                        },
                        "run_id": {
                            "type": "integer"
                        }
                    },
                    "required": ["case_id", "run_id"]
                }
            },
            tr_tests);
        if (!valid_tests_list) {
            console.log(error(`\nCan not update cases of test JSON schema error
                    \nContext: ${JSON.stringify(ajv.errors, null, 2)}`));
            return [];
        }
        let results = [];
        for (let i=0, len = jest_result_list.length; i<len; i++) {
            const test = tr_tests ?
                tr_tests.find(test => test.case_id === jest_result_list[i].case_id)
                : null;
            if (test) {
                const index = results.findIndex(run => run.run_id === test.run_id);
                if (~index) results[index].results.push(jest_result_list[i]);
                else results.push({run_id: test.run_id, "results": [jest_result_list[i]]});
            } else {
                results.push({case_id: jest_result_list[i].case_id, "result": jest_result_list[i]})
            }
        }
        return results;
    }

    /**
     * Determine if a value is a plain Object
     *
     * @param {Object} val The value to test
     * @return {boolean} True if value is a plain Object, otherwise false
     */
    isPlainObject(val) {
        if (toString.call(val) !== '[object Object]') {
            return false;
        }

        const prototype = Object.getPrototypeOf(val);
        return prototype === null || prototype === Object.prototype;
    }

    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Array, otherwise false
     */
    isArray(val) {
        return toString.call(val) === '[object Array]';
    }

}

module.exports = Utils;

