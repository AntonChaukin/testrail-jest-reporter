'use strict';
const chalk = require('chalk'), tr_api = require('../lib/interface'), ReporterError = require('../lib/error'),
    Utils = require('./utils');
const utils = new Utils();
const Ajv = require("ajv").default;
const ajv = new Ajv({
    strict: false,
    allErrors: true,
});
const error = chalk.bold.red;

module.exports = {
    init,
    get_milestone_id,
    add_results,
    get_tests
}

function init(_options) {
    this._baseUrl = _options.baseUrl ;
    this._milestone_name = _options.milestone;
    this._project_id = _options.project_id;
    this._suite_mode = _options.suite_mode;
    this._run_update = _options.run_update;
    tr_api.defaults.headers['Authorization'] = _options.auth;
    tr_api.defaults.baseUrl = this._baseUrl + '/index.php?/api/v2/';
}

/**
 *
 * @param {array<object>} testsResults
 * @return {Promise<number | boolean>}
 */
async function add_results(testsResults) {
    const results = utils.groupCases(testsResults, this._tests);
    let runs = results.filter(result => result.hasOwnProperty('run_id'));
    const cases = results.filter(result => result.hasOwnProperty('case_id'));
    if (!!cases.length) {
        const updated_runs = await update_run.call(this, cases);
        runs = runs.concat(updated_runs);
    }
    return Promise.all(
        runs.map(run => {
            return tr_api.add_results_for_cases(run.run_id, {"results": run.results});
        })
    )
        .then(response => {
            let tests_count = 0;
            response.map(run => {
                run.map((result) => {
                    if (result && result.id) tests_count++;
                });
            });
            let runs_ids = runs.map(run => run.run_id).filter((id, i, arr) => !arr.includes(id,i+1))
            return {tests_count, runs_count: runs_ids.length};
        })
        .catch((err) => {
            console.log(error(err));
            return false;
        });
}

function get_milestone_id() {
    this._milestone_id = null;
    return get_suite_mode.call(this)
        .then(() => tr_api.get_milestones(this._project_id, {is_completed: 0}))
        .then(res => {
            const _milestone = res.filter((milestone) => milestone.name === this._milestone_name);
            if (_milestone && !!_milestone.length) {
                this._milestone_id = _milestone[0].id;
            } else {
                throw new ReporterError(`Can not find milestone with name ${this._milestone_name}!
                \nNo one tests results will be reported.
                \nPlease, check the "milestone" param you specified in congif and try again`)
            }
        })
        .catch(e => {
            console.log(error(e.stack));
        })
}

function get_tests() {
    this._runs_ids = [];
    this._tests = [];
    return tr_api.get_plans(this._project_id, {is_completed: 0, milestone_id: this._milestone_id})
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
                        plan.entries[j].runs
                            .map(run => {
                                this._runs_ids
                                    .push({id: run.id, suite_id: run.suite_id, plan_id: run.plan_id})
                            });
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
                    if (res[i] && res[i].id) this._runs_ids
                        .push({id: res[i].id, suite_id: res[i].suite_id, plan_id: null});
                }
            }
            if (!!this._runs_ids.length) {
                return Promise.all(this._runs_ids.map(run => tr_api.get_tests(run.id)));
            }
            return false;
        })
        .then(res => {
            if (res) {
                for(let i=0, len=res.length; i<len; i++) {
                    const tests = res[i];
                    for(let j=0, t_len=tests.length; j<t_len; j++) {
                        if (tests[j] && tests[j].case_id) {
                            this._tests.push({"case_id": tests[j].case_id, "run_id": tests[j].run_id})
                        }
                    }
                }
            }
            if (!!this._tests.length) {
                this._tests = this._tests
                    .filter((test, i, arr) => !arr.slice(i+1).find(t => t.case_id === test.case_id));
            }
        })
        .catch((err) => {
            console.log(error(err.stack));
        });
}

function get_suite_mode() {
    if (!this._suite_mode) {
        return tr_api.get_project(this._project_id)
            .then(resp => this._suite_mode = resp.suite_mode)
            .catch(e => {
                this._suite_mode = 2;
                console.log(error(`The trying to get TestRail Project was failed!
                \n The suite mode was defined as 2 by default.
                \n Context: ${e.stack}`))
            });
    }
    return Promise.resolve();
}

/**
 *
 * @param {object} cases
 * @return {Promise<[]>}
 */
async function update_run(cases) {
    const valid = ajv.validate({
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "case_id": {
                        "type": "integer"
                    },
                    "result": {
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
                    }
                },
                "required": ["case_id", "result"]
            }
        },
        cases);
    if (!valid) {
        console.log(error(`\nCan not update list of cases of test Run: JSON schema error
                    \nNew test cases was not added to test Run
                    \nContext: ${JSON.stringify(cases)}\n${JSON.stringify(ajv.errors, null, 2)}`));
        return [];
    }
    let run_data;
    let suits = [];
    let runs = [];
    let _update = false;

    if(this._run_update && !!this._runs_ids.length) _update = true

    if (this._suite_mode === 1) {
        let case_ids = cases.map(c => c.case_id);
        let results = cases.map(c => c.result);
        suits.push({case_ids, results})
    } else {
        for (let i=0, i_len=cases.length; i<i_len; i++) {
            let suite_id = null;
            try {
                const resp = await tr_api.get_case(cases[i].case_id);
                suite_id = resp.suite_id;
            }
            catch (e) {
                console.log(error(e.stack));
            }
            const index = suits.findIndex(suite => suite.suite_id === suite_id);
            if (~index) {
                suits[index].case_ids.push(cases[i].case_id);
                suits[index].results.push(cases[i].result);
            } else if (suite_id) {
                suits.push({suite_id, case_ids: [cases[i].case_id], results: [cases[i].result]})
            }
        }
    }

    for (let j=0, j_len=suits.length; j<j_len; j++) {
        let run = null;
        if (_update && suits[j].suite_id) {
            run = this._runs_ids.find(run => run.suite_id === suits[j].suite_id && !run.plan_id);
        } else if (_update) {run = this._runs_ids[0]}

        if (run) {
            for (let i=0, len=this._tests.length; i<len; i++) {
                if(this._tests[i].run_id === run.id) {
                    suits[j].case_ids.push(this._tests[i].case_id)
                }
            }
            run_data = {"include_all": false, "case_ids": suits[j].case_ids, "milestone_id": this._milestone_id};
            try {
                const {id} = await tr_api.update_run(run.id, run_data);
                runs.push({run_id: id, results: suits[j].results});
            }
            catch (e) {
                console.log(error(e.stack));
            }
        } else {
            const today = new Date;
            let suite_name = 'Automated Run';
            if(suits[j].suite_id) {
                try {
                    const {name} = await tr_api.get_suite(suits[j].suite_id);
                    suite_name = name;
                }
                catch (e) {
                    console.log(error(e.stack));
                }
                run_data = {"suite_id": suits[j].suite_id,
                    "name": suite_name + ` ${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`,
                    "include_all": false,
                    "case_ids": suits[j].case_ids,
                    "milestone_id": this._milestone_id
                };
            }
            else {
                run_data = {"name": suite_name + ` ${today.getDate()}.${today.getMonth()+1}.${today.getFullYear()}`,
                    "include_all": false,
                    "case_ids": suits[j].case_ids,
                    "milestone_id": this._milestone_id
                };
            }
            try {
                const {id} = await tr_api.add_run(this._project_id, run_data);
                runs.push({run_id: id, results: suits[j].results})
            }
            catch (e) {
                console.log(error(e.stack));
            }
        }
    }

    return runs;
}