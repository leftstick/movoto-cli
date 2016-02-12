'use strict';

var exec = require('child_process').exec;

var next = function(cmds, options, cb) {
    var cmd = cmds.shift();

    if (options.displayCmdItself) {
        console.log(cmd);
    }
    var child = exec(cmd, function(err, stdout, stderr) {
        if (err) {
            return cb && cb(err);
        }
        if (!cmds.length) {
            return cb && cb(null, stdout, stderr);
        }
        next(cmds, options, cb);
    });
    if (options.displayCmdResult) {
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
    }
};

var shell = function(commands, options, cb) {
    var cmds = commands.slice();
    next(cmds, Object.assign({
        displayCmdItself: false,
        displayCmdResult: true
    }, options), cb);
};

module.exports = shell;
