'use strict';
const chalk = require('chalk'), api = require('./test_interface');
const error = chalk.bold.red;
const warning = chalk.keyword('orange');

class Caller {
    _milestone_id = null;
    _runs_ids = [];
    _tests = [];

    constructor(_options) {
        this._baseUrl = _options.baseUrl ;
        this._milestone_name = _options.milestone;
        this._project_id = _options.project_id;
        api.defaults.headers['Authorization'] = _options.auth;
        api.defaults.uri = this._baseUrl + '/index.php?/api/v2/';
    }

    add_results(testsResults) {
        if (!testsResults.length && typeof testsResults[0] === "undefined") {
            console.log(error(`! Testrail Jest Reporter Error !`));
            console.log(warning(`Something was wrong with tests results! \n\nContexts: ${JSON.stringify(testsResults)}`));
            return Promise.resolve(false);
        }
        return Promise.all(
            testsResults.map(run => api.add_results_for_cases(run.id, {"results": run.results}))
        )
            .then(response => {
                let count = 0;
                response.map(run => run.body.map(() => count++));
                return count;
            })
            .catch((err) => {
                console.log(error(err));
                return false;
            });
    }

    get_tests() {
        return api.get_milestones(this._project_id, {is_completed: 0})
            .then(res => {
                const _milestone = res.filter((milestone) => milestone.name === this._milestone_name);
                if (!!_milestone.length) {
                    this._milestone_id = _milestone[0].id;
                    return api.get_plans(this._project_id, {is_completed: 0, milestone_id: this._milestone_id});
                }
                return false;
            })
            .then(res => {
                if (!!res.length) {
                    return Promise.all(res.map(plan => api.get_plan(plan.id)));
                }
                return false;
            })
            .then(res => {
                for(let i=0, res_len=res.length; i<res_len; i++) {
                    const plan = res[i];
                    for (let j=0, len = plan.entries.length; j<len; j++) {
                        plan.entries[j].runs.map(run => this._runs_ids.push(run.id));
                    }
                }
                if (this._milestone_id) {
                    return api.get_runs(this._project_id, {is_completed: 0, milestone_id: this._milestone_id});
                }
                return false;
            })
            .then(res => {
                for (let i=0, len = res.length; i<len; i++) {
                    this._runs_ids.push(res.id);
                }
                if (!!this._runs_ids.length) {
                    return Promise.all(this._runs_ids.map(id => api.get_tests(id)));
                }
                return false;
            })
            .then(res => {
                for(let i=0, len=res.length; i<len; i++) {
                    const tests = res[i];
                    for(let j=0, t_len=tests.length; j<t_len; j++) {
                        this._tests.push({"case_id": tests[j].case_id, "run_id": tests[j].run_id})
                    }
                }
                if (!!this._tests.length) {
                    this._tests = this._tests
                        .filter((test, i, arr) => !arr.slice(i+1).find(t => t.case_id === test.case_id));
                    return this._tests;
                }
                console.log(error(`! Testrail Jest Reporter Error !`));
                console.log(warning(`There is no one Testrail testcase was finding in Project ${this._project_id} by milestone ${this._milestone_name}`));
                return false;
            })
            .catch((err) => console.log(error(err)));
    }

}

module.exports = Caller;