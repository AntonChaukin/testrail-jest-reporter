const process = require('process');
const DEFAULT_CONFIG_FILENAME = 'testrail.conf.js';
const configPath = path.resolve(process.cwd(), DEFAULT_CONFIG_FILENAME);
const {statuses} = require(configPath);
const status = {
    "failed": 5,
    "passed": 1,
    "pending": statuses.pending || statuses.skipped || 4,  // "Retest" in TestRail. Need to remove by custom "Skipped" status
};
const _regex = /[?\d]{3,6}/gm;

module.exports = {
    formatTime: formatTime,
    formatCase: formatCase,
};

function formatCase(testResult) {
    if (testResult.title.match(_regex)) {
        const message = !!testResult.failureMessages.length ? testResult.failureMessages : `**${testResult.status}**`;
        const elapsed = formatTime(testResult.duration);
        const status_id = status[testResult.status];
        const comment = `#${testResult.ancestorTitles}#`
            + '\n' + testResult.title
            + '\n' + message;
        return {
            "case_id": parseInt(testResult.title.match(_regex)[0]),
            "status_id": status_id,
            "comment": comment,
            "elapsed": elapsed || "",
            "defects": "",
            "version": "",
        }
    }
    return false;
}

function formatTime(ms) {
    const milsecond = 1000;
    const second = 60;
    const minute = 60;
    if (ms >= minute*second*milsecond) {
        const h = Math.floor(ms/(minute*second*milsecond));
        const m = Math.floor(ms/(second*milsecond)) - h*minute;
        const s = Math.round(ms/milsecond) - m*second;
        return `${h}h ${m}m ${s}s`;
    }
    if (ms >= second*milsecond) {
        const m = Math.floor(ms/(second*milsecond));
        const s = Math.round(ms/milsecond) - m*second;
        return `${m}m ${s}s`;
    }
    if (ms === 0) return false;
    let s = Math.round(ms/milsecond);
    s = !!s ? s : 1;
    return `${s}s`;
}