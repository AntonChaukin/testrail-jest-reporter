'use strict';
const process = require('process'), path = require('path'), chalk = require('chalk');
const DEFAULT_CONFIG_FILENAME = 'testrail.conf.js';
const configPath = path.resolve(process.cwd(), DEFAULT_CONFIG_FILENAME);
const error = chalk.bold.red;
const warning = chalk.keyword('orange');
const config = require(configPath);
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
        config.baseUrl = this._options.baseUrl || config.baseUrl;
        config.milestone = this._options.milestone || config.milestone;
        config.statuses = this._options.statuses || config.statuses || {};
        config.regex = this._options.regex || null;
        if (this._options.project_id) {
            get_tests(this._options.project_id)
                .then(_tests => tests = _tests);
        }
        else {
            console.log(error(`! Testrail Jest Reporter Error !`));
            console.log(warning(`You must define "project_id" in jets configurations!
                \n Example: "reporters": [ ["testrail-jest-reporter", { "project_id": "1" }] ]`));
        }
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
        if (tests) {
            _testResults.testResults.forEach((result) => {
                const testcase = formatCase(result);
                if (testcase) accumulateResults(testcase);
            });
        }
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