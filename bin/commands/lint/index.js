'use strict';

var CLIEngine = require('eslint').CLIEngine;
var path = require('path');
var promiseify = require('just-promiseify');
var chalk = require('chalk');
var glob = require('glob');

var cmd = {
    command: 'lint <fileGlob>',
    description: 'lint specific JavaScript code',
    options: [],
    precheck: function() {
        return true;
    },
    action: function(fileGlob, cb) {
        var cli = new CLIEngine({
            configFile: path.resolve(__dirname, 'eslintrc.json'),
            useEslintrc: false
        });
        var files = promiseify(glob);
        files(fileGlob, {cwd: process.cwd()})
            .then(function(files) {
                var report = cli.executeOnFiles(files);
                var formatter = CLIEngine.getFormatter('stylish');
                console.log(formatter(report.results) || chalk.green('The code looks all good!'));
            });
    }
};

module.exports = cmd;
