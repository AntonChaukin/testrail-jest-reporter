'use strict';
var fs = require('fs-extra'),
    path = require('path'),
    uuid = require('uuid');

module.exports = {
    writeSuite: function(targetDir, suites) {
        fs.outputFileSync(path.join(targetDir, uuid.v4() + '-testsuite.json'), JSON.stringify(suites, null, '\t'));
    },
    writeBuffer: function(targetDir, buffer, ext) {
        var fileName = uuid.v4() + '-attachment.' + ext;
        fs.outputFileSync(path.join(targetDir, fileName), buffer);
        return fileName;
    }
};