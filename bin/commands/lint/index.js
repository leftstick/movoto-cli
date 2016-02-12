'use strict';

var CLIEngine = require('eslint').CLIEngine;
var path = require('path');
var promiseify = require('just-promiseify');
var chalk = require('chalk');
var glob = require('glob');
var shell = require('../../lib/shell');

var cmd = {
    command: 'lint [fileGlob]',
    description: 'lint specific JavaScript code',
    options: [
        {
            flags: '-u, --unstaged',
            description: 'lint not staged files'
        }
    ],
    precheck: function() {
        return true;
    },
    action: function(fileGlob, options, cb) {

        var cli = new CLIEngine({
            configFile: path.resolve(__dirname, 'eslintrc.json'),
            useEslintrc: false
        });
        var filesThen;
        if (fileGlob) {
            filesThen = promiseify(glob)(fileGlob, {
                cwd: process.cwd()
            });
        } else if (options.unstaged) {
            filesThen = promiseify(shell)(['git status --short'], {
                displayCmdItself: false,
                displayCmdResult: false
            })
                .then(function(data) {
                    if (!data || !data.length || !data[0]) {
                        return [];
                    }
                    return data[0].split('M')
                        .filter((file) => file && file.trim())
                        .map((file) => file.trim().replace('\n', ''))
                        .filter((file) => path.extname(file) === '.js');
                });
        } else {
            filesThen = Promise.reject(new Error('Incorrect usage, you have to set either fileGlob or --unstaged option'));
        }
        filesThen
            .then(function(files) {
                if (!files || !files.length) {
                    return console.log(chalk.yellow('no matched file found!'));;
                }
                var report = cli.executeOnFiles(files);
                var formatter = CLIEngine.getFormatter('stylish');
                console.log(formatter(report.results) || chalk.green('The code looks all good!'));
            })
            .catch(cb);
    }
};

module.exports = cmd;
