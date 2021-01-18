const process = require('process'), path = require('path'), rp = require('request-promise');
const chalk = require('chalk');
const DEFAULT_CONFIG_FILENAME = 'testrail.conf.js';
const configPath = path.resolve(process.cwd(), DEFAULT_CONFIG_FILENAME);
let {baseUrl, user, pass, milestone} = require(configPath);
const auth = {'user': user, 'pass': pass};
const error = chalk.bold.red;
const warning = chalk.keyword('orange');
let milestone_id = null, plans_ids = null, runs_ids = [], tests = [];
let url = {
    "add_result_for_case": `add_result_for_case/`,
    "add_results_for_cases": `add_results_for_cases/`,
    "get_milestones": 'get_milestones/',
    "get_plans": 'get_plans/',
    "get_plan": 'get_plan/',
    "get_runs": 'get_runs/',
    "get_tests": 'get_tests/'
};

module.exports = function (_options) {
    baseUrl = _options && _options.baseUrl || baseUrl;
    milestone = _options && _options.milestone || milestone;
    const base = baseUrl + '/index.php?/api/v2/';

    return {
        "add_result_for_case": add_result_for_case,
        "add_results_for_cases": add_results_for_cases,
        "get_milestone_id": get_milestone_id,
        "get_plans_ids": get_plans_ids,
        "get_plan_runs_ids": get_plan_runs_ids,
        "get_runs_ids": get_runs_ids,
        "get_tests_case_id": get_tests_case_id,
        "get_tests": get_tests,
        "add_results": add_results
    }

    function add_result_for_case(case_result, case_id, run_id) {
        return post(url.add_result_for_case + `${run_id}/${case_id}`, case_result);
    }

    function add_results_for_cases(suitResults, run_id) {
        return post(url.add_results_for_cases + run_id, suitResults);
    }

    function get_milestone_id(project_id) {
        return get(url.get_milestones + project_id, {is_completed: 0})
            .then(res => res.reduce((id, _milestone) => {
                if (_milestone.name === milestone) return _milestone.id
            }, null));
    }

    function get_plans_ids(project_id, milestone_id) {
        return get(url.get_plans + project_id, {is_completed: 0, milestone_id: milestone_id})
            .then(res => res.map(plan => plan.id));
    }

    function get_plan_runs_ids(plan_id) {
        return get(url.get_plan + plan_id)
            .then(res => res.entries.reduce((runs, entry) => runs.concat(entry.runs.map(run => run.id)), []));
    }

    function get_runs_ids(project_id, milestone_id) {
        return get(url.get_runs + project_id, {is_completed: 0, milestone_id: milestone_id})
            .then(res => res.map(run => run.id));
    }

    function get_tests_case_id(run_id) {
        return get(url.get_tests + run_id)
            .then(res => res.reduce((arr, test) => arr.concat({"case_id": test.case_id, "run_id": test.run_id}), []));
    }

    function get_tests(project_id) {
        return get_milestone_id(project_id)
            .then(_milestone_id => {
                if (_milestone_id) {
                    milestone_id = _milestone_id;
                    return get_plans_ids(project_id, milestone_id);
                }
                return false;
            })
            .then(_plans_ids => {
                if (_plans_ids) {
                    plans_ids = _plans_ids;
                    return Promise.all(plans_ids.map(id => get_plan_runs_ids(id)));
                }
                return false;
            })
            .then(_run_ids => {
                if (_run_ids) _run_ids.map(ids => runs_ids = runs_ids.concat(ids));
                if (milestone_id) return get_runs_ids(project_id, milestone_id);
                return false;
            })
            .then(_run_ids => {
                if (_run_ids) runs_ids = runs_ids.concat(_run_ids);
                if (!!runs_ids.length) {
                    return Promise.all(runs_ids.map(id => get_tests_case_id(id)));
                }
                return false;
            })
            .then(_tests => {
                if (_tests) {
                    _tests.map(item => tests = tests.concat(item));
                    tests = tests
                        .filter((test, i, arr) => !arr.slice(i+1).find(t => t.case_id === test.case_id));
                    return tests;
                }
                console.log(error(`! Testrail Jest Reporter Error !`));
                console.log(warning(`There is no one Testrail testcase was finding in Project ${project_id} by milestone ${milestone}`));
                return false;
            })
            .catch((err) => console.log(error(JSON.stringify(err))));
    }

    function add_results(testsResults) {
        if (!!testsResults.length && typeof testsResults[0] !== "undefined") {
            return Promise.all(testsResults.map(run => add_results_for_cases({"results": run.results}, run.id)));
        }
        console.log(error(`! Testrail Jest Reporter Error !`));
        console.log(warning(`Something was wrong with tests results! \n\nContexts: ${JSON.stringify(testsResults)}`));
        return Promise.resolve(false);
    }

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
            .catch((err) => console.log(error(JSON.stringify(err))));
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
}
