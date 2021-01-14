const status = {
    "failed": 5,
    "passed": 1
};

module.exports = {
    formatTime: formatTime,
    formatCase: formatCase,
    getCaseId: getCaseId
};

function formatCase(testResult) {
    const case_id = getCaseId(testResult.title);
    if (!!case_id) {
        const message = !!testResult.failureMessages.length ? testResult.failureMessages : `**${testResult.status}**`;
        const elapsed = formatTime(testResult.duration);
        const status_id = status[testResult.status];
        const comment = `#${testResult.ancestorTitles}#`
            + '\n' + testResult.title
            + '\n' + message;
        return {
            "case_id": parseInt(case_id),
            "status_id": status_id,
            "comment": comment,
            "elapsed": elapsed,
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
    let s = Math.round(ms/milsecond);
    s = !!s ? s : 1;
    return `${s}s`;
}

function getCaseId(str) {
    let number = '';
    if (~str.indexOf('C')) {
        const index = str.indexOf('C')+1;
        if (isNaN(str[index])) return getCaseId(str.slice(index))
        for (let i = index; i < str.length; i++) {
            if (isNaN(str[i])) break
            number = number + str[i];
        }
    }
    return number;
}