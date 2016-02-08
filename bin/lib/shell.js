'use strict';

var exec = require('child_process').exec;

var next = function(cmds, displayCmdItself, cb) {
    if (!cmds.length) {
        return cb && cb();
    }
    var cmd = cmds.shift();

    if (displayCmdItself) {
        console.log(cmd);
    }
    var child = exec(cmd, function() {
        next(cmds, displayCmdItself, cb);
    });
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
};

var shell = function(commands, displayCmdItself, cb) {
    var cmds = commands.slice();
    next(cmds, displayCmdItself, cb);
};

module.exports = shell;
