'use strict';
const process = require('process'), path = require('path'), chalk = require('chalk');
const DEFAULT_CONFIG_FILENAME = 'testrail.conf.js';
const configPath = path.resolve(process.cwd(), DEFAULT_CONFIG_FILENAME);
const error = chalk.bold.red;
const warning = chalk.keyword('orange');
const message = chalk.bold.green;
const {baseUrl, regex, milestone, project_id, user, pass} = require(configPath);
const Utils = require('./lib/utils');
const Caller = require('./lib/caller');

class CustomTestrailReporter {
    tests = null
    results = []
    /**
     * constructor for the reporter
     *
     * @param {Object} _globalConfig - Jest configuration object
     * @param {Object} _options - Options object defined in jest config
     */
    constructor(_globalConfig, _options) {
        this._globalConfig = _globalConfig;
        this._options = {};
        this._options.milestone = _options && _options.milestone || milestone;
        this._options.baseUrl = _options && _options.baseUrl || baseUrl;
        this._options.project_id = _options && _options.project_id || project_id;
        this._options.auth = 'Basic ' + new Buffer.from(user + ':' + pass, 'utf-8').toString('base64');
        this._caller = new Caller(this._options);
        this._utils = new Utils({regex: regex || null, statuses: _options && _options.statuses});
    }

    /**
     * Hook to process the test run before running the tests, the only real data
     * available at this time is the number of test suites about to be executed
     *
     * @param  _results - Results for the test run, but only `numTotalTestSuites` is of use
     * @param  _options - Run configuration
     */
    onRunStart(_results, _options) {
        if (this._options.project_id) {
            this._caller.get_tests()
                .then(_tests => this.tests = _tests);
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
     * @param  _testResults - Results for the test suite just executed
     * @param _aggregatedResult - Results for the test run at the point in time of the test suite being executed
     */
    onTestResult(_test, _testResults, _aggregatedResult) {
        if (this.tests) {
            _testResults.testResults.forEach((result) => {
                const testcase = this._utils.formatCase(result);
                if (testcase) this._accumulateResults(testcase);
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
        this._caller.add_results(this.results)
            .then(count => {
                if (count) console
                    .log(message(`Testrail Jest Reporter updated ${count} tests in ${this.results.length} runs.`));
            });
    }

    getLastError() {
        if (this._shouldFail) {
            return new Error('Testrail Jest Reporter reported an error');
        }
    }
    _accumulateResults(testcase) {
        let index = -1;
        const test = this.tests.find(test => test.case_id === testcase.case_id);
        const run_id = test && test.run_id;
        if (run_id && !!this.results.length) index = this.results.findIndex(run => run.id === run_id);
        if (~index) this.results[index].results.push(testcase);
        else if (run_id) this.results.push({id: run_id, "results": [testcase]});
    }
}

module.exports = CustomTestrailReporter;