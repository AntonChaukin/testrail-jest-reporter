'use strict';
const process = require('process'), path = require('path'), chalk = require('chalk');
const DEFAULT_CONFIG_FILENAME = 'testrail.conf.js';
const configPath = path.resolve(process.cwd(), DEFAULT_CONFIG_FILENAME);
const error = chalk.bold.red;
const warning = chalk.keyword('orange');
const message = chalk.bold.green;
const {baseUrl, regex, milestone, project_id, suite_mode, user, pass} = require(configPath);
const Utils = require('./src/utils');
const caller = require('./src/caller');

class CustomTestrailReporter {

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
        this._options.suite_mode = _options && _options.suite_mode || suite_mode;
        this._options.run_update = (_options && _options.hasOwnProperty('publish_results')) ? _options.publish_results : true;
        this._options.auth = 'Basic ' + new Buffer.from(user + ':' + pass, 'utf-8').toString('base64');
        caller.init(this._options);
        this._utils = new Utils({regex: regex || null, statuses: _options && _options.statuses});
        this.results = []
    }

    /**
     * Hook to process the test run before running the tests, the only real data
     * available at this time is the number of test suites about to be executed
     *
     * @param  _results - Results for the test run, but only `numTotalTestSuites` is of use
     * @param  _options - Run configuration
     */
    onRunStart(_results, _options) {
        if (this._options.project_id && !isNaN(this._options.project_id) && this._options.milestone) {
            caller.get_milestone_id();
        }
        else {
            console.log(error(`! Testrail Jest Reporter Error !`));
            console.log(warning(`You must define "project_id"  and "milestone" in jest configurations!
                \n Example: "reporters": [ ["testrail-jest-reporter", { "project_id": "1", "milestone": "Sprint 1" }] ]`));
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
        if (caller._milestone_id) {
            _testResults.testResults.forEach((result) => {
                const testcases = this._utils.formatCase(result);
                if (testcases) {
                    for (let i=0, len = testcases.length; i<len; i++) {
                        this.results.push(testcases[i])
                    }
                }
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
        if (caller._milestone_id) {
            console.log(message('Testrail Jest Reporter is updating tests results...'));
            caller.get_tests()
                .then(() => {
                    return caller.add_results(this.results)
                })
                .then(({tests_count, runs_count}) => {
                    if (tests_count) console
                        .log(message(`\nTestrail Jest Reporter updated ${tests_count} tests in ${runs_count} runs.`));
                })
                .catch(e => {
                    console.log(error(`! Testrail Jest Reporter Error !\n${e.stack}`));
                });
        }
    }

    getLastError() {
        if (this._shouldFail) {
            return new Error('Testrail Jest Reporter reported an error');
        }
    }
}

module.exports = CustomTestrailReporter;