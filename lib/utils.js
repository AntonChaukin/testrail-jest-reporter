'use strict';

class Utils {
    constructor(_options) {
        this._regex = _options && _options.regex || /[?\d]{3,6}/gm;
        this._statuses = _options && _options.statuses || {};
        this._status = {
            "failed": 5,
            "passed": 1,
            "pending": this._statuses.pending || this._statuses.skipped || 4,  // "Retest" in TestRail. Need to remove by custom "Skipped" status
        };
    }

    formatCase(testResult) {
        const case_id = this._formatTitle(testResult.title);
        if (case_id) {
            const message = !!testResult.failureMessages.length ? testResult.failureMessages : `**${testResult.status}**`;
            const elapsed = this._formatTime(testResult.duration);
            const status_id = this._status[testResult.status];
            const comment = `#${testResult.ancestorTitles}#`
                + '\n' + testResult.title
                + '\n' + message;
            return {
                "case_id": parseInt(case_id),
                "status_id": status_id,
                "comment": comment,
                "elapsed": elapsed || "",
                "defects": "",
                "version": "",
            }
        }
        return false;
    }

    _formatTime(ms) {
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

    _formatTitle(title) {
        const regex = this._regex;
        const _t = title.match(this._regex);
        return _t && _t[0];
    }
}

module.exports = Utils;