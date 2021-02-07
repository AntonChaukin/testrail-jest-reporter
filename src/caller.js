'use strict';
const chalk = require('chalk'), tr_api = require('./interface'), ReporterError = require('./error');
const error = chalk.bold.red;

module.exports = {
    init: init,
    add_results: add_results,
    get_tests:  get_tests
}

function init(_options) {
    this._baseUrl = _options.baseUrl ;
    this._milestone_name = _options.milestone;
    this._project_id = _options.project_id;
    tr_api.defaults.headers['Authorization'] = _options.auth;
    tr_api.defaults.baseUrl = this._baseUrl + '/index.php?/api/v2/';
}

function add_results(testsResults) {
        return Promise.all(
            testsResults.map(run => {
                return tr_api.add_results_for_cases(run.id, {"results": run.results});
            })
        )
            .then(response => {
                let count = 0;
                response.map(run => {
                    run.map((result) => {
                        if (result && result.id) count++;
                    });
                });
                return count;
            })
            .catch((err) => {
                console.log(error(err));
                return false;
            });
}

function get_tests() {
    this._milestone_id = null;
    this._runs_ids = [];
    this._tests = [];
    return tr_api.get_milestones(this._project_id, {is_completed: 0})
        .then(res => {
            const _milestone = res.filter((milestone) => milestone.name === this._milestone_name);

            if (_milestone && !!_milestone.length) {
                this._milestone_id = _milestone[0].id;
                return tr_api.get_plans(this._project_id, {is_completed: 0, milestone_id: this._milestone_id});
            }
            return false;
        })
        .then(res => {
            if (res) {
                return Promise.all(res.map(plan => tr_api.get_plan(plan.id)));
            }
            return false;
        })
        .catch((err) => {
            console.log(error(err.stack));
            return false;
        })
        .then(res => {
            if (res) {
                for(let i=0, res_len=res.length; i<res_len; i++) {
                    const plan = res[i];
                    for (let j=0, len = plan.entries.length; j<len; j++) {
                        plan.entries[j].runs.map(run => this._runs_ids.push(run.id));
                    }
                }
            }
            if (this._milestone_id) {
                return tr_api.get_runs(this._project_id, {is_completed: 0, milestone_id: this._milestone_id});
            }
            return false;
        })
        .catch((err) => {
            console.log(error(err.stack));
            return false;
        })
        .then(res => {
            if (res) {
                for (let i=0, len = res.length; i<len; i++) {
                    if (res[i] && res[i].id) this._runs_ids.push(res[i].id);
                }
            }
            if (!!this._runs_ids.length) {
                return Promise.all(this._runs_ids.map(id => tr_api.get_tests(id)));
            }
            return false;
        })
        .then(res => {
            if (res) {
                for(let i=0, len=res.length; i<len; i++) {
                    const tests = res[i];
                    for(let j=0, t_len=tests.length; j<t_len; j++) {
                        if (tests[j] && tests[j].case_id) this._tests
                            .push({"case_id": tests[j].case_id, "run_id": tests[j].run_id})
                    }
                }
            }
            if (!!this._tests.length) {
                this._tests = this._tests
                    .filter((test, i, arr) => !arr.slice(i+1).find(t => t.case_id === test.case_id));
                return this._tests;
            }
            throw new ReporterError(`There is no one Testrail testcase was finding in Project id=${this._project_id} 
                by milestone "${this._milestone_name}"`);
        })
        .catch((err) => {
            console.log(error(err.stack));
            return false;
        });
}