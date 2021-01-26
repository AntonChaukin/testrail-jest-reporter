const Utils = require('../lib/utils');
const {passed, failed, pending, case_title, duration, name,
tr_milestone, tr_plan, tr_run, tr_test, tr_result} = require('./sample');
const Reporter = require('../index');

describe('Reporter tests', function (){

    describe('Parsing test results', function (){

        it('Should parse case id from test title', () => {
            const utils = new Utils();
            const _duration = duration();
            let case_id = utils._formatTitle(case_title(_duration,true));
            expect(parseInt(case_id)).toEqual(_duration);
        });

        it('Should parse elapsed time from test duration', () => {
            const utils = new Utils();
            let elapsed = utils._formatTime(duration());
            expect(elapsed.includes('s')).toBeTruthy();
        });

        it('Should parse Jest passed result with cid', () => {
            const utils = new Utils();
            const testResult = passed(true);
            let _case = utils.formatCase(testResult);
            expect(_case.status_id).toEqual(1);
            expect(_case.comment.includes('passed')).toBeTruthy();
            expect(_case.case_id).toEqual(testResult.duration);
        });

        it('Return false if Jest result without cid', () => {
            const utils = new Utils();
            let _case = utils.formatCase(passed(false));
            expect(_case).toBeFalsy();
        });

        it('Should parse Jest failed result with cid', () => {
            const utils = new Utils();
            const testResult = failed(true);
            let _case = utils.formatCase(testResult);
            expect(_case.status_id).toEqual(5);
            expect(_case.comment.includes('Error')).toBeTruthy();
            expect(_case.case_id).toEqual(testResult.duration);
        });

        it('Should parse Jest pending result with cid', () => {
            const utils = new Utils();
            let _case = utils.formatCase(pending(true));
            expect(_case.status_id).toEqual(4); // default pending status_id
            expect(_case.comment.includes('pending')).toBeTruthy();
            expect(_case.case_id).toBeTruthy();
            expect(_case.elapsed).toEqual("");
        });

        it('_formatTitle was called if Jest result without cid', () => {
            const spy = jest.spyOn(Utils.prototype, '_formatTitle');
            const utils = new Utils();
            const testResult = failed(false);
            utils.formatCase(testResult);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(testResult.title);
            spy.mockRestore();
        });

        it('_formatTime was not called if Jest result without cid', () => {
            const spy = jest.spyOn(Utils.prototype, '_formatTime');
            const utils = new Utils();
            const testResult = pending(false);
            utils.formatCase(testResult);
            expect(spy).toHaveBeenCalledTimes(0);
            spy.mockRestore();
        });

    });

    describe('Reporter tests', function (){

        describe('Calling onRunStart', function () {

            it('without "project_id" console error', () => {
                const reporter = new Reporter();
                const spy = jest.spyOn(global.console, 'log');
                reporter.onRunStart();
                expect(spy).toHaveBeenCalledTimes(2);
                spy.mockRestore();
            });

            it('with "project_id" call "get_tests" method', async () => {
                const reporter = new Reporter(null, {project_id: 1});
                const caller = require('../lib/caller');
                const spy = jest.spyOn(caller, 'get_tests')
                    .mockResolvedValue({ok: true});

                await reporter.onRunStart();

                expect(spy).toHaveBeenCalledTimes(1);
                expect(reporter.tests).toEqual({ok: true});
                spy.mockRestore();
            });

        });

        describe('Calling onTestResult', function () {

            it('Calling onTestResult without "tests" did nothing', async () => {
                const accu_spy = jest.spyOn(Reporter.prototype, '_accumulateResults');
                const util_spy = jest.spyOn(Utils.prototype, 'formatCase');
                let reporter = new Reporter();
                await reporter.onTestResult();
                expect(accu_spy).toHaveBeenCalledTimes(0);
                expect(util_spy).toHaveBeenCalledTimes(0);
                accu_spy.mockRestore();
                util_spy.mockRestore();
            });

            it('With "tests": formatCase was called if case_id not specified in result.title', async () => {
                const spy = jest.spyOn(Utils.prototype, 'formatCase');
                let reporter = new Reporter();
                reporter.tests = [{ok: true}];
                const testResult = passed(false);
                await reporter.onTestResult(null, {testResults: [testResult]},null);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(testResult);
                spy.mockRestore();
            });

            it('With "tests": accumulateResults was not called if case_id not specified in result.title', async () => {
                const spy = jest.spyOn(Reporter.prototype, '_accumulateResults');
                let reporter = new Reporter();
                reporter.tests = [{ok: true}];
                const testResult = passed(false);
                await reporter.onTestResult(null, {testResults: [testResult]},null);
                expect(spy).toHaveBeenCalledTimes(0);
                spy.mockRestore();
            });

            it('With "tests": accumulateResults was called if case_id specified in result.title', async () => {
                const spy = jest.spyOn(Reporter.prototype, '_accumulateResults');
                let reporter = new Reporter();
                let utils = new Utils();
                reporter.tests = [{ok: true}];
                const testResult = passed(true);
                const testcase = utils.formatCase(testResult);
                await reporter.onTestResult(null, {testResults: [testResult]},null);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(testcase);
                spy.mockRestore();
            });

            it('With "tests": accumulate results if result case_id present in tests', async () => {
                let reporter = new Reporter();
                let utils = new Utils();
                const testResult = passed(true);
                const testcase = utils.formatCase(testResult);
                reporter.tests = [{case_id: testResult.duration, run_id: 1}];
                await reporter.onTestResult(null, {testResults: [testResult]},null);
                expect(reporter.results).toHaveLength(1);
                expect(reporter.results[0]).toHaveProperty('id', 1);
                expect(reporter.results[0]).toHaveProperty('results', [testcase]);
            });

            it('With "tests": accumulate results in single run', async () => {
                let reporter = new Reporter();
                let utils = new Utils();
                const testResult_1 = passed(true);
                const testResult_2 = failed(true);
                const testcase_1 = utils.formatCase(testResult_1);
                const testcase_2 = utils.formatCase(testResult_2);
                reporter.tests = [{case_id: testResult_1.duration, run_id: 1}, {case_id: testResult_2.duration, run_id: 1}];
                await reporter.onTestResult(null, {testResults: [testResult_1, testResult_2]},null);
                expect(reporter.results).toHaveLength(1);
                expect(reporter.results[0]).toHaveProperty('id', 1);
                expect(reporter.results[0]).toHaveProperty('results', [testcase_1, testcase_2]);
            });

            it('With "tests": accumulate results in multiple run', async () => {
                let reporter = new Reporter();
                let utils = new Utils();
                const testResult_1 = passed(true);
                const testResult_2 = failed(true);
                const testcase_1 = utils.formatCase(testResult_1);
                const testcase_2 = utils.formatCase(testResult_2);
                reporter.tests = [{case_id: testResult_1.duration, run_id: 1}, {case_id: testResult_2.duration, run_id: 2}];
                await reporter.onTestResult(null, {testResults: [testResult_1, testResult_2]},null);
                expect(reporter.results).toHaveLength(2);
                expect(reporter.results[0]).toHaveProperty('id', 1);
                expect(reporter.results[0]).toHaveProperty('results', [testcase_1]);
                expect(reporter.results[1]).toHaveProperty('id', 2);
                expect(reporter.results[1]).toHaveProperty('results', [testcase_2]);
            });

            it('With "tests": do not accumulate result of test that case_id not present in tests', async () => {
                let reporter = new Reporter();
                let utils = new Utils();
                const testResult_1 = passed(true);
                const testResult_2 = failed(true);
                const testcase_1 = utils.formatCase(testResult_1);
                reporter.tests = [{case_id: testResult_1.duration, run_id: 1}];
                await reporter.onTestResult(null, {testResults: [testResult_1, testResult_2]},null);
                expect(reporter.results).toHaveLength(1);
                expect(reporter.results[0]).toHaveProperty('id', 1);
                expect(reporter.results[0]).toHaveProperty('results', [testcase_1]);
            });

        });

        describe('Calling onRunComplete tests', function () {

            it('Calling add_results method', async () => {
                const caller = require('../lib/caller');
                const spy = jest.spyOn(caller, 'add_results')
                    .mockResolvedValueOnce(false);
                const reporter = new Reporter();

                await reporter.onRunComplete();

                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith([]);
                spy.mockRestore();
            });

            it('Calling add_results method with error', async () => {
                const caller = require('../lib/caller');
                const api = require('../lib/interface');
                const reporter = new Reporter();
                const utils = new Utils();
                const testResult = passed(true);
                const testcase = utils.formatCase(testResult);
                const results = [{id: 1, results: [testcase]}];
                reporter.results = results;
                const caller_spy = jest.spyOn(caller, 'add_results');
                const api_spy = jest.spyOn(api, 'add_results_for_cases')
                    .mockRejectedValueOnce(new Error('Request rejected'));

                await reporter.onRunComplete();

                expect(caller_spy).toHaveBeenCalledTimes(1);
                expect(caller_spy).toHaveBeenCalledWith(results);
                caller_spy.mockRestore();
                api_spy.mockRestore();
            });
        });

    });

    describe('Caller tests', function () {
        let runs_len, milestone_name, milestone, milestone_id, get_milestones_resp,
            get_plan_resp, get_plans_resp, run, get_runs_resp, case_1, case_2,
            test_1, test_2;

        beforeEach(() => {
            runs_len = 0;
            milestone_name = name();
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

        it('get_tests successful', async () => {
            const caller = require('../lib/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: 1});

            const get_milestones_spy = jest.spyOn(api, 'get_milestones')
                .mockResolvedValueOnce(get_milestones_resp);
            jest.spyOn(api, 'get_plans').mockResolvedValueOnce(get_plans_resp);
            jest.spyOn(api, 'get_plan').mockResolvedValueOnce(get_plan_resp);
            jest.spyOn(api, 'get_runs').mockResolvedValueOnce(get_runs_resp);
            const get_tests_spy = jest.spyOn(api, 'get_tests')
                .mockResolvedValueOnce([test_1])
                .mockResolvedValueOnce([test_2])
                .mockResolvedValue([]);

            await caller.get_tests();
            get_milestones_spy.mockRestore();
            get_tests_spy.mockRestore();

            expect(caller._tests).toEqual([case_1, case_2]);
            expect(caller._runs_ids).toHaveLength(runs_len+1);
            expect(caller._milestone_id).toEqual(milestone_id);
        });

        it('get_tests if get_milestones rejected', async () => {
            const caller = require('../lib/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: 1});

            jest.spyOn(api, 'get_milestones').mockRejectedValueOnce(new Error('Request rejected'));
            const get_plans_spy = jest.spyOn(api, 'get_plans')
                .mockResolvedValueOnce(get_plans_resp);
            jest.spyOn(api, 'get_plan').mockResolvedValueOnce(get_plan_resp);
            jest.spyOn(api, 'get_runs').mockResolvedValueOnce(get_runs_resp);
            const get_tests_spy = jest.spyOn(api, 'get_tests')
                .mockResolvedValueOnce([test_1])

            const resp = await caller.get_tests();
            get_plans_spy.mockRestore();
            get_tests_spy.mockRestore();

            expect(resp).toBeFalsy();
            expect(caller._tests).toEqual([]);
            expect(caller._runs_ids).toHaveLength(0);
            expect(caller._milestone_id).toBeFalsy();
        });

        it('get_tests if get_plans rejected', async () => {
            const caller = require('../lib/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: 1});

            jest.spyOn(api, 'get_milestones').mockResolvedValueOnce(get_milestones_resp);
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
            expect(caller._milestone_id).toEqual(milestone_id);
        });

        it('get_tests if get_plan rejected', async () => {
            const caller = require('../lib/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: 1});

            jest.spyOn(api, 'get_milestones').mockResolvedValueOnce(get_milestones_resp);
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
            expect(caller._milestone_id).toEqual(milestone_id);
        });

        it('get_tests if get_runs rejected', async () => {
            const caller = require('../lib/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: 1});

            jest.spyOn(api, 'get_milestones').mockResolvedValueOnce(get_milestones_resp);
            jest.spyOn(api, 'get_plans').mockResolvedValueOnce(get_plans_resp);
            jest.spyOn(api, 'get_plan').mockResolvedValueOnce(get_plan_resp);
            jest.spyOn(api, 'get_runs').mockRejectedValueOnce(new Error('Request rejected'));
            const get_tests_spy = jest.spyOn(api, 'get_tests').mockResolvedValueOnce([test_2])
                .mockResolvedValue([]);

            await caller.get_tests();
            get_tests_spy.mockRestore();

            expect(caller._tests).toEqual([case_2]);
            expect(caller._runs_ids).toHaveLength(runs_len);
            expect(caller._milestone_id).toEqual(milestone_id);
        });

        it('get_tests if get_tests rejected', async () => {
            const caller = require('../lib/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: 1});

            jest.spyOn(api, 'get_milestones').mockResolvedValueOnce(get_milestones_resp);
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
            expect(caller._milestone_id).toEqual(milestone_id);
        });

        it('get_tests if milestone_name undefined', async () => {
            const caller = require('../lib/caller');
            const api = require('../lib/interface');

            caller.init({milestone: undefined, project_id: 1});

            jest.spyOn(api, 'get_milestones').mockResolvedValueOnce(get_milestones_resp);
            jest.spyOn(api, 'get_plans').mockResolvedValueOnce(get_plans_resp);
            jest.spyOn(api, 'get_plan').mockResolvedValueOnce(get_plan_resp);
            jest.spyOn(api, 'get_runs').mockResolvedValueOnce(get_runs_resp);
            const get_tests_spy = jest.spyOn(api, 'get_tests')
                .mockResolvedValueOnce([test_1])
                .mockResolvedValueOnce([test_2])
                .mockResolvedValue([]);

            const resp = await caller.get_tests();
            get_tests_spy.mockRestore();

            expect(resp).toBeFalsy();
            expect(caller._tests).toEqual([]);
            expect(caller._runs_ids).toHaveLength(0);
            expect(caller._milestone_id).toBeFalsy();
        });

        it('get_tests if project_id undefined', async () => {
            const caller = require('../lib/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: undefined});

            jest.spyOn(api, 'get_milestones').mockResolvedValueOnce([]);
            const get_plans_spy = jest.spyOn(api, 'get_plans')
                .mockResolvedValueOnce(get_plans_resp);
            jest.spyOn(api, 'get_plan').mockResolvedValueOnce(get_plan_resp);
            jest.spyOn(api, 'get_runs').mockResolvedValueOnce(get_runs_resp);
            const get_tests_spy = jest.spyOn(api, 'get_tests')
                .mockResolvedValueOnce([test_1])
                .mockResolvedValueOnce([test_2])
                .mockResolvedValue([]);

            const resp = await caller.get_tests();
            get_plans_spy.mockRestore();
            get_tests_spy.mockRestore();

            expect(resp).toBeFalsy();
            expect(caller._tests).toEqual([]);
            expect(caller._runs_ids).toHaveLength(0);
            expect(caller._milestone_id).toBeFalsy();
        });

        it('get_tests if get_plans return undefined', async () => {
            const caller = require('../lib/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: 1});

            jest.spyOn(api, 'get_milestones').mockResolvedValueOnce(get_milestones_resp);
            jest.spyOn(api, 'get_plans').mockResolvedValueOnce(undefined);
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
            expect(caller._milestone_id).toEqual(milestone_id);
        });

        it('get_tests if get_plans return empty', async () => {
            const caller = require('../lib/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: 1});

            jest.spyOn(api, 'get_milestones').mockResolvedValueOnce(get_milestones_resp);
            jest.spyOn(api, 'get_plans').mockResolvedValueOnce([{}]);
            jest.spyOn(api, 'get_plan').mockResolvedValueOnce({});
            jest.spyOn(api, 'get_runs').mockResolvedValueOnce(get_runs_resp);
            const get_tests_spy = jest.spyOn(api, 'get_tests')
                .mockResolvedValueOnce([test_1])
                .mockResolvedValueOnce([test_2])
                .mockResolvedValue([]);

            await caller.get_tests();
            get_tests_spy.mockRestore();

            expect(caller._tests).toEqual([case_1]);
            expect(caller._runs_ids).toHaveLength(1);
            expect(caller._milestone_id).toEqual(milestone_id);
        });

        it('get_tests if get_plan return undefined', async () => {
            const caller = require('../lib/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: 1});

            jest.spyOn(api, 'get_milestones').mockResolvedValueOnce(get_milestones_resp);
            jest.spyOn(api, 'get_plans').mockResolvedValueOnce(get_plans_resp);
            jest.spyOn(api, 'get_plan').mockResolvedValueOnce(undefined);
            const get_runs_spy = jest.spyOn(api, 'get_runs').mockResolvedValueOnce(get_runs_resp);
            const get_tests_spy = jest.spyOn(api, 'get_tests')
                .mockResolvedValueOnce([test_1])
                .mockResolvedValueOnce([test_2])
                .mockResolvedValue([]);

            await caller.get_tests();
            get_runs_spy.mockRestore();
            get_tests_spy.mockRestore();

            expect(caller._tests).toEqual([case_1]);
            expect(caller._runs_ids).toHaveLength(1);
            expect(caller._milestone_id).toEqual(milestone_id);
        });

        it('get_tests if get_runs return undefined', async () => {
            const caller = require('../lib/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: 1});

            jest.spyOn(api, 'get_milestones').mockResolvedValueOnce(get_milestones_resp);
            jest.spyOn(api, 'get_plans').mockResolvedValueOnce(get_plans_resp);
            jest.spyOn(api, 'get_plan').mockResolvedValueOnce(get_plan_resp);
            const get_runs_spy = jest.spyOn(api, 'get_runs').mockResolvedValueOnce(undefined);
            const get_tests_spy = jest.spyOn(api, 'get_tests')
                .mockResolvedValueOnce([test_2])
                .mockResolvedValue([]);

            await caller.get_tests();
            get_runs_spy.mockRestore();
            get_tests_spy.mockRestore();

            expect(caller._tests).toEqual([case_2]);
            expect(caller._runs_ids).toHaveLength(runs_len);
            expect(caller._milestone_id).toEqual(milestone_id);
        });

        it('get_tests if get_runs return empty', async () => {
            const caller = require('../lib/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: 1});

            jest.spyOn(api, 'get_milestones').mockResolvedValueOnce(get_milestones_resp);
            jest.spyOn(api, 'get_plans').mockResolvedValueOnce(get_plans_resp);
            jest.spyOn(api, 'get_plan').mockResolvedValueOnce(get_plan_resp);
            const get_runs_spy = jest.spyOn(api, 'get_runs').mockResolvedValueOnce([{}]);
            const get_tests_spy = jest.spyOn(api, 'get_tests')
                .mockResolvedValueOnce([test_2])
                .mockResolvedValue([]);

            await caller.get_tests();
            get_runs_spy.mockRestore();
            get_tests_spy.mockRestore();

            expect(caller._tests).toEqual([case_2]);
            expect(caller._runs_ids).toHaveLength(runs_len);
            expect(caller._milestone_id).toEqual(milestone_id);
        });

        it('get_tests if get_tests return empty', async () => {
            const caller = require('../lib/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: 1});

            jest.spyOn(api, 'get_milestones').mockResolvedValueOnce(get_milestones_resp);
            jest.spyOn(api, 'get_plans').mockResolvedValueOnce(get_plans_resp);
            jest.spyOn(api, 'get_plan').mockResolvedValueOnce(get_plan_resp);
            jest.spyOn(api, 'get_runs').mockResolvedValueOnce(get_runs_resp);
            const get_tests_spy = jest.spyOn(api, 'get_tests')
                .mockResolvedValue([]);

            await caller.get_tests();
            get_tests_spy.mockRestore();

            expect(caller._tests).toEqual([]);
            expect(caller._runs_ids).toHaveLength(runs_len+1);
            expect(caller._milestone_id).toEqual(milestone_id);
        });

        it('get_tests if get_tests return undefined', async () => {
            const caller = require('../lib/caller');
            const api = require('../lib/interface');

            caller.init({milestone: milestone_name, project_id: 1});

            jest.spyOn(api, 'get_milestones').mockResolvedValueOnce(get_milestones_resp);
            jest.spyOn(api, 'get_plans').mockResolvedValueOnce(get_plans_resp);
            jest.spyOn(api, 'get_plan').mockResolvedValueOnce(get_plan_resp);
            jest.spyOn(api, 'get_runs').mockResolvedValueOnce(get_runs_resp);
            const get_tests_spy = jest.spyOn(api, 'get_tests')
                .mockResolvedValue(undefined);

            await caller.get_tests();
            get_tests_spy.mockRestore();

            expect(caller._tests).toEqual([]);
            expect(caller._runs_ids).toHaveLength(runs_len+1);
            expect(caller._milestone_id).toEqual(milestone_id);
        });

        it('add_results successful', async() => {
            const api = require('../lib/interface');
            const caller = require('../lib/caller');
            let utils = new Utils();
            const testResult = passed(true);
            const testcase = utils.formatCase(testResult);
            const resp = {status_id: 200, body: [tr_result(testcase)]};

            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases')
                .mockResolvedValueOnce(resp);

            const res = await caller.add_results([{id: 1, results: [testcase]}]);
            add_results_for_cases_spy.mockRestore();

            expect(res).toEqual(1);
        });

        it('add_results add_results_for_cases return error', async() => {
            const api = require('../lib/interface');
            const caller = require('../lib/caller');
            let utils = new Utils();
            const testResult = passed(true);
            const testcase = utils.formatCase(testResult);
            const err = new Error('Request rejected');
            const resp = {status_id: 500, error: err};

            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases')
                .mockResolvedValueOnce(resp);

            const res = await caller.add_results([{id: 1, results: [testcase]}]);
            add_results_for_cases_spy.mockRestore();

            expect(res).toBeFalsy();
        });

        it('add_results add_results_for_cases rejected', async() => {
            const api = require('../lib/interface');
            const caller = require('../lib/caller');
            let utils = new Utils();
            const testResult = passed(true);
            const testcase = utils.formatCase(testResult);

            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases')
                .mockRejectedValue(new Error('Request rejected'));

            const res = await caller.add_results([{id: 1, results: [testcase]}]);
            add_results_for_cases_spy.mockRestore();

            expect(res).toBeFalsy();
        });

        it('add_results add_results_for_cases return empty', async() => {
            const api = require('../lib/interface');
            const caller = require('../lib/caller');
            let utils = new Utils();
            const testResult = passed(true);
            const testcase = utils.formatCase(testResult);

            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases')
                .mockResolvedValue({status_id: 200, body: [{}]});

            const res = await caller.add_results([{id: 1, results: [testcase]}]);
            add_results_for_cases_spy.mockRestore();

            expect(res).toBeFalsy();
        });

        it('add_results add_results_for_cases return undefined', async() => {
            const api = require('../lib/interface');
            const caller = require('../lib/caller');
            let utils = new Utils();
            const testResult = passed(true);
            const testcase = utils.formatCase(testResult);

            const add_results_for_cases_spy = jest.spyOn(api, 'add_results_for_cases')
                .mockResolvedValue(undefined);

            const res = await caller.add_results([{id: 1, results: [testcase]}]);
            add_results_for_cases_spy.mockRestore();

            expect(res).toBeFalsy();
        });

    });

});