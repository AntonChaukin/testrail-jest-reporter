const Utils = require('../src/utils'), Reporter = require('../index');
const {passed} = require('./sample');
const chalk = require('chalk');
const message = chalk.bold.green, error = chalk.bold.red;

describe('Reporter tests', function (){

    describe('Calling onRunStart', function () {

        it('without "project_id" console error', () => {
            const reporter = new Reporter();
            const caller = require('../src/caller');
            const log_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValue([]);
            const caller_spy = jest.spyOn(caller, 'get_tests');
            reporter.onRunStart();
            expect(log_spy).toHaveBeenCalledTimes(2);
            expect(caller_spy).toHaveBeenCalledTimes(0);
            log_spy.mockRestore();
            caller_spy.mockRestore();
        });

        it('if "project_id" is null', () => {
            const reporter = new Reporter(null, {project_id: null, milestone: "Sprint 1"});
            const caller = require('../src/caller');
            const log_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValue([]);
            const caller_spy = jest.spyOn(caller, 'get_tests');
            reporter.onRunStart();
            expect(log_spy).toHaveBeenCalledTimes(2);
            expect(caller_spy).toHaveBeenCalledTimes(0);
            log_spy.mockRestore();
            caller_spy.mockRestore();
        });

        it('if "project_id" is empty string', () => {
            const reporter = new Reporter(null, {project_id: '', milestone: "Sprint 1"});
            const caller = require('../src/caller');
            const log_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValue([]);
            const caller_spy = jest.spyOn(caller, 'get_tests');
            reporter.onRunStart();
            expect(log_spy).toHaveBeenCalledTimes(2);
            expect(caller_spy).toHaveBeenCalledTimes(0);
            log_spy.mockRestore();
            caller_spy.mockRestore();
        });

        it('if "project_id" is string', () => {
            const reporter = new Reporter(null, {project_id: 'log', milestone: "Sprint 1"});
            const caller = require('../src/caller');
            const log_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValue([]);
            const caller_spy = jest.spyOn(caller, 'get_tests');
            reporter.onRunStart();
            expect(log_spy).toHaveBeenCalledTimes(2);
            expect(caller_spy).toHaveBeenCalledTimes(0);
            log_spy.mockRestore();
            caller_spy.mockRestore();
        });

        it('with "project_id" and without "milestone"', async () => {
            const reporter = new Reporter(null, {project_id: 1});
            const caller = require('../src/caller');
            const log_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValue([]);
            const caller_spy = jest.spyOn(caller, 'get_tests');
            reporter.onRunStart();
            expect(log_spy).toHaveBeenCalledTimes(2);
            expect(caller_spy).toHaveBeenCalledTimes(0);
            log_spy.mockRestore();
            caller_spy.mockRestore();
        });

        it('with "project_id" and "milestone" call "get_tests" method', async () => {
            const reporter = new Reporter(null, {project_id: 1, milestone: "Sprint 1"});
            const caller = require('../src/caller');
            const spy = jest.spyOn(caller, 'get_milestone_id')
                .mockResolvedValue({ok: true});

            await reporter.onRunStart();

            expect(spy).toHaveBeenCalledTimes(1);
            spy.mockRestore();
        });

    });

    describe('Calling onTestResult', function () {

        it('If no milestone_id onTestResult do not accumulate results', async () => {
            const util_spy = jest.spyOn(Utils.prototype, 'formatCase');
            let reporter = new Reporter();
            const testResult = passed();
            await reporter.onTestResult(null, {testResults: [testResult]},null);
            expect(util_spy).toHaveBeenCalledTimes(0);
            util_spy.mockRestore();
            expect(reporter.results).toHaveLength(0);
        });

        it('Calling onTestResult accumulate results', async () => {
            const caller = require('../src/caller');
            caller._milestone_id = 2;
            const util_spy = jest.spyOn(Utils.prototype, 'formatCase');
            let reporter = new Reporter();
            const testResult = passed();
            await reporter.onTestResult(null, {testResults: [testResult]},null);
            expect(util_spy).toHaveBeenCalledTimes(1);
            util_spy.mockRestore();
            expect(reporter.results).toHaveLength(1);
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

        it('if case_id not specified in result.title the reporter do not accumulate results', async () => {
            let reporter = new Reporter();
            const testResult = passed({cid: false});
            await reporter.onTestResult(null, {testResults: [testResult]},null);
            expect(reporter.results).toHaveLength(0);
        });

    });

    describe('Calling onRunComplete tests', function () {

        it('If no milestone_id onRunComplete do not report results', async () => {
            const caller = require('../src/caller');
            caller._milestone_id = null;
            const get_test_spy = jest.spyOn(caller, 'get_tests');
            const reporter = new Reporter();

            await reporter.onRunComplete();

            expect(get_test_spy).toHaveBeenCalledTimes(0);
            get_test_spy.mockRestore();
        });

        it('If milestone_id calling add_results method', async () => {
            const caller = require('../src/caller');
            caller._milestone_id = 2;
            const log_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValueOnce([]);
            const get_test_spy = jest.spyOn(caller, 'get_tests')
                .mockResolvedValueOnce(false);
            const add_result_spy = jest.spyOn(caller, 'add_results')
                .mockResolvedValueOnce(false);
            const reporter = new Reporter();

            await reporter.onRunComplete();

            expect(get_test_spy).toHaveBeenCalledTimes(1);
            expect(add_result_spy).toHaveBeenCalledTimes(1);
            expect(add_result_spy).toHaveBeenCalledWith([]);
            get_test_spy.mockRestore();
            add_result_spy.mockRestore();
            log_spy.mockRestore();
        });

        it('Log count of pushed results', async () => {
            const caller = require('../src/caller');
            caller._milestone_id = 2;
            const reporter = new Reporter();
            const utils = new Utils();
            const testResult = passed();
            const results = utils.formatCase(testResult);
            reporter.results = results;
            const log_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValue([]);
            const get_test_spy = jest.spyOn(caller, 'get_tests')
                .mockResolvedValueOnce(false);
            const caller_spy = jest.spyOn(caller, 'add_results')
                .mockResolvedValueOnce({tests_count: results.length, runs_count: 1});

            await reporter.onRunComplete();
            await new Promise(resolve => setTimeout(resolve, 1));

            expect(caller_spy).toHaveBeenCalledTimes(1);
            expect(caller_spy).toHaveBeenCalledWith(results);
            expect(log_spy).toHaveBeenCalledTimes(2);
            caller_spy.mockRestore();
            get_test_spy.mockRestore();
            log_spy.mockRestore();
        });

        it('"get_tests" method rejected', async () => {
            const caller = require('../src/caller');
            caller._milestone_id = 2;
            const reporter = new Reporter();
            const log_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValue([]);
            const err = new Error('Method rejected');
            const get_test_spy = jest.spyOn(caller, 'get_tests')
                .mockRejectedValueOnce(err);
            const caller_spy = jest.spyOn(caller, 'add_results')
                .mockResolvedValueOnce(false);

            await reporter.onRunComplete();
            await new Promise(resolve => setTimeout(resolve, 1));

            expect(caller_spy).toHaveBeenCalledTimes(0);
            expect(log_spy).toHaveBeenCalledTimes(2);
            expect(log_spy).toHaveBeenLastCalledWith(
                error(`! Testrail Jest Reporter Error !\n${err.stack}`)
            );
            caller_spy.mockRestore();
            get_test_spy.mockRestore();
            log_spy.mockRestore();
        });

        it('"add_results" method rejected', async () => {
            const caller = require('../src/caller');
            caller._milestone_id = 2;
            const reporter = new Reporter();
            const log_spy = jest.spyOn(global.console, 'log')
                .mockResolvedValue([]);
            const err = new Error('Method rejected');
            const get_test_spy = jest.spyOn(caller, 'get_tests')
                .mockResolvedValueOnce(false);
            const caller_spy = jest.spyOn(caller, 'add_results')
                .mockRejectedValueOnce(err);

            await reporter.onRunComplete();
            await new Promise(resolve => setTimeout(resolve, 1));

            expect(log_spy).toHaveBeenCalledTimes(2);
            expect(log_spy).toHaveBeenLastCalledWith(
                error(`! Testrail Jest Reporter Error !\n${err.stack}`)
            );
            caller_spy.mockRestore();
            get_test_spy.mockRestore();
            log_spy.mockRestore();
        });
    });

});