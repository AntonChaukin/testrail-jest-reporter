'use strict';

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
                    "case_id": parseInt(cases_ids[i].slice(1)),
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
        const _t = title.match(regex);
        return _t;
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

    merge = merge
    isPlainObject = isPlainObject
    isArray = isArray

}

module.exports = Utils;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
    let result = {};
    function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
            result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
            result[key] = merge({}, val);
        } else if (isArray(val)) {
            result[key] = val.slice();
        } else {
            result[key] = val;
        }
    }

    for (let i = 0, l = arguments.length; i < l; i++) {
        this.forEach(arguments[i], assignValue);
    }
    return result;
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
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
function isArray(val) {
    return toString.call(val) === '[object Array]';
}