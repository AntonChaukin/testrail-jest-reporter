const faker = require('faker');
const index = faker.random.number(10);
const duration = faker.random.number();
const title = faker.lorem.sentence();
const _case = 'C'+duration;
const case_title = replaceSymbolWithCaseNumber(title, index);
const results = [
    {
        "ancestorTitles": [
            "Reporter tests"
        ],
        "duration": duration,
        "failureMessages": [],
        "fullName": "Reporter tests "+case_title,
        "location": null,
        "numPassingAsserts": 0,
        "status": "passed",
        "title": case_title
    },
    {
        "ancestorTitles": [
            "Reporter tests"
        ],
        "duration": 1251,
        "failureMessages": [
            `Error: Submenu toAdminContract did not expanded\n    at doWhile (/media/chacka/Transcend/git/faxme-ii-test/lib/helpers/waits.js:68:19)\n    at toSubmenu (/media/chacka/Transcend/git/faxme-ii-test/ui-test/pages/fragments/navbarFragment.js:77:5)\n    at Object.<anonymous> (/media/chacka/Transcend/git/faxme-ii-test/ui-test/test/contract/addContract.spec.js:18:9)`,
            `TypeError: Cannot read property 'principalEmail' of null\n    at Object.<anonymous> (/media/chacka/Transcend/git/faxme-ii-test/ui-test/test/contract/addContract.spec.js:42:55)\n    at runNextTicks (internal/process/task_queues.js:58:5)\n    at processImmediate (internal/timers.js:434:9)`
        ],
        "fullName": "Reporter tests C2037 Should parse Jest results",
        "location": null,
        "numPassingAsserts": 0,
        "status": "failed",
        "title": "C2037 Should parse Jest results"
    },
    {
        "ancestorTitles": [
            "Reporter tests"
        ],
        "duration": duration,
        "failureMessages": [],
        "fullName": "Reporter tests Should parse case id from test title",
        "location": null,
        "numPassingAsserts": 0,
        "status": "passed",
        "title": "Should parse case id from test title"
    }
];

module.exports = {
    case_title: case_title,
    duration: duration,
    jest_results: results
};

function replaceSymbolWithCaseNumber(string, symbolIndex) {
    let str = [];
    str.push(string.slice(0,symbolIndex));
    str.push(_case);
    str.push(string.slice(symbolIndex));
    return str.join(' ');
}