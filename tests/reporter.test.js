const Utils = require('../src/utils'), Reporter = require('../index');
const {passed, failed} = require('./sample');
const chalk = require('chalk');
const message = chalk.bold.green, error = chalk.bold.red;

describe('Reporter tests', function (){

    describe('Calling onRunStart', function () {

        it('without "project_id" console error', () => {
            const reporter = new Reporter();
            const caller = require('../src/caller');
            const log_spy = jest.spyOn(global.console, 'log');
            const caller_spy = jest.spyOn(caller, 'get_tests');
            reporter.onRunStart();
            expect(log_spy).toHaveBeenCalledTimes(2);
            expect(caller_spy).toHaveBeenCalledTimes(0);
            log_spy.mockRestore();
            caller_spy.mockRestore();
        });

        it('if "project_id" is null', () => {
            const reporter = new Reporter(null, {project_id: null});
            const caller = require('../src/caller');
            const log_spy = jest.spyOn(global.console, 'log');
            const caller_spy = jest.spyOn(caller, 'get_tests');
            reporter.onRunStart();
            expect(log_spy).toHaveBeenCalledTimes(2);
            expect(caller_spy).toHaveBeenCalledTimes(0);
            log_spy.mockRestore();
            caller_spy.mockRestore();
        });

        it('if "project_id" is empty string', () => {
            const reporter = new Reporter(null, {project_id: ''});
            const caller = require('../src/caller');
            const log_spy = jest.spyOn(global.console, 'log');
            const caller_spy = jest.spyOn(caller, 'get_tests');
            reporter.onRunStart();
            expect(log_spy).toHaveBeenCalledTimes(2);
            expect(caller_spy).toHaveBeenCalledTimes(0);
            log_spy.mockRestore();
            caller_spy.mockRestore();
        });

        it('if "project_id" is string', () => {
            const reporter = new Reporter(null, {project_id: 'log'});
            const caller = require('../src/caller');
            const log_spy = jest.spyOn(global.console, 'log');
            const caller_spy = jest.spyOn(caller, 'get_tests');
            reporter.onRunStart();
            expect(log_spy).toHaveBeenCalledTimes(2);
            expect(caller_spy).toHaveBeenCalledTimes(0);
            log_spy.mockRestore();
            caller_spy.mockRestore();
        });

        it('with "project_id" call "get_tests" method', async () => {
            const reporter = new Reporter(null, {project_id: 1});
            const caller = require('../src/caller');
            const spy = jest.spyOn(caller, 'get_tests')
                .mockResolvedValue({ok: true});

            await reporter.onRunStart();

            expect(spy).toHaveBeenCalledTimes(1);
            expect(reporter.tests).toEqual({ok: true});
            spy.mockRestore();
        });

    });

    describe('Calling onTestResult', function () {

        it('Calling onTestResult without "tests" accumulate results', async () => {
            const accu_spy = jest.spyOn(Reporter.prototype, '_accumulateResults');
            const util_spy = jest.spyOn(Utils.prototype, 'formatCase');
            let reporter = new Reporter();
            const testResult = passed();
            await reporter.onTestResult(null, {testResults: [testResult]},null);
            expect(accu_spy).toHaveBeenCalledTimes(1);
            expect(util_spy).toHaveBeenCalledTimes(1);
            accu_spy.mockRestore();
            util_spy.mockRestore();
        });

        it('"formatCase" was called if case_id not specified in result.title', async () => {
            const spy = jest.spyOn(Utils.prototype, 'formatCase');
            let reporter = new Reporter();
            const testResult = passed({cid: false});
            await reporter.onTestResult(null, {testResults: [testResult]},null);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(testResult);
            spy.mockRestore();
        });

        it('"accumulateResults" was not called if case_id not specified in result.title', async () => {
            const spy = jest.spyOn(Reporter.prototype, '_accumulateResults');
            let reporter = new Reporter();
            const testResult = passed({cid: false});
            await reporter.onTestResult(null, {testResults: [testResult]},null);
            expect(spy).toHaveBeenCalledTimes(0);
            spy.mockRestore();
        });

        it('"accumulateResults" was called if case_id specified in result.title', async () => {
            const spy = jest.spyOn(Reporter.prototype, '_accumulateResults');
            let reporter = new Reporter();
            let utils = new Utils();
            const testResult = passed();
            const testcase_list = utils.formatCase(testResult);
            await reporter.onTestResult(null, {testResults: [testResult]},null);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(testcase_list);
            spy.mockRestore();
        });

        it('accumulate case result if result case_id is not present in tests', async () => {
            let reporter = new Reporter();
            let utils = new Utils();
            const testResult = passed();
            const [testcase] = utils.formatCase(testResult);
            await reporter.onTestResult(null, {testResults: [testResult]},null);
            expect(reporter.results).toHaveLength(1);
            expect(reporter.results[0]).toHaveProperty('case_id', testResult.duration);
            expect(reporter.results[0]).toHaveProperty('result', testcase);
        });

        it('With "tests": group results in run if result case_id is present in tests', async () => {
            let reporter = new Reporter();
            let utils = new Utils();
            const testResult = passed();
            const [testcase] = utils.formatCase(testResult);
            reporter.tests = [{case_id: testResult.duration, run_id: 1}];
            await reporter.onTestResult(null, {testResults: [testResult]},null);
            expect(reporter.results).toHaveLength(1);
            expect(reporter.results[0]).toHaveProperty('run_id', 1);
            expect(reporter.results[0]).toHaveProperty('results', [testcase]);
        });

        it('With "tests": group results in single run', async () => {
            let reporter = new Reporter();
            let utils = new Utils();
            const testResult_1 = passed();
            const testResult_2 = failed(true);
            const [testcase_1] = utils.formatCase(testResult_1);
            const [testcase_2] = utils.formatCase(testResult_2);
            reporter.tests = [{case_id: testResult_1.duration, run_id: 1}, {case_id: testResult_2.duration, run_id: 1}];
            await reporter.onTestResult(null, {testResults: [testResult_1, testResult_2]},null);
            expect(reporter.results).toHaveLength(1);
            expect(reporter.results[0]).toHaveProperty('run_id', 1);
            expect(reporter.results[0]).toHaveProperty('results', [testcase_1, testcase_2]);
        });

        it('With "tests": accumulate results in multiple run', async () => {
            let reporter = new Reporter();
            let utils = new Utils();
            const testResult_1 = passed();
            const testResult_2 = failed(true);
            const [testcase_1] = utils.formatCase(testResult_1);
            const [testcase_2] = utils.formatCase(testResult_2);
            reporter.tests = [{case_id: testResult_1.duration, run_id: 1}, {case_id: testResult_2.duration, run_id: 2}];
            await reporter.onTestResult(null, {testResults: [testResult_1, testResult_2]},null);
            expect(reporter.results).toHaveLength(2);
            expect(reporter.results[0]).toHaveProperty('run_id', 1);
            expect(reporter.results[0]).toHaveProperty('results', [testcase_1]);
            expect(reporter.results[1]).toHaveProperty('run_id', 2);
            expect(reporter.results[1]).toHaveProperty('results', [testcase_2]);
        });

        it('With "tests": group results in run and collect case result', async () => {
            let reporter = new Reporter();
            let utils = new Utils();
            const testResult_1 = passed();
            const testResult_2 = failed(true);
            const [testcase_1] = utils.formatCase(testResult_1);
            const [testcase_2] = utils.formatCase(testResult_2);
            reporter.tests = [{case_id: testResult_1.duration, run_id: 1}];
            await reporter.onTestResult(null, {testResults: [testResult_1, testResult_2]},null);
            expect(reporter.results).toHaveLength(2);
            expect(reporter.results[0]).toHaveProperty('run_id', 1);
            expect(reporter.results[0]).toHaveProperty('results', [testcase_1]);
            expect(reporter.results[1]).toHaveProperty('case_id', testResult_2.duration);
            expect(reporter.results[1]).toHaveProperty('result', testcase_2);
        });

    });

    describe('Calling onRunComplete tests', function () {

        it('Calling add_results method', async () => {
            const caller = require('../src/caller');
            const spy = jest.spyOn(caller, 'add_results')
                .mockResolvedValueOnce(false);
            const reporter = new Reporter();

            await reporter.onRunComplete();

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith([]);
            spy.mockRestore();
        });

        it('Log count of pushed results', async () => {
            const caller = require('../src/caller');
            const reporter = new Reporter();
            const utils = new Utils();
            const testResult = passed();
            const [testcase] = utils.formatCase(testResult);
            const results = [{id: 1, results: [testcase]}];
            reporter.results = results;
            const log_spy = jest.spyOn(global.console, 'log');
            const caller_spy = jest.spyOn(caller, 'add_results')
                .mockResolvedValueOnce(results[0].results.length);

            await reporter.onRunComplete();

            expect(caller_spy).toHaveBeenCalledTimes(1);
            expect(caller_spy).toHaveBeenCalledWith(results);
            expect(log_spy).toHaveBeenCalledTimes(1);
            expect(log_spy).toHaveBeenCalledWith(
                message(`Testrail Jest Reporter updated ${results[0].results.length} tests in ${results.length} runs.`)
            );
            caller_spy.mockRestore();
            log_spy.mockRestore();
        });

        it('"add_results" method rejected', async () => {
            const caller = require('../src/caller');
            const reporter = new Reporter();
            const log_spy = jest.spyOn(global.console, 'log');
            const err = new Error('Method rejected');
            const caller_spy = jest.spyOn(caller, 'add_results')
                .mockRejectedValueOnce(err);

            await reporter.onRunComplete();
            await new Promise(resolve => setTimeout(resolve, 1));

            expect(log_spy).toHaveBeenCalledTimes(1);
            expect(log_spy).toHaveBeenCalledWith(
                error(`! Testrail Jest Reporter Error !\n${err.stack}`)
            );
            caller_spy.mockRestore();
            log_spy.mockRestore();
        });
    });

});