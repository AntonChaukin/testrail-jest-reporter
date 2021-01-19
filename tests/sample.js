const faker = require('faker');

module.exports = {
    passed: passed,
    failed: failed,
    pending: pending,
    duration: duration,
    case_title: case_title
};

function passed(cid) {
    const _duration = duration();
    const _case_title = case_title(_duration, cid);
    return {
        "ancestorTitles": [
            "Reporter tests"
        ],
        "duration": _duration,
        "failureMessages": [],
        "fullName": "Reporter tests "+_case_title,
        "location": null,
        "numPassingAsserts": 0,
        "status": "passed",
        "title": _case_title
    }
}

function failed(cid) {
    const _duration = duration();
    const _case_title = case_title(_duration, cid);
    return {
        "ancestorTitles": [
            "Reporter tests"
        ],
        "duration": _duration,
        "failureMessages": [
            `Error: Submenu toAdminContract did not expanded\n    at doWhile (/media/chacka/Transcend/git/faxme-ii-test/lib/helpers/waits.js:68:19)\n    at toSubmenu (/media/chacka/Transcend/git/faxme-ii-test/ui-test/pages/fragments/navbarFragment.js:77:5)\n    at Object.<anonymous> (/media/chacka/Transcend/git/faxme-ii-test/ui-test/test/contract/addContract.spec.js:18:9)`,
            `TypeError: Cannot read property 'principalEmail' of null\n    at Object.<anonymous> (/media/chacka/Transcend/git/faxme-ii-test/ui-test/test/contract/addContract.spec.js:42:55)\n    at runNextTicks (internal/process/task_queues.js:58:5)\n    at processImmediate (internal/timers.js:434:9)`
        ],
        "fullName": "Reporter tests"+_case_title,
        "location": null,
        "numPassingAsserts": 0,
        "status": "failed",
        "title": _case_title
    }
}
function pending(cid) {
    const _duration = duration();
    const _case_title = case_title(_duration, cid);
    return {
        "ancestorTitles": [
            "Reporter tests"
        ],
        "duration": 0,
        "failureMessages": [],
        "fullName": "Reporter tests"+_case_title,
        "location": null,
        "numPassingAsserts": 0,
        "status": "pending",
        "title": _case_title
    }
}

function case_title(duration, cid = true) {
    let string = [];
    const _title = faker.lorem.sentence();
    if (cid) {
        const _index = index();
        string.push(_title.slice(0,_index));
        string.push('C'+ duration);
        string.push(_title.slice(_index));
        return string.join(' ');
    }
    return _title;
}

function index() {
    return faker.random.number(20);
}

function duration() {
    return faker.random.number({min: 100, max: 99999});
}