const Utils = require('../lib/utils');
const {passed, failed, pending, case_title, duration} = require('./sample');
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
                let reporter = new Reporter();
                const spy = jest.spyOn(global.console, 'log');
                reporter.onRunStart();
                expect(spy).toHaveBeenCalledTimes(2);
                spy.mockRestore();
            });

            it('with "project_id" call "get_tests" method', async () => {
                let Caller = require('../lib/caller');
                const spy = jest.spyOn(Caller.prototype, 'get_tests')
                    .mockResolvedValue({ok: true});
                let reporter = new Reporter(null, {project_id: 1});
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
                let Caller = require('../lib/caller');
                const spy = jest.spyOn(Caller.prototype, 'add_results')
                    .mockResolvedValue(false);
                let reporter = new Reporter();
                await reporter.onRunComplete();
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith([]);
                spy.mockRestore();
            });

            it('Calling add_results method with error', async () => {
                let Caller = require('../lib/caller');
                const res_spy = jest.spyOn(Caller.prototype, 'add_results');
                const err_spy = jest.spyOn(Caller.prototype, 'add_results_for_cases')
                    .mockRejectedValue(new Error('Request rejected'));
                let reporter = new Reporter();
                let utils = new Utils();
                const testResult = passed(true);
                const testcase = utils.formatCase(testResult);
                const results = [{id: 1, results: [testcase]}];
                reporter.results = results;
                await reporter.onRunComplete();
                expect(res_spy).toHaveBeenCalledTimes(1);
                expect(res_spy).toHaveBeenCalledWith(results);
                res_spy.mockRestore();
                err_spy.mockRestore();
            });
        });

    });

});