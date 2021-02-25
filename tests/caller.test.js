const chalk = require('chalk');
const Utils = require('../src/utils');
const error = chalk.bold.red;
const {passed, duration, name, tr_get_project,
    tr_milestone, tr_plan, tr_run, tr_test, tr_result} = require('./sample');

describe('Caller tests', function () {
    let runs_len, milestone_name, milestone, milestone_id, get_milestones_resp,
        get_plan_resp, get_plans_resp, run, get_runs_resp, case_1, case_2,
        test_1, test_2, get_project_resp;
    const today = new Date;
    const req_error = new Error('Request rejected');

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
            const log_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValueOnce(true);

            caller.init({milestone: milestone_name, project_id: 1});

            const get_project_spy = jest.spyOn(api, 'get_project')
                .mockRejectedValueOnce(req_error);
            const get_milestones_spy = jest.spyOn(api, 'get_milestones')
                .mockResolvedValueOnce(get_milestones_resp);

            await caller.get_milestone_id();
            get_milestones_spy.mockRestore();

            expect(log_spy).toHaveBeenCalledWith(error(`The trying to get TestRail Project was failed!
                \n The suite mode was defined as 2 by default.
                \n Context: ${req_error.stack}`));
            expect(caller._milestone_id).toEqual(milestone_id);
            expect(get_project_spy).toHaveBeenCalledTimes(1);
            expect(get_project_spy).toHaveBeenCalledWith(1);
            expect(caller._suite_mode).toEqual(2);
            log_spy.mockRestore();
            get_project_spy.mockRestore();
        });

        it('get_milestone_id if get_milestones rejected', async () => {
            const caller = require('../src/caller');
            const api = require('../lib/interface');
            caller.init({milestone: milestone_name, project_id: 1, suite_mode: 2});

            const log_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValueOnce(true);
            const get_milestones_spy = jest.spyOn(api, 'get_milestones').mockRejectedValueOnce(req_error);

            await caller.get_milestone_id();
            get_milestones_spy.mockRestore();
            expect(caller._milestone_id).toBeFalsy();
            expect(log_spy).toHaveBeenCalledTimes(1);
            expect(log_spy).toHaveBeenCalledWith(error(req_error.stack));
            log_spy.mockRestore();
        });

        it('get_milestone_id if milestone name was not found', async () => {
            const caller = require('../src/caller');
            const api = require('../lib/interface');

            caller.init({milestone: 'Sprint 1', project_id: 1, suite_mode: 2});
            const log_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValueOnce(true);
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

            const log_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValueOnce(true);
            caller.init({milestone: milestone_name, project_id: 1, suite_mode: 2});
            caller._milestone_id = milestone_id;
            jest.spyOn(api, 'get_plans').mockRejectedValueOnce(req_error);
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
            expect(log_spy).toHaveBeenCalledTimes(1);
            expect(log_spy).toHaveBeenCalledWith(error(req_error.stack));
            log_spy.mockRestore();
        });

        it('get_tests if get_plan rejected', async () => {
            const caller = require('../src/caller');
            const api = require('../lib/interface');

            const log_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValueOnce(true);
            caller.init({milestone: milestone_name, project_id: 1, suite_mode: 2});
            caller._milestone_id = milestone_id;
            jest.spyOn(api, 'get_plans').mockResolvedValueOnce(get_plans_resp);
            jest.spyOn(api, 'get_plan').mockRejectedValueOnce(req_error);
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
            expect(log_spy).toHaveBeenCalledTimes(1);
            expect(log_spy).toHaveBeenCalledWith(error(req_error.stack));
            log_spy.mockRestore();
        });

        it('get_tests if get_runs rejected', async () => {
            const caller = require('../src/caller');
            const api = require('../lib/interface');

            const log_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValueOnce(true);
            caller.init({milestone: milestone_name, project_id: 1, suite_mode: 2});
            caller._milestone_id = milestone_id;
            jest.spyOn(api, 'get_plans').mockResolvedValueOnce(get_plans_resp);
            jest.spyOn(api, 'get_plan').mockResolvedValueOnce(get_plan_resp);
            jest.spyOn(api, 'get_runs').mockRejectedValueOnce(req_error);
            const get_tests_spy = jest.spyOn(api, 'get_tests').mockResolvedValueOnce([test_2])
                .mockResolvedValue([]);

            await caller.get_tests();
            get_tests_spy.mockRestore();

            expect(caller._tests).toEqual([case_2]);
            expect(caller._runs_ids).toHaveLength(runs_len);
            expect(log_spy).toHaveBeenCalledTimes(1);
            expect(log_spy).toHaveBeenCalledWith(error(req_error.stack));
            log_spy.mockRestore();
        });

        it('get_tests if get_tests rejected', async () => {
            const caller = require('../src/caller');
            const api = require('../lib/interface');

            const log_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValueOnce(true);
            caller.init({milestone: milestone_name, project_id: 1, suite_mode: 2});
            caller._milestone_id = milestone_id;
            jest.spyOn(api, 'get_plans').mockResolvedValueOnce(get_plans_resp);
            jest.spyOn(api, 'get_plan').mockResolvedValueOnce(get_plan_resp);
            jest.spyOn(api, 'get_runs').mockResolvedValueOnce(get_runs_resp);
            const get_tests_spy = jest.spyOn(api, 'get_tests')
                .mockRejectedValueOnce(req_error);

            const resp = await caller.get_tests();
            get_tests_spy.mockRestore();

            expect(resp).toBeFalsy();
            expect(caller._tests).toEqual([]);
            expect(caller._runs_ids).toHaveLength(runs_len+1);
            expect(log_spy).toHaveBeenCalledTimes(1);
            expect(log_spy).toHaveBeenCalledWith(error(req_error.stack));
            log_spy.mockRestore();
        });

    });

    describe('add_results', function () {
        const run_id = 14, suite_id = 315;
        const suite_name = name();
        let utils = new Utils();
        const testResult = passed();
        const testResult_2 = passed();
        const [testcase] = utils.formatCase(testResult);
        const [testcase_2] = utils.formatCase(testResult_2);
        const resp = {statusCode: 200, body: [tr_result(testcase)]};

        it('successful with tests', async() => {
            const api = require('../lib/interface');
            const caller = require('../src/caller');

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

        it('with wrong results: array', async() => {

            const api = require('../lib/interface');
            const caller = require('../src/caller');

            const log_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValueOnce(true);
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
            expect(log_spy).toHaveBeenCalledTimes(1);
            log_spy.mockRestore();
            expect(res).toEqual({"runs_count": 0, "tests_count": 0});
        });

        it('with wrong tests: array', async() => {

            const api = require('../lib/interface');
            const caller = require('../src/caller');

            const log_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValueOnce(true);
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
            expect(log_spy).toHaveBeenCalledTimes(1);
            log_spy.mockRestore();
            add_results_for_cases_spy.mockRestore();
            expect(res).toEqual({"runs_count": 0, "tests_count": 0});
        });

        it('add_results_for_cases rejected', async() => {
            const api = require('../lib/interface');
            const caller = require('../src/caller');
            const console_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValueOnce(true);

            caller._tests = [{case_id: testResult.duration, run_id: 1}];

            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases')
                .mockRejectedValue(req_error);

            const res = await caller.add_results([testcase]);
            add_results_for_cases_spy.mockRestore();

            expect(res).toBeFalsy();
            expect(console_spy).toHaveBeenCalledWith(error(req_error));
            console_spy.mockRestore();
        });

        it('add run without tests: suite_mode = 1', async () => {
            const api = require('../lib/interface');
            const caller = require('../src/caller');

            const run_data = {"name": `Automated Run ${today.getDate()}.${today.getMonth()+1}.${today.getFullYear()}`,
                "include_all": false,
                "case_ids": [testcase.case_id],
                "milestone_id": milestone_id
            };
            caller.init({suite_mode: 1, project_id: 1});
            caller._tests = [];
            caller._milestone_id = milestone_id;

            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases')
                .mockResolvedValueOnce(resp.body);
            const get_case_spy = jest.spyOn(api, 'get_case');
            const get_suite_spy = jest.spyOn(api, 'get_suite');
            const update_run_spy = jest.spyOn(api, 'update_run');
            const add_run_spy = jest.spyOn(api, 'add_run')
                .mockResolvedValueOnce({id: run_id});
            const res = await caller.add_results([testcase]);

            expect(add_results_for_cases_spy).toHaveBeenCalledTimes(1);
            expect(add_results_for_cases_spy).toHaveBeenCalledWith(run_id, {"results": [testcase]});
            expect(get_case_spy).toHaveBeenCalledTimes(0);
            expect(get_suite_spy).toHaveBeenCalledTimes(0);
            expect(update_run_spy).toHaveBeenCalledTimes(0);
            expect(add_run_spy).toHaveBeenCalledTimes(1);
            expect(add_run_spy).toHaveBeenCalledWith(1, run_data);
            add_results_for_cases_spy.mockRestore();
            add_run_spy.mockRestore();
            expect(res).toEqual({"runs_count": 1, "tests_count": 1});
        });

        it('add run without tests: suite_mode = 2', async () => {
            const api = require('../lib/interface');
            const caller = require('../src/caller');

            const run_data = {"suite_id": suite_id,
                "name": suite_name + ` ${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`,
                "include_all": false,
                "case_ids": [testcase.case_id],
                "milestone_id": milestone_id
            };
            caller.init({suite_mode: 2, project_id: 1});
            caller._tests = [];
            caller._milestone_id = milestone_id;

            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases')
                .mockResolvedValueOnce(resp.body);
            const get_case_spy = jest.spyOn(api, 'get_case')
                .mockResolvedValueOnce({suite_id});
            const get_suite_spy = jest.spyOn(api, 'get_suite')
                .mockResolvedValueOnce({name: suite_name});
            const update_run_spy = jest.spyOn(api, 'update_run');
            const add_run_spy = jest.spyOn(api, 'add_run')
                .mockResolvedValueOnce({id: run_id});
            const res = await caller.add_results([testcase]);

            expect(add_results_for_cases_spy).toHaveBeenCalledTimes(1);
            expect(add_results_for_cases_spy).toHaveBeenCalledWith(run_id, {"results": [testcase]});
            expect(get_case_spy).toHaveBeenCalledTimes(1);
            expect(get_case_spy).toHaveBeenCalledWith(testcase.case_id);
            expect(get_suite_spy).toHaveBeenCalledTimes(1);
            expect(get_suite_spy).toHaveBeenCalledWith(suite_id);
            expect(update_run_spy).toHaveBeenCalledTimes(0);
            expect(add_run_spy).toHaveBeenCalledTimes(1);
            expect(add_run_spy).toHaveBeenCalledWith(1, run_data);
            add_results_for_cases_spy.mockRestore();
            add_run_spy.mockRestore();
            get_case_spy.mockRestore();
            get_suite_spy.mockRestore();
            expect(res).toEqual({"runs_count": 1, "tests_count": 1});
        });

        it('update run without tests: suite_mode = 1', async () => {
            const api = require('../lib/interface');
            const caller = require('../src/caller');

            const run_data = {"include_all": false, "case_ids": [testcase.case_id], "milestone_id": milestone_id};
            caller.init({suite_mode: 1, project_id: 1, run_update: true});
            caller._tests = [];
            caller._milestone_id = milestone_id;
            caller._runs_ids = [{id: run_id}];

            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases')
                .mockResolvedValueOnce(resp.body);
            const get_case_spy = jest.spyOn(api, 'get_case');
            const get_suite_spy = jest.spyOn(api, 'get_suite');
            const update_run_spy = jest.spyOn(api, 'update_run')
                .mockResolvedValueOnce({id: run_id});
            const add_run_spy = jest.spyOn(api, 'add_run');
            const res = await caller.add_results([testcase]);

            expect(add_results_for_cases_spy).toHaveBeenCalledTimes(1);
            expect(add_results_for_cases_spy).toHaveBeenCalledWith(run_id, {"results": [testcase]});
            expect(get_case_spy).toHaveBeenCalledTimes(0);
            expect(get_suite_spy).toHaveBeenCalledTimes(0);
            expect(update_run_spy).toHaveBeenCalledTimes(1);
            expect(update_run_spy).toHaveBeenCalledWith(run_id, run_data);
            expect(add_run_spy).toHaveBeenCalledTimes(0);

            add_results_for_cases_spy.mockRestore();
            update_run_spy.mockRestore();
            expect(res).toEqual({"runs_count": 1, "tests_count": 1});
        });

        it('update run without tests: suite_mode = 2', async () => {
            const api = require('../lib/interface');
            const caller = require('../src/caller');

            const run_data = {"include_all": false, "case_ids": [testcase.case_id], "milestone_id": milestone_id};
            caller.init({suite_mode: 2, project_id: 1, run_update: true});
            caller._tests = [];
            caller._milestone_id = milestone_id;
            caller._runs_ids = [{id: run_id, suite_id}];

            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases')
                .mockResolvedValueOnce(resp.body);
            const get_case_spy = jest.spyOn(api, 'get_case')
                .mockResolvedValueOnce({suite_id});
            const get_suite_spy = jest.spyOn(api, 'get_suite');
            const update_run_spy = jest.spyOn(api, 'update_run')
                .mockResolvedValueOnce({id: run_id});
            const add_run_spy = jest.spyOn(api, 'add_run');
            const res = await caller.add_results([testcase]);

            expect(add_results_for_cases_spy).toHaveBeenCalledTimes(1);
            expect(add_results_for_cases_spy).toHaveBeenCalledWith(run_id, {"results": [testcase]});
            expect(get_case_spy).toHaveBeenCalledTimes(1);
            expect(get_case_spy).toHaveBeenCalledWith(testcase.case_id);
            expect(get_suite_spy).toHaveBeenCalledTimes(0);
            expect(update_run_spy).toHaveBeenCalledTimes(1);
            expect(update_run_spy).toHaveBeenCalledWith(run_id, run_data);
            expect(add_run_spy).toHaveBeenCalledTimes(0);

            add_results_for_cases_spy.mockRestore();
            update_run_spy.mockRestore();
            get_case_spy.mockRestore();
            expect(res).toEqual({"runs_count": 1, "tests_count": 1});
        });

        it('add run without tests if plan_id: suite_mode = 2', async () => {
            const api = require('../lib/interface');
            const caller = require('../src/caller');

            const run_data = {"suite_id": suite_id,
                "name": suite_name + ` ${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`,
                "include_all": false,
                "case_ids": [testcase.case_id],
                "milestone_id": milestone_id
            };
            caller.init({suite_mode: 2, project_id: 1, run_update: true});
            caller._tests = [];
            caller._milestone_id = milestone_id;
            caller._runs_ids = [{id: run_id, suite_id, plan_id: 12}];

            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases')
                .mockResolvedValueOnce(resp.body);
            const get_case_spy = jest.spyOn(api, 'get_case')
                .mockResolvedValueOnce({suite_id});
            const get_suite_spy = jest.spyOn(api, 'get_suite')
                .mockResolvedValueOnce({name: suite_name});
            const update_run_spy = jest.spyOn(api, 'update_run');
            const add_run_spy = jest.spyOn(api, 'add_run')
                .mockResolvedValueOnce({id: run_id});
            const res = await caller.add_results([testcase]);

            expect(add_results_for_cases_spy).toHaveBeenCalledTimes(1);
            expect(add_results_for_cases_spy).toHaveBeenCalledWith(run_id, {"results": [testcase]});
            expect(get_case_spy).toHaveBeenCalledTimes(1);
            expect(get_case_spy).toHaveBeenCalledWith(testcase.case_id);
            expect(get_suite_spy).toHaveBeenCalledTimes(1);
            expect(get_suite_spy).toHaveBeenCalledWith(suite_id);
            expect(update_run_spy).toHaveBeenCalledTimes(0);
            expect(add_run_spy).toHaveBeenCalledTimes(1);
            expect(add_run_spy).toHaveBeenCalledWith(1, run_data);
            add_results_for_cases_spy.mockRestore();
            add_run_spy.mockRestore();
            get_case_spy.mockRestore();
            get_suite_spy.mockRestore();
            expect(res).toEqual({"runs_count": 1, "tests_count": 1});
        });

        it('update run with tests: suite_mode = 1', async () => {
            const api = require('../lib/interface');
            const caller = require('../src/caller');

            const run_data = {"include_all": false,
                "case_ids": [testcase.case_id, testcase_2.case_id],
                "milestone_id": milestone_id};
            caller.init({suite_mode: 1, project_id: 1, run_update: true});
            caller._tests = [{run_id, case_id: testcase_2.case_id}];
            caller._milestone_id = milestone_id;
            caller._runs_ids = [{id: run_id}];

            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases')
                .mockResolvedValueOnce(resp.body);
            const get_case_spy = jest.spyOn(api, 'get_case');
            const get_suite_spy = jest.spyOn(api, 'get_suite');
            const update_run_spy = jest.spyOn(api, 'update_run')
                .mockResolvedValueOnce({id: run_id});
            const add_run_spy = jest.spyOn(api, 'add_run');
            const res = await caller.add_results([testcase]);

            expect(add_results_for_cases_spy).toHaveBeenCalledTimes(1);
            expect(add_results_for_cases_spy).toHaveBeenCalledWith(run_id, {"results": [testcase]});
            expect(get_case_spy).toHaveBeenCalledTimes(0);
            expect(get_suite_spy).toHaveBeenCalledTimes(0);
            expect(update_run_spy).toHaveBeenCalledTimes(1);
            expect(update_run_spy).toHaveBeenCalledWith(run_id, run_data);
            expect(add_run_spy).toHaveBeenCalledTimes(0);

            add_results_for_cases_spy.mockRestore();
            update_run_spy.mockRestore();
            expect(res).toEqual({"runs_count": 1, "tests_count": 1});
        });

        it('update run with tests: suite_mode = 2', async () => {
            const api = require('../lib/interface');
            const caller = require('../src/caller');

            const run_data = {"include_all": false,
                "case_ids": [testcase.case_id, testcase_2.case_id],
                "milestone_id": milestone_id};
            caller.init({suite_mode: 2, project_id: 1, run_update: true});
            caller._tests = [{run_id, case_id: testcase_2.case_id}];
            caller._milestone_id = milestone_id;
            caller._runs_ids = [{id: run_id, suite_id}];

            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases')
                .mockResolvedValueOnce(resp.body);
            const get_case_spy = jest.spyOn(api, 'get_case')
                .mockResolvedValueOnce({suite_id});
            const get_suite_spy = jest.spyOn(api, 'get_suite');
            const update_run_spy = jest.spyOn(api, 'update_run')
                .mockResolvedValueOnce({id: run_id});
            const add_run_spy = jest.spyOn(api, 'add_run');
            const res = await caller.add_results([testcase]);

            expect(add_results_for_cases_spy).toHaveBeenCalledTimes(1);
            expect(add_results_for_cases_spy).toHaveBeenCalledWith(run_id, {"results": [testcase]});
            expect(get_case_spy).toHaveBeenCalledTimes(1);
            expect(get_case_spy).toHaveBeenCalledWith(testcase.case_id);
            expect(get_suite_spy).toHaveBeenCalledTimes(0);
            expect(update_run_spy).toHaveBeenCalledTimes(1);
            expect(update_run_spy).toHaveBeenCalledWith(run_id, run_data);
            expect(add_run_spy).toHaveBeenCalledTimes(0);

            add_results_for_cases_spy.mockRestore();
            update_run_spy.mockRestore();
            get_case_spy.mockRestore();
            expect(res).toEqual({"runs_count": 1, "tests_count": 1});
        });

        it('update run with tests: several results', async () => {
            const api = require('../lib/interface');
            const caller = require('../src/caller');

            const resp_2 = {statusCode: 200, body: [tr_result(testcase_2)]};
            const run_data = {"include_all": false,
                "case_ids": [testcase.case_id, testcase_2.case_id],
                "milestone_id": milestone_id};
            caller.init({suite_mode: 2, project_id: 1, run_update: true});
            caller._tests = [{run_id, case_id: testcase_2.case_id}];
            caller._milestone_id = milestone_id;
            caller._runs_ids = [{id: run_id, suite_id}];

            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases')
                .mockResolvedValueOnce(resp_2.body)
                .mockResolvedValueOnce(resp.body);
            const get_case_spy = jest.spyOn(api, 'get_case')
                .mockResolvedValueOnce({suite_id});
            const get_suite_spy = jest.spyOn(api, 'get_suite');
            const update_run_spy = jest.spyOn(api, 'update_run')
                .mockResolvedValueOnce({id: run_id});
            const add_run_spy = jest.spyOn(api, 'add_run');

            const res = await caller.add_results([testcase, testcase_2]);

            expect(add_results_for_cases_spy).toHaveBeenCalledTimes(2);
            expect(add_results_for_cases_spy).toHaveBeenNthCalledWith(1, run_id, {"results": [testcase_2]});
            expect(add_results_for_cases_spy).toHaveBeenNthCalledWith(2, run_id, {"results": [testcase]});
            expect(get_case_spy).toHaveBeenCalledTimes(1);
            expect(get_case_spy).toHaveBeenCalledWith(testcase.case_id);
            expect(get_suite_spy).toHaveBeenCalledTimes(0);
            expect(update_run_spy).toHaveBeenCalledTimes(1);
            expect(update_run_spy).toHaveBeenCalledWith(run_id, run_data);
            expect(add_run_spy).toHaveBeenCalledTimes(0);

            add_results_for_cases_spy.mockRestore();
            update_run_spy.mockRestore();
            get_case_spy.mockRestore();
            expect(res).toEqual({"runs_count": 1, "tests_count": 2});
        });

        it('update run if "update_run" rejected', async () => {
            const api = require('../lib/interface');
            const caller = require('../src/caller');
            const console_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValueOnce(true);

            const resp_2 = {statusCode: 200, body: [tr_result(testcase_2)]};
            caller.init({suite_mode: 1, project_id: 1, run_update: true});
            caller._tests = [{run_id, case_id: testcase_2.case_id}];
            caller._milestone_id = milestone_id;
            caller._runs_ids = [{id: run_id}];

            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases')
                .mockResolvedValueOnce(resp_2.body);
            const update_run_spy = jest.spyOn(api, 'update_run')
                .mockRejectedValueOnce(req_error);

            const res = await caller.add_results([testcase, testcase_2]);

            expect(add_results_for_cases_spy).toHaveBeenCalledTimes(1);
            expect(add_results_for_cases_spy).toHaveBeenCalledWith(run_id, {"results": [testcase_2]});
            expect(console_spy).toHaveBeenCalledTimes(1);
            console_spy.mockRestore();
            add_results_for_cases_spy.mockRestore();
            update_run_spy.mockRestore();
            expect(res).toEqual({"runs_count": 1, "tests_count": 1});
        });

        it('update run if "get_case" rejected', async () => {
            const api = require('../lib/interface');
            const caller = require('../src/caller');
            const console_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValueOnce([]);

            const resp_2 = {statusCode: 200, body: [tr_result(testcase_2)]};
            caller.init({suite_mode: 2, project_id: 1, run_update: true});
            caller._tests = [{run_id, case_id: testcase_2.case_id}];
            caller._milestone_id = milestone_id;
            caller._runs_ids = [{id: run_id, suite_id}];

            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases')
                .mockResolvedValueOnce(resp_2.body);
            const get_case_spy = jest.spyOn(api, 'get_case')
                .mockRejectedValueOnce(req_error);
            const get_suite_spy = jest.spyOn(api, 'get_suite');
            const update_run_spy = jest.spyOn(api, 'update_run');
            const add_run_spy = jest.spyOn(api, 'add_run');

            const res = await caller.add_results([testcase, testcase_2]);

            expect(add_results_for_cases_spy).toHaveBeenCalledTimes(1);
            expect(add_results_for_cases_spy).toHaveBeenCalledWith(run_id, {"results": [testcase_2]});
            expect(get_case_spy).toHaveBeenCalledTimes(1);
            expect(get_case_spy).toHaveBeenCalledWith(testcase.case_id);
            expect(get_suite_spy).toHaveBeenCalledTimes(0);
            expect(update_run_spy).toHaveBeenCalledTimes(0);
            expect(add_run_spy).toHaveBeenCalledTimes(0);
            expect(console_spy).toHaveBeenCalledTimes(1);
            console_spy.mockRestore();
            add_results_for_cases_spy.mockRestore();
            get_case_spy.mockRestore();
            expect(res).toEqual({"runs_count": 1, "tests_count": 1});
        });

        it('add run if "add_run" rejected', async () => {
            const api = require('../lib/interface');
            const caller = require('../src/caller');
            const console_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValueOnce([]);

            const run_data = {"suite_id": suite_id,
                "name": suite_name + ` ${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`,
                "include_all": false,
                "case_ids": [testcase.case_id],
                "milestone_id": milestone_id
            };
            const resp_2 = {statusCode: 200, body: [tr_result(testcase_2)]};
            caller.init({suite_mode: 2, project_id: 1});
            caller._tests = [{run_id, case_id: testcase_2.case_id}];
            caller._milestone_id = milestone_id;
            caller._runs_ids = [{id: run_id, suite_id}];

            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases')
                .mockResolvedValueOnce(resp_2.body);
            const get_case_spy = jest.spyOn(api, 'get_case')
                .mockResolvedValueOnce({suite_id});
            const get_suite_spy = jest.spyOn(api, 'get_suite')
                .mockResolvedValueOnce({name: suite_name});
            const add_run_spy = jest.spyOn(api, 'add_run')
                .mockRejectedValueOnce(req_error);

            const res = await caller.add_results([testcase, testcase_2]);

            expect(add_results_for_cases_spy).toHaveBeenCalledTimes(1);
            expect(add_results_for_cases_spy).toHaveBeenCalledWith(run_id, {"results": [testcase_2]});
            expect(get_case_spy).toHaveBeenCalledTimes(1);
            expect(get_case_spy).toHaveBeenCalledWith(testcase.case_id);
            expect(get_suite_spy).toHaveBeenCalledTimes(1);
            expect(get_suite_spy).toHaveBeenCalledWith(suite_id);
            expect(add_run_spy).toHaveBeenCalledTimes(1);
            expect(add_run_spy).toHaveBeenCalledWith(1, run_data);
            expect(console_spy).toHaveBeenCalledTimes(1);
            console_spy.mockRestore();
            add_results_for_cases_spy.mockRestore();
            add_run_spy.mockRestore();
            get_case_spy.mockRestore();
            get_suite_spy.mockRestore();
            expect(res).toEqual({"runs_count": 1, "tests_count": 1});
        });

        it('add run if "get_suite" rejected', async () => {
            const api = require('../lib/interface');
            const caller = require('../src/caller');
            const console_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValueOnce([]);

            const run_data = {"suite_id": suite_id,
                "name": `Automated Run ${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`,
                "include_all": false,
                "case_ids": [testcase.case_id],
                "milestone_id": milestone_id
            };
            const resp_2 = {statusCode: 200, body: [tr_result(testcase_2)]};
            caller.init({suite_mode: 2, project_id: 1});
            caller._tests = [{run_id, case_id: testcase_2.case_id}];
            caller._milestone_id = milestone_id;
            caller._runs_ids = [{id: run_id, suite_id}];

            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases')
                .mockResolvedValueOnce(resp_2.body)
                .mockResolvedValueOnce(resp.body);
            const get_case_spy = jest.spyOn(api, 'get_case')
                .mockResolvedValueOnce({suite_id});
            const get_suite_spy = jest.spyOn(api, 'get_suite')
                .mockRejectedValueOnce(req_error);
            const add_run_spy = jest.spyOn(api, 'add_run')
                .mockResolvedValueOnce({id: run_id+1});

            const res = await caller.add_results([testcase, testcase_2]);

            expect(add_results_for_cases_spy).toHaveBeenCalledTimes(2);
            expect(add_results_for_cases_spy).toHaveBeenNthCalledWith(1, run_id, {"results": [testcase_2]});
            expect(add_results_for_cases_spy).toHaveBeenNthCalledWith(2, run_id+1, {"results": [testcase]});
            expect(get_case_spy).toHaveBeenCalledTimes(1);
            expect(get_case_spy).toHaveBeenCalledWith(testcase.case_id);
            expect(get_suite_spy).toHaveBeenCalledTimes(1);
            expect(get_suite_spy).toHaveBeenCalledWith(suite_id);
            expect(add_run_spy).toHaveBeenCalledTimes(1);
            expect(add_run_spy).toHaveBeenCalledWith(1, run_data);
            expect(console_spy).toHaveBeenCalledTimes(1);
            console_spy.mockRestore();
            add_results_for_cases_spy.mockRestore();
            add_run_spy.mockRestore();
            get_case_spy.mockRestore();
            get_suite_spy.mockRestore();
            expect(res).toEqual({"runs_count": 2, "tests_count": 2});
        });

        it('update run if "get_case" rejected not stable', async () => {
            const api = require('../lib/interface');
            const caller = require('../src/caller');
            const console_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValueOnce([]);

            const testResult_3 = passed();
            const [testcase_3] = utils.formatCase(testResult_3);
            const run_data = {"suite_id": suite_id,
                "name": suite_name + ` ${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`,
                "include_all": false,
                "case_ids": [testcase.case_id],
                "milestone_id": milestone_id
            };
            const resp_2 = {statusCode: 200, body: [tr_result(testcase_2)]};
            caller.init({suite_mode: 2, project_id: 1});
            caller._tests = [{run_id, case_id: testcase_2.case_id}];
            caller._milestone_id = milestone_id;
            caller._runs_ids = [{id: run_id, suite_id}];

            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases')
                .mockResolvedValueOnce(resp_2.body)
                .mockResolvedValueOnce(resp.body);
            const get_case_spy = jest.spyOn(api, 'get_case')
                .mockRejectedValueOnce(req_error)
                .mockResolvedValueOnce({suite_id});
            const get_suite_spy = jest.spyOn(api, 'get_suite')
                .mockResolvedValueOnce({name: suite_name});
            const add_run_spy = jest.spyOn(api, 'add_run')
                .mockResolvedValueOnce({id: run_id+1});

            const res = await caller.add_results([testcase_3, testcase, testcase_2]);

            expect(add_results_for_cases_spy).toHaveBeenCalledTimes(2);
            expect(add_results_for_cases_spy).toHaveBeenNthCalledWith(1, run_id, {"results": [testcase_2]});
            expect(add_results_for_cases_spy).toHaveBeenNthCalledWith(2, run_id+1, {"results": [testcase]});
            expect(get_case_spy).toHaveBeenCalledTimes(2);
            expect(get_case_spy).toHaveBeenNthCalledWith(1, testcase_3.case_id);
            expect(get_case_spy).toHaveBeenNthCalledWith(2, testcase.case_id);
            expect(get_suite_spy).toHaveBeenCalledTimes(1);
            expect(add_run_spy).toHaveBeenCalledTimes(1);
            expect(add_run_spy).toHaveBeenCalledWith(1, run_data);
            expect(console_spy).toHaveBeenCalledTimes(1);
            console_spy.mockRestore();
            add_results_for_cases_spy.mockRestore();
            get_case_spy.mockRestore();
            expect(res).toEqual({"runs_count": 2, "tests_count": 2});
        });

    });

});