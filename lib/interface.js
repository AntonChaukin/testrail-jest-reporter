'use strict';
const process = require('process'), path = require('path'), rp = require('request-promise');
const chalk = require('chalk');
const DEFAULT_CONFIG_FILENAME = 'testrail.conf.js';
const configPath = path.resolve(process.cwd(), DEFAULT_CONFIG_FILENAME);
let {baseUrl, user, pass} = require(configPath);
const error = chalk.bold.red;
let url = {
    "add_result_for_case": `add_result_for_case/`,
    "add_results_for_cases": `add_results_for_cases/`,
    "get_milestones": 'get_milestones/',
    "get_plans": 'get_plans/',
    "get_plan": 'get_plan/',
    "get_runs": 'get_runs/',
    "get_tests": 'get_tests/'
};

class Interface {
    constructor(options) {
        this.base = options && options.baseUrl || baseUrl;
        this._options = {
            uri: this.base + '/index.php?/api/v2/',
            headers: {
                'Authorization': 'Basic ' + new Buffer(user + ':' + pass).toString('base64'),
                'Content-Type': 'application/json'
            },
            json: true,
            jar: true
        };
    }

    add_result_for_case(run_id, case_id, case_result) {
        return this._post(url.add_result_for_case + `${run_id}/${case_id}`, case_result);
    }

    add_results_for_cases(run_id, cases_results) {
        return this._post(url.add_results_for_cases + run_id, cases_results);
    }

    /**
     *
     * @param {number} project_id
     * @param {object} filters
     * @param {boolean} filters.is_completed
     * @param {boolean} filters.is_started
     * @return {*}
     */
    get_milestones(project_id, filters) {
        return this._get(url.get_milestones + project_id, filters);
    }

    get_plan(plan_id) {
        return this._get(url.get_plan + plan_id);
    }

    /**
     *
     * @param {number} project_id
     * @param {object} filters
     * @param {boolean} filters.is_completed
     * @param {number} filters.milestone_id
     * @return {*}
     */
    get_plans(project_id, filters) {
        return this._get(url.get_plans + project_id, filters)
    }

    /**
     *
     * @param {number} project_id
     * @param {object} filters
     * @param {boolean} filters.is_completed
     * @param {number || string} filters.milestone_id A comma-separated list of milestone IDs to filter by.
     * @param {number || string} filters.suite_id A comma-separated list of test suite IDs to filter by.
     * @return {*}
     */
    get_runs(project_id, filters) {
        return this._get(url.get_runs + project_id, filters)
    }

    /**
     *
     * @param {number} run_id
     * @param {object} filters
     * @param {number || string} filters.status_id A comma-separated list of status IDs to filter by.
     * @return {*}
     */
    get_tests(run_id, filters) {
        return this._get(url.get_tests + run_id, filters);
    }

    _post(path, data) {
        const options = Object.assign({
            method: 'POST',
            uri: this._options.uri + path,
            body: data,
            followAllRedirects: true,
            resolveWithFullResponse: true
        }, this._options);
        return rp(options)
            .catch((err) => console.log(error(err)));
    }
    _get(path, qs = {}) {
        const options = Object.assign({
            uri: this._options.uri + path,
            qs: qs,
        }, this._options);
        return rp(options)
            .catch((err) => {throw new Error(err)});
    }
}

module.exports = Interface;