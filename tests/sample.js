const faker = require('faker'), Utils = require('../src/utils');
const utils = new Utils();
const increaser = count(5);

module.exports = {
    passed: passed,
    failed: failed,
    pending: pending,
    duration: duration,
    case_title: case_title,
    name: name,
    tr_result: tr_result,
    tr_test: tr_test,
    tr_run: tr_run,
    tr_plan: tr_plan,
    tr_milestone: tr_milestone,
    tr_get_project
};

/**
 *
 * @param {object} options
 * @param {boolean} options.cid
 * @param {number} options.cid_count
 * @return {{duration: *, failureMessages: [], fullName: string, location: null, numPassingAsserts: number, title: (string|*), ancestorTitles: [string], status: string}}
 */
function passed(options) {
    options = options || {cid: true, cid_count: 1};
    const count = options.cid_count || 1;
    const _duration = [];
    let i = 0;
    do {
        i++;
        _duration.push(duration());
    } while (i<count)
    const _case_title = case_title(_duration, options.cid);
    return {
        "ancestorTitles": [
            "Reporter tests"
        ],
        "duration": _duration[0],
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

function title() {return faker.lorem.sentence()}

function name() {
    let _name = faker.random.words();
    if (_name.length < 3) _name += name();
    return _name.slice(0,16);
}

function case_title(duration, cid = true) {
    let string = [];
    const _title = title();
    if (cid) {
        duration  = utils.isArray(duration) ? duration : [duration];
        let _index = 0;
        for (let i=0, len=duration.length; i<len; i++) {
            const start = _index;
            _index += index();
            string.push(_title.slice(start,_index));
            string.push('C'+ duration[i]);
        }
        string.push(_title.slice(_index));
        return string.join(' ');
    }
    return _title;
}

function index() {
    return faker.datatype.number(20);
}

function duration() {
    return faker.datatype.number({min: 100, max: 99999});
}

/**
 *
 * @param {object} options
 * @param {string} options.comment
 * @param {string} options.elapsed
 * @param {number} options.status_id
 * @return {{elapsed: string, status_id: number, created_on: number, defects: string, assignedto_id: number, comment: string, id: number, created_by: number, custom_step_results: [{}, {}], version: string, test_id: number}}
 */
function tr_result(options) {
    const _id = increaser();
    const _comment = options && options.comment || title();
    const _elapsed = options && options.elapsed || "5m";
    const _status_id = options && options.status_id || faker.random.arrayElement([1,4,5]);
    const _created_on = new Date().getTime();
    return {
        "assignedto_id": 1,
        "comment": _comment,
        "created_by": 1,
        "created_on": _created_on,
        "custom_step_results": [
            {},
            {}
        ],
        "defects": "",
        "elapsed": _elapsed,
        "id": _id,
        "status_id": _status_id,
        "test_id": duration(),
        "version": ""
    }

}

/**
 *
 * @param {object} options
 * @param {number} options.run_id
 * @param {number} options.status_id
 * @param {number} options.case_id
 * @return {{custom_expected: string, run_id: number, custom_steps_separated: [{expected: string, content: string}, {expected: string, content: string}], type_id: number, estimate_forecast: null, custom_preconds: string, title: *, priority_id: number, status_id: number, case_id: *, estimate: string, assignedto_id: number, id}}
 */
function tr_test(options) {
    const _id = increaser();
    const _case_id = options && options.case_id || duration();
    const _title = title();
    const _run_id = options && options.run_id || increaser();
    const _status_id = options && options.status_id || faker.random.arrayElement([1,4,5]);
    return {
        "assignedto_id": 1,
        "case_id": _case_id,
        "custom_expected": "..",
        "custom_preconds": "..",
        "custom_steps_separated": [
            {
                "content": "Step 1",
                "expected": "Expected Result 1"
            },
            {
                "content": "Step 2",
                "expected": "Expected Result 2"
            }
        ],
        "estimate": "1m 5s",
        "estimate_forecast": null,
        "id": _id,
        "priority_id": 2,
        "run_id": _run_id,
        "status_id": _status_id,
        "title": _title,
        "type_id": 4
    }
}

/**
 *
 * @param {object} options
 * @param {number} options.plan_id
 * @param {number} options.milestone_id
 * @return {{updated_on: null, completed_on: null, milestone_id: number, description: null, custom_status3_count: number, is_completed: boolean, retest_count: number, custom_status5_count: number, project_id: number, id, suite_id: number, custom_status2_count: number, include_all: boolean, passed_count: number, custom_status7_count: number, custom_status4_count: number, created_by: number, url: string, config_ids: number[], blocked_count: number, created_on: number, refs: string, untested_count: number, name: string, assignedto_id: number, custom_status1_count: number, failed_count: number, custom_status6_count: number, config: string, plan_id: null}}
 */
function tr_run(options) {
    const _id = increaser();
    const _plan_id = options && options.plan_id || null;
    const _milestone_id = options && options.milestone_id || null;
    const _name = faker.random.words();
    return {
        "assignedto_id": 6,
        "blocked_count": 0,
        "completed_on": null,
        "config": "Firefox, Ubuntu 12",
        "config_ids": [
            2,
            6
        ],
        "created_by": 1,
        "created_on": 1393845644,
        "refs": "SAN-1",
        "custom_status1_count": 0,
        "custom_status2_count": 0,
        "custom_status3_count": 0,
        "custom_status4_count": 0,
        "custom_status5_count": 0,
        "custom_status6_count": 0,
        "custom_status7_count": 0,
        "description": null,
        "failed_count": 2,
        "id": _id,
        "include_all": false,
        "is_completed": false,
        "milestone_id": _milestone_id,
        "name": _name,
        "passed_count": 2,
        "plan_id": _plan_id,
        "project_id": 1,
        "retest_count": 1,
        "suite_id": 6,
        "untested_count": 3,
        "updated_on": null,
        "url": `http://testrail/index.php?/runs/view/${_id}`
    }
}

/**
 *
 * @param {object} options
 * @param {number} options.milestone_id
 * @param {number} options.plan_id
 * @param {number} options.runs_count
 * @return {{include_all: boolean, refs: string, name: *, description: null, id: *, runs: [{completed_on: null, milestone_id: number, description: null, custom_status3_count: number, is_completed: boolean, retest_count: number, custom_status5_count: number, project_id: number, id: number, suite_id: number, custom_status2_count: number, include_all: boolean, passed_count: number, custom_status7_count: number, custom_status4_count: number, url: string, config_ids: number[], blocked_count: number, refs: string, untested_count: number, name: string, assignedto_id: number, custom_status1_count: number, failed_count: number, custom_status6_count: number, config: string, entry_id: string, plan_id: number, entry_index: number}, {completed_on: null, milestone_id: number, description: null, custom_status3_count: number, is_completed: boolean, retest_count: number, custom_status5_count: number, project_id: number, id: number, suite_id: number, custom_status2_count: number, include_all: boolean, passed_count: number, custom_status7_count: number, custom_status4_count: number, url: string, config_ids: number[], blocked_count: number, refs: string, untested_count: number, name: string, assignedto_id: number, custom_status1_count: number, failed_count: number, custom_status6_count: number, config: string, entry_id: string, plan_id: number, entry_index: number}], suite_id: number}}
 * @private
 */
function _tr_entry(options) {
    const _id = faker.datatype.uuid();
    const _name = faker.random.words();
    const len = options.runs_count || faker.random.arrayElement([1,2]);
    const _plan_id = options.plan_id;
    const _milestone_id = options.milestone_id;
    const _runs = [];
    for (let i = 0; i < len; i++) {_runs.push(tr_run({plan_id: _plan_id, milestone_id: _milestone_id}))}
    return {
        "id": _id,
        "description": null,
        "include_all": true,
        "name": _name,
        "runs": _runs,
        "refs": "RF-1, RF-2",
        "suite_id": 4
    }
}

/**
 *
 * @param {object} options
 * @param {number} options.milestone_id
 * @param {number} options.entries_count
 * @return {{custom_status2_count: number, completed_on: null, passed_count: number, custom_status7_count: number, milestone_id: number, description: null, custom_status4_count: number, custom_status3_count: number, created_by: number, is_completed: boolean, url: string, retest_count: number, custom_status5_count: number, blocked_count: number, entries: [{include_all: boolean, refs: string, name: string, description: null, id: string, runs: [{completed_on: null, milestone_id: number, description: null, custom_status3_count: number, is_completed: boolean, retest_count: number, custom_status5_count: number, project_id: number, id: number, suite_id: number, custom_status2_count: number, include_all: boolean, passed_count: number, custom_status7_count: number, custom_status4_count: number, url: string, config_ids: number[], blocked_count: number, refs: string, untested_count: number, name: string, assignedto_id: number, custom_status1_count: number, failed_count: number, custom_status6_count: number, config: string, entry_id: string, plan_id: number, entry_index: number}, {completed_on: null, milestone_id: number, description: null, custom_status3_count: number, is_completed: boolean, retest_count: number, custom_status5_count: number, project_id: number, id: number, suite_id: number, custom_status2_count: number, include_all: boolean, passed_count: number, custom_status7_count: number, custom_status4_count: number, url: string, config_ids: number[], blocked_count: number, refs: string, untested_count: number, name: string, assignedto_id: number, custom_status1_count: number, failed_count: number, custom_status6_count: number, config: string, entry_id: string, plan_id: number, entry_index: number}], suite_id: number}, {include_all: boolean, refs: string, name: string, description: null, id: string, runs: [{completed_on: null, milestone_id: number, description: null, custom_status3_count: number, is_completed: boolean, retest_count: number, custom_status5_count: number, project_id: number, id: number, suite_id: number, custom_status2_count: number, include_all: boolean, passed_count: number, custom_status7_count: number, custom_status4_count: number, url: string, config_ids: number[], blocked_count: number, refs: string, untested_count: number, name: string, assignedto_id: number, custom_status1_count: number, failed_count: number, custom_status6_count: number, config: string, entry_id: string, plan_id: number, entry_index: number}], suite_id: number}], created_on: number, project_id: number, untested_count: number, name: string, assignedto_id: null, custom_status1_count: number, failed_count: number, id, custom_status6_count: number}}
 */
function tr_plan(options) {
    const _milestone_id = options && options.milestone_id || increaser();
    const _id = increaser();
    const _name = faker.random.words();
    const len = options && options.entries_count || faker.random.arrayElement([1,2,3]);
    const _entries = [];
    for (let i=0; i<len; i++) {_entries.push(_tr_entry({plan_id: _id, milestone_id: _milestone_id}))}
    return {
        "assignedto_id": null,
        "blocked_count": 2,
        "completed_on": null,
        "created_by": 1,
        "created_on": 1393845644,
        "custom_status1_count": 0,
        "custom_status2_count": 0,
        "custom_status3_count": 0,
        "custom_status4_count": 0,
        "custom_status5_count": 0,
        "custom_status6_count": 0,
        "custom_status7_count": 0,
        "description": null,
        "entries": _entries,
        "failed_count": 2,
        "id": _id,
        "is_completed": false,
        "milestone_id": _milestone_id,
        "name": _name,
        "passed_count": 5,
        "project_id": 1,
        "retest_count": 1,
        "untested_count": 6,
        "url": `http:///testrail/index.php?/plans/view/${_id}`
    }
}

/**
 *
 * @param {object} options
 * @param {number} options.id
 * @param {string} options.name
 * @return {{completed_on: null, project_id: number, refs: string, name: string, description: string, id: number, is_completed: boolean, due_on: number, url: string}}
 */
function tr_milestone(options) {
    const _id = options && options.id || increaser();
    const _name = options && options.name || faker.random.words();
    return {
        "completed_on": null,
        "description": "...",
        "due_on": 1391968184,
        "id": _id,
        "is_completed": false,
        "name": _name,
        "project_id": 1,
        "refs": "RF-1, RF-2",
        "url": `http:///testrail/index.php?/milestones/view/${_id}`
    }
}

/**
 *
 * @param {object} options
 * @param {number || string} options.suite_mode
 * @return {{suite_mode: *, completed_on: null, name: string, id: number, is_completed: boolean, show_announcement: boolean, url: string, announcement: string}}
 */
function tr_get_project(options) {
    const _suite_mode = options && options.suite_mode || faker.random.arrayElement([1,2,3]);
    return {
        "announcement": "..",
        "completed_on": null,
        "id": 1,
        "is_completed": false,
        "name": "Datahub",
        "show_announcement": true,
        "suite_mode": _suite_mode,
        "url": "http:///testrail/index.php?/projects/overview/1"
    }
}

function count(start) {
    let _count = start;
    return function () {
        _count++;
        return _count;
    }
}