const chalk = require('chalk');
const Utils = require('../src/utils');
const error = chalk.bold.red;
const {passed, duration, name, tr_get_project,
    tr_milestone, tr_plan, tr_run, tr_test, tr_result} = require('./sample');

describe('Caller tests', function () {
    let runs_len, milestone_name, milestone, milestone_id, get_milestones_resp,
        get_plan_resp, get_plans_resp, run, get_runs_resp, case_1, case_2,
        test_1, test_2, get_project_resp;

    beforeEach(() => {
        runs_len = 0;
        milestone_name = name();
        get_project_resp = tr_get_project();
        milestone = tr_milestone({name: milestone_name});
        milestone_id = milestone.id;
        get_milestones_resp = [tr_milestone(), milestone];
        get_plan_resp = tr_plan({milestone_id: milestone_id});
        get_plans_resp = [Object.assign({}, get_plan_resp)];
        for(let i=0, i_len = get_plan_resp.entries.length; i<i_len; i++) {
            let entry = get_plan_resp.entries[i];
            for(let j=0, j_len=entry.runs.length; j<j_len; j++) {runs_len++}
        }
        run = tr_run({milestone_id: milestone_id});
        get_runs_resp = [run];
        case_1 = {'case_id': duration(), 'run_id': run.id};
        case_2 = {'case_id': duration(), 'run_id': get_plan_resp.entries[0].runs[0].id};
        test_1 = tr_test(case_1);
        test_2 = tr_test(case_2);
    });

    describe('get_milestone_id', function () {

        it('get_milestone_id successful "suite_mode" was not defined', async () => {
            const caller = require('../src/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: 1});

            const get_project_spy = jest.spyOn(api, 'get_project')
                .mockResolvedValueOnce(tr_get_project({suite_mode: 2}));
            const get_milestones_spy = jest.spyOn(api, 'get_milestones')
                .mockResolvedValueOnce(get_milestones_resp);

            await caller.get_milestone_id();
            get_milestones_spy.mockRestore();

            expect(get_project_spy).toHaveBeenCalledTimes(1);
            expect(get_project_spy).toHaveBeenCalledWith(1);
            expect(caller._suite_mode).toEqual(2);
            expect(caller._milestone_id).toEqual(milestone_id);
            get_project_spy.mockRestore();
        });

        it('get_milestone_id successful "suite_mode" was defined', async () => {
            const caller = require('../src/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: 1, suite_mode: 2});

            const get_project_spy = jest.spyOn(api, 'get_project');
            const get_milestones_spy = jest.spyOn(api, 'get_milestones')
                .mockResolvedValueOnce(get_milestones_resp);

            await caller.get_milestone_id();
            get_milestones_spy.mockRestore();

            expect(get_project_spy).toHaveBeenCalledTimes(0);
            get_project_spy.mockRestore();
            expect(caller._milestone_id).toEqual(milestone_id);
        });

        it('get_milestone_id if "get_project" rejected', async () => {
            const caller = require('../src/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: 1});

            const get_project_spy = jest.spyOn(api, 'get_project')
                .mockRejectedValueOnce(new Error('Request rejected'));
            const get_milestones_spy = jest.spyOn(api, 'get_milestones')
                .mockResolvedValueOnce(get_milestones_resp);

            await caller.get_milestone_id();
            get_milestones_spy.mockRestore();

            expect(caller._milestone_id).toEqual(milestone_id);
            expect(get_project_spy).toHaveBeenCalledTimes(1);
            expect(get_project_spy).toHaveBeenCalledWith(1);
            expect(caller._suite_mode).toEqual(2);
            get_project_spy.mockRestore();
        });

        it('get_milestone_id if get_milestones rejected', async () => {
            const caller = require('../src/caller');
            const api = require('../lib/interface');
            const err = new Error('Request rejected');
            caller.init({milestone: milestone_name, project_id: 1, suite_mode: 2});

            const log_spy = jest.spyOn(global.console, 'log');
            const get_milestones_spy = jest.spyOn(api, 'get_milestones').mockRejectedValueOnce(err);

            await caller.get_milestone_id();
            get_milestones_spy.mockRestore();
            expect(caller._milestone_id).toBeFalsy();
            expect(log_spy).toHaveBeenCalledTimes(1);
            expect(log_spy).toHaveBeenCalledWith(error(err.stack));
            log_spy.mockRestore();
        });

        it('get_milestone_id if milestone name was not found', async () => {
            const caller = require('../src/caller');
            const api = require('../lib/interface');

            caller.init({milestone: 'Sprint 1', project_id: 1, suite_mode: 2});
            const log_spy = jest.spyOn(global.console, 'log');
            const get_milestones_spy = jest.spyOn(api, 'get_milestones')
                .mockResolvedValueOnce(get_milestones_resp);

            await caller.get_milestone_id();
            get_milestones_spy.mockRestore();

            expect(log_spy).toHaveBeenCalledTimes(1);
            log_spy.mockRestore();
            expect(caller._milestone_id).toBeFalsy();
        });

    });

    describe('get_tests', function () {

        it('get_tests successful', async () => {
            const caller = require('../src/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: 1});
            caller._milestone_id = milestone_id;
            jest.spyOn(api, 'get_plans').mockResolvedValueOnce(get_plans_resp);
            jest.spyOn(api, 'get_plan').mockResolvedValueOnce(get_plan_resp);
            jest.spyOn(api, 'get_runs').mockResolvedValueOnce(get_runs_resp);
            const get_tests_spy = jest.spyOn(api, 'get_tests')
                .mockResolvedValueOnce([test_1])
                .mockResolvedValueOnce([test_2])
                .mockResolvedValue([]);

            await caller.get_tests();
            get_tests_spy.mockRestore();

            expect(caller._tests).toEqual([case_1, case_2]);
            expect(caller._runs_ids).toHaveLength(runs_len+1);
        });

        it('get_tests if get_plans rejected', async () => {
            const caller = require('../src/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: 1, suite_mode: 2});
            caller._milestone_id = milestone_id;
            jest.spyOn(api, 'get_plans').mockRejectedValueOnce(new Error('Request rejected'));
            const get_plan_spy = jest.spyOn(api, 'get_plan').mockResolvedValueOnce(get_plan_resp);
            jest.spyOn(api, 'get_runs').mockResolvedValueOnce(get_runs_resp);
            const get_tests_spy = jest.spyOn(api, 'get_tests')
                .mockResolvedValueOnce([test_1])
                .mockResolvedValueOnce([test_2])
                .mockResolvedValue([]);

            await caller.get_tests();
            get_plan_spy.mockRestore();
            get_tests_spy.mockRestore();

            expect(caller._tests).toEqual([case_1]);
            expect(caller._runs_ids).toHaveLength(1);
        });

        it('get_tests if get_plan rejected', async () => {
            const caller = require('../src/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: 1, suite_mode: 2});
            caller._milestone_id = milestone_id;
            jest.spyOn(api, 'get_plans').mockResolvedValueOnce(get_plans_resp);
            jest.spyOn(api, 'get_plan').mockRejectedValueOnce(new Error('Request rejected'));
            const get_runs_spy = jest.spyOn(api, 'get_runs').mockResolvedValueOnce(get_runs_resp);
            const get_tests_spy = jest.spyOn(api, 'get_tests')
                .mockResolvedValueOnce([test_1])
                .mockResolvedValueOnce([test_2])
                .mockResolvedValue([]);

            await caller.get_tests();
            get_runs_spy.mockRestore()
            get_tests_spy.mockRestore();

            expect(caller._tests).toEqual([case_1]);
            expect(caller._runs_ids).toHaveLength(1);
        });

        it('get_tests if get_runs rejected', async () => {
            const caller = require('../src/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: 1, suite_mode: 2});
            caller._milestone_id = milestone_id;
            jest.spyOn(api, 'get_plans').mockResolvedValueOnce(get_plans_resp);
            jest.spyOn(api, 'get_plan').mockResolvedValueOnce(get_plan_resp);
            jest.spyOn(api, 'get_runs').mockRejectedValueOnce(new Error('Request rejected'));
            const get_tests_spy = jest.spyOn(api, 'get_tests').mockResolvedValueOnce([test_2])
                .mockResolvedValue([]);

            await caller.get_tests();
            get_tests_spy.mockRestore();

            expect(caller._tests).toEqual([case_2]);
            expect(caller._runs_ids).toHaveLength(runs_len);
        });

        it('get_tests if get_tests rejected', async () => {
            const caller = require('../src/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: 1, suite_mode: 2});
            caller._milestone_id = milestone_id;
            jest.spyOn(api, 'get_plans').mockResolvedValueOnce(get_plans_resp);
            jest.spyOn(api, 'get_plan').mockResolvedValueOnce(get_plan_resp);
            jest.spyOn(api, 'get_runs').mockResolvedValueOnce(get_runs_resp);
            const get_tests_spy = jest.spyOn(api, 'get_tests')
                .mockRejectedValueOnce(new Error('Request rejected'));

            const resp = await caller.get_tests();
            get_tests_spy.mockRestore();

            expect(resp).toBeFalsy();
            expect(caller._tests).toEqual([]);
            expect(caller._runs_ids).toHaveLength(runs_len+1);
        });

    });

    describe('add_results', function () {

        it('add_results successful with tests', async() => {
            const api = require('../lib/interface');
            const caller = require('../src/caller');
            let utils = new Utils();
            const testResult = passed();
            const [testcase] = utils.formatCase(testResult);
            const resp = {statusCode: 200, body: [tr_result(testcase)]};
            caller._tests = [{case_id: testResult.duration, run_id: 1}];
            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases')
                .mockResolvedValueOnce(resp.body);
            const get_case_spy = jest.spyOn(api, 'get_case');
            const get_suite_spy = jest.spyOn(api, 'get_suite');
            const update_run_spy = jest.spyOn(api, 'update_run');
            const add_run_spy = jest.spyOn(api, 'add_run');

            const res = await caller.add_results([testcase]);

            expect(add_results_for_cases_spy).toHaveBeenCalledTimes(1);
            expect(add_results_for_cases_spy).toHaveBeenCalledWith(1, {"results": [testcase]});
            expect(get_case_spy).toHaveBeenCalledTimes(0)
            expect(get_suite_spy).toHaveBeenCalledTimes(0)
            expect(update_run_spy).toHaveBeenCalledTimes(0)
            expect(add_run_spy).toHaveBeenCalledTimes(0)
            add_results_for_cases_spy.mockRestore();
            expect(res).toEqual({"runs_count": 1, "tests_count": 1});
        });

        it('add_results with wrong results: array', async() => {

            const api = require('../lib/interface');
            const caller = require('../src/caller');
            let utils = new Utils();
            const testResult = passed();
            const [testcase] = utils.formatCase(testResult);
            caller._tests = [{case_id: testResult.duration, run_id: 1}];
            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases');
            const get_case_spy = jest.spyOn(api, 'get_case');
            const get_suite_spy = jest.spyOn(api, 'get_suite');
            const update_run_spy = jest.spyOn(api, 'update_run');
            const add_run_spy = jest.spyOn(api, 'add_run');

            const res = await caller.add_results([[testcase]]);

            expect(add_results_for_cases_spy).toHaveBeenCalledTimes(0);
            expect(get_case_spy).toHaveBeenCalledTimes(0)
            expect(get_suite_spy).toHaveBeenCalledTimes(0)
            expect(update_run_spy).toHaveBeenCalledTimes(0)
            expect(add_run_spy).toHaveBeenCalledTimes(0)
            add_results_for_cases_spy.mockRestore();
            expect(res).toEqual({"runs_count": 0, "tests_count": 0});
        });

        it('add_results with wrong tests: array', async() => {

            const api = require('../lib/interface');
            const caller = require('../src/caller');
            let utils = new Utils();
            const testResult = passed();
            const [testcase] = utils.formatCase(testResult);
            caller._tests = [[{case_id: testResult.duration, run_id: 1}]];
            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases');
            const get_case_spy = jest.spyOn(api, 'get_case');
            const get_suite_spy = jest.spyOn(api, 'get_suite');
            const update_run_spy = jest.spyOn(api, 'update_run');
            const add_run_spy = jest.spyOn(api, 'add_run');

            const res = await caller.add_results([testcase]);

            expect(add_results_for_cases_spy).toHaveBeenCalledTimes(0);
            expect(get_case_spy).toHaveBeenCalledTimes(0)
            expect(get_suite_spy).toHaveBeenCalledTimes(0)
            expect(update_run_spy).toHaveBeenCalledTimes(0)
            expect(add_run_spy).toHaveBeenCalledTimes(0)
            add_results_for_cases_spy.mockRestore();
            expect(res).toEqual({"runs_count": 0, "tests_count": 0});
        });

        it('add_results add_results_for_cases rejected', async() => {
            const api = require('../lib/interface');
            const caller = require('../src/caller');
            const console_spy = jest.spyOn(global.console, 'log');
            let utils = new Utils();
            const testResult = passed();
            const [testcase] = utils.formatCase(testResult);
            caller._tests = [{case_id: testResult.duration, run_id: 1}];

            const err = new Error('Request rejected');
            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases')
                .mockRejectedValue(err);

            const res = await caller.add_results([testcase]);
            add_results_for_cases_spy.mockRestore();

            expect(res).toBeFalsy();
            expect(console_spy).toHaveBeenCalledWith(error(err));
            console_spy.mockRestore()
        });

    });

});