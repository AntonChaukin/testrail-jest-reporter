'use strict';
const {formatCase} = require('./lib/utils');
const {add_results, get_tests} = require('./lib/caller');
let tests = null, results = [];

class CustomTestrailReporter {
    /**
     * constructor for the reporter
     *
     * @param {Object} _globalConfig - Jest configuration object
     * @param {Object} _options - Options object defined in jest config
     */
    constructor(_globalConfig, _options) {
        this._globalConfig = _globalConfig;
        this._options = _options;
    }

    /**
     * Hook to process the test run before running the tests, the only real data
     * available at this time is the number of test suites about to be executed
     *
     * @param {JestTestRunResult} _results - Results for the test run, but only `numTotalTestSuites` is of use
     * @param {JestRunConfig} _options - Run configuration
     */
    onRunStart(_results, _options) {
        get_tests()
            .then(_tests => tests = _tests);
    }

    /**
     * Hook to process the test run before starting the test suite
     * This will be called many times during the test run
     *
     * @param  _test - The Test this run
     */
    onTestStart(_test) {
    }

    /**
     * Hook to process the test run results after a test suite has been executed
     * This will be called many times during the test run
     *
     * @param  _test - The Test last run
     * @param {JestTestSuiteResult} _testResults - Results for the test suite just executed
     * @param _aggregatedResult - Results for the test run at the point in time of the test suite being executed
     */
    onTestResult(_test, _testResults, _aggregatedResult) {
        //console.log(`onTestResult arguments: ${JSON.stringify(arguments, null, '\t')}`);
        _testResults.testResults.forEach((result) => {
            const testcase = formatCase(result);
            if (testcase) accumulateResults(testcase);
        });
    }

    /**
     * Hook to process the test run results after all the test suites have been
     * executed
     *
     * @param {string} _contexts - The Contexts of the test run
     * @param {JestTestRunResult} _results - Results from the test run
     */
    onRunComplete(_contexts, _results) {
        add_results(results).then(done => done);
    }

    getLastError() {
        if (this._shouldFail) {
            return new Error('my-custom-reporter.js reported an error');
        }
    }
}

module.exports = CustomTestrailReporter;

function accumulateResults(testcase) {
    let index = -1;
    const test = tests.find(test => test.case_id === testcase.case_id);
    const run_id = test && test.run_id;
    if (run_id && !!results.length) index = results.findIndex(run => run.id === run_id);
    if (~index) results[index].results.push(testcase);
    else if (run_id) results.push({id: run_id, "results": [testcase]});
}