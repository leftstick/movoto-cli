'use strict';

var CLIEngine = require('eslint').CLIEngine;
var path = require('path');
var chalk = require('chalk');

var cmd = {
    command: 'lint <file>',
    description: 'lint specific JavaScript code',
    options: [],
    precheck: function() {
        return true;
    },
    action: function(file, cb) {
        var cli = new CLIEngine({
            configFile: path.resolve(__dirname, 'eslintrc.json'),
            useEslintrc: false
        });
        var report = cli.executeOnFiles([file]);
        var formatter = CLIEngine.getFormatter('stylish');
        console.log(formatter(report.results) || chalk.green('The code looks all good!'));
    }
};

module.exports = cmd;
