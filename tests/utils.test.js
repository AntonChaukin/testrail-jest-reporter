const Utils = require('../src/utils');
const {passed, failed, pending, case_title, duration} = require('./sample');

describe('Utils tests', function () {

    describe('Parsing test results', function (){

        it('Should parse case id from test title', () => {
            const utils = new Utils();
            const _duration = duration();
            let [case_id] = utils._formatTitle(case_title(_duration,true));
            expect(parseInt(case_id)).toEqual(_duration);
        });

        it('Should parse several case id from test title', () => {
            const utils = new Utils();
            const duration_1 = duration();
            const duration_2 = duration();
            let [case_id_1, case_id_2] = utils._formatTitle(case_title([duration_1, duration_2],true));
            expect(parseInt(case_id_1)).toEqual(duration_1);
            expect(parseInt(case_id_2)).toEqual(duration_2);
        });

        it('Should parse elapsed time from test duration', () => {
            const utils = new Utils();
            let elapsed = utils._formatTime(duration());
            expect(elapsed.includes('s')).toBeTruthy();
        });

        it('Should parse Jest passed result with cid', () => {
            const utils = new Utils();
            const testResult = passed();
            let [_case] = utils.formatCase(testResult);
            expect(_case.status_id).toEqual(1);
            expect(_case.comment.includes('passed')).toBeTruthy();
            expect(_case.case_id).toEqual(testResult.duration);
        });

        it('Should parse Jest passed result with several cid', () => {
            const utils = new Utils();
            const testResult = passed({cid: true, cid_count: 2});
            let [case_1, case_2] = utils.formatCase(testResult);
            expect(case_1.status_id).toEqual(1);
            expect(case_2.status_id).toEqual(1);
            expect(case_1.comment.includes('passed')).toBeTruthy();
            expect(case_1.case_id).toEqual(testResult.duration);
        });

        it('Return false if Jest result without cid', () => {
            const utils = new Utils();
            let _case = utils.formatCase(passed({cid: false}));
            expect(_case).toBeFalsy();
        });

        it('Should parse Jest failed result with cid', () => {
            const utils = new Utils();
            const testResult = failed(true);
            let [_case] = utils.formatCase(testResult);
            expect(_case.status_id).toEqual(5);
            expect(_case.comment.includes('Error')).toBeTruthy();
            expect(_case.case_id).toEqual(testResult.duration);
        });

        it('Should parse Jest pending result with cid', () => {
            const utils = new Utils();
            let [_case] = utils.formatCase(pending(true));
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

    describe('Group test results', function () {

        it('single case if case_id is not present in tests', async () => {
            let utils = new Utils();
            const testResult = passed();
            const [testcase] = utils.formatCase(testResult);
            const results = utils.groupCases([testcase],[]);
            expect(results).toHaveLength(1);
            expect(results[0]).toHaveProperty('case_id', testResult.duration);
            expect(results[0]).toHaveProperty('result', testcase);
        });

        it('group results in run if result case_id is present in tests', async () => {
            let utils = new Utils();
            const testResult = passed();
            const [testcase] = utils.formatCase(testResult);
            const results = utils.groupCases([testcase], [{case_id: testResult.duration, run_id: 1}]);
            expect(results).toHaveLength(1);
            expect(results[0]).toHaveProperty('run_id', 1);
            expect(results[0]).toHaveProperty('results', [testcase]);
        });

        it('group results in single run', async () => {
            let utils = new Utils();
            const testResult_1 = passed();
            const testResult_2 = failed(true);
            const [testcase_1] = utils.formatCase(testResult_1);
            const [testcase_2] = utils.formatCase(testResult_2);
            const tests = [{case_id: testResult_1.duration, run_id: 1}, {case_id: testResult_2.duration, run_id: 1}];
            const results = utils.groupCases([testcase_1, testcase_2], tests);
            expect(results).toHaveLength(1);
            expect(results[0]).toHaveProperty('run_id', 1);
            expect(results[0]).toHaveProperty('results', [testcase_1, testcase_2]);
        });

        it('group results in multiple run', async () => {
            let utils = new Utils();
            const testResult_1 = passed();
            const testResult_2 = failed(true);
            const [testcase_1] = utils.formatCase(testResult_1);
            const [testcase_2] = utils.formatCase(testResult_2);
            const tests = [{case_id: testResult_1.duration, run_id: 1}, {case_id: testResult_2.duration, run_id: 2}];
            const results = utils.groupCases([testcase_1, testcase_2], tests);
            expect(results).toHaveLength(2);
            expect(results[0]).toHaveProperty('run_id', 1);
            expect(results[0]).toHaveProperty('results', [testcase_1]);
            expect(results[1]).toHaveProperty('run_id', 2);
            expect(results[1]).toHaveProperty('results', [testcase_2]);
        });

        it('group results in run and collect case result', async () => {
            let utils = new Utils();
            const testResult_1 = passed();
            const testResult_2 = failed(true);
            const [testcase_1] = utils.formatCase(testResult_1);
            const [testcase_2] = utils.formatCase(testResult_2);
            const tests = [{case_id: testResult_1.duration, run_id: 1}];
            const results = utils.groupCases([testcase_1, testcase_2], tests);
            expect(results).toHaveLength(2);
            expect(results[0]).toHaveProperty('run_id', 1);
            expect(results[0]).toHaveProperty('results', [testcase_1]);
            expect(results[1]).toHaveProperty('case_id', testResult_2.duration);
            expect(results[1]).toHaveProperty('result', testcase_2);
        });
    });
})