const {formatCase, formatTime} = require('../lib/utils')();
const {duration, jest_results} = require('./sample');

describe('Reporter tests', function (){

    it('Should parse case id from test title', () => {
        let _case = formatCase(jest_results[0]);
        expect(_case.case_id).toEqual(duration);
    });

    it('Should parse elapsed time from test duration', () => {
        let elapsed = formatTime(duration);
        expect(elapsed.includes('s')).toBeTruthy();
    });

    it('Should parse Jest results', () => {
        let cases = jest_results.map(result => formatCase(result));
        expect(cases[0].status_id).toEqual(1);
        expect(cases[0].comment.includes('passed')).toBeTruthy();
        expect(cases[1].status_id).toEqual(5);
        expect(cases[1].comment.includes('Error')).toBeTruthy();
        expect(cases[2]).toBeFalsy();
    });

});