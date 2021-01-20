'use strict';
const process = require('process'), path = require('path'), rp = require('request-promise');
const chalk = require('chalk');
const DEFAULT_CONFIG_FILENAME = 'testrail.conf.js';
const configPath = path.resolve(process.cwd(), DEFAULT_CONFIG_FILENAME);
let {baseUrl, user, pass, milestone} = require(configPath);
const auth = {'user': user, 'pass': pass};
const error = chalk.bold.red;
const warning = chalk.keyword('orange');
let url = {
    "add_result_for_case": `add_result_for_case/`,
    "add_results_for_cases": `add_results_for_cases/`,
    "get_milestones": 'get_milestones/',
    "get_plans": 'get_plans/',
    "get_plan": 'get_plan/',
    "get_runs": 'get_runs/',
    "get_tests": 'get_tests/'
};
let base = null;

class Caller {
    _milestone_id = null;
    _plans_ids = null;
    _runs_ids = [];
    _tests = [];

    constructor(_options) {
        this._baseUrl = _options && _options.baseUrl || baseUrl;
        this._milestone_name = _options && _options.milestone || milestone;
        this._project_id = _options && _options.project_id;
        base = this._baseUrl + '/index.php?/api/v2/';
    }

    add_result_for_case(case_result, case_id, run_id) {
        return post(url.add_result_for_case + `${run_id}/${case_id}`, case_result);
    }

    add_results_for_cases(suitResults, run_id) {
        return post(url.add_results_for_cases + run_id, suitResults);
    }

    add_results(testsResults) {
        if (!testsResults.length && typeof testsResults[0] === "undefined") {
            console.log(error(`! Testrail Jest Reporter Error !`));
            console.log(warning(`Something was wrong with tests results! \n\nContexts: ${JSON.stringify(testsResults)}`));
            return Promise.resolve(false);
        }
        return Promise.all(testsResults.map(run => this.add_results_for_cases({"results": run.results}, run.id)))
            .then(responce => {
                let count = 0;
                responce.map(run => run.body.map(() => count++));
                return count;
            })
            .catch((err) => {
                console.log(error(err));
                return false;
            });
    }

    get_tests() {
        return this._get_milestone_id()
            .then(milestone_id => {
                if (milestone_id) {
                    this._milestone_id = milestone_id;
                    return this._get_plans_ids(this._milestone_id);
                }
                return false;
            })
            .then(plans_ids => {
                if (plans_ids) {
                    this._plans_ids = plans_ids;
                    return Promise.all(this._plans_ids.map(id => this._get_plan_runs_ids(id)));
                }
                return false;
            })
            .then(runs_ids => {
                if (runs_ids) runs_ids.map(ids => this._runs_ids = this._runs_ids.concat(ids));
                if (this._milestone_id) return this._get_runs_ids(this._milestone_id);
                return false;
            })
            .then(runs_ids => {
                if (runs_ids) this._runs_ids = this._runs_ids.concat(runs_ids);
                if (!!this._runs_ids.length) {
                    return Promise.all(this._runs_ids.map(id => this._get_tests_case_id(id)));
                }
                return false;
            })
            .then(tests => {
                if (tests) {
                    tests.map(item => this._tests = this._tests.concat(item));
                    this._tests = this._tests
                        .filter((test, i, arr) => !arr.slice(i+1).find(t => t.case_id === test.case_id));
                    return this._tests;
                }
                console.log(error(`! Testrail Jest Reporter Error !`));
                console.log(warning(`There is no one Testrail testcase was finding in Project ${project_id} by milestone ${milestone}`));
                return false;
            })
            .catch((err) => console.log(error(err)));
    }

    _get_milestone_id() {
        return get(url.get_milestones + this._project_id, {is_completed: 0})
            .then(res => {
                const _milestone = res.filter((milestone) => milestone.name === this._milestone_name);
                return !!_milestone.length && _milestone[0].id
            });
    }

    _get_plans_ids(milestone_id) {
        return get(url.get_plans + this._project_id, {is_completed: 0, milestone_id: milestone_id})
            .then(res => res.map(plan => plan.id));
    }

    _get_plan_runs_ids(plan_id) {
        return get(url.get_plan + plan_id)
            .then(res => {
                let _runs = [];
                for (let i=0, len = res.entries.length; i<len; i++) {
                    res.entries[i].runs.map(run => _runs.push(run.id));
                }
                return _runs;
            });
    }

    _get_runs_ids(milestone_id) {
        return get(url.get_runs + this._project_id, {is_completed: 0, milestone_id: milestone_id})
            .then(res => res.map(run => run.id));
    }

    _get_tests_case_id(run_id) {
        return get(url.get_tests + run_id)
            .then(res => {
                let _tests = [];
                for(let i=0, len = res.length; i<len; i++) {
                    _tests.push({"case_id": res[i].case_id, "run_id": res[i].run_id})
                }
                return _tests;
            });
    }
}

module.exports = Caller;

function post(path, data) {
    const options = {
        method: 'POST',
        uri: base + path,
        qs: {},
        auth: auth,
        body: data,
        headers: {'content-type': 'application/json'},
        json: true,
        jar: true,
        followAllRedirects: true,
        resolveWithFullResponse: true
    };
    return rp(options)
        .catch((err) => console.log(error(err)));
}
function get(path, qs = {}) {
    let options = {
        uri: base + path,
        qs: qs,
        auth: auth,
        headers: {'content-type': 'application/json'},
        json: true,
        jar: true
    };
    return rp(options)
        .catch((err) => {throw new Error(err)});
}