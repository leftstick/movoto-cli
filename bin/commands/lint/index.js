'use strict';

var CLIEngine = require('eslint').CLIEngine;
var path = require('path');
var promiseify = require('just-promiseify');
var chalk = require('chalk');
var glob = require('glob');
var shell = require('../../lib/shell');

var log = console.log;

var ENVS = ['browser', 'node'];

var cmd = {
    command: 'lint [fileGlob]',
    description: 'lint specific JavaScript code',
    options: [
        {
            flags: '-u, --unstaged',
            description: 'lint not staged files',
            flags: '-e, --env <environment>',
            description: 'which environments your script is designed to run in'
        }
    ],
    precheck: function(){
        return true;
    },
    action: function(fileGlob, options, cb){
        var filesThen,
            ERROR = 'Incorrect usage, you have to set either fileGlob or --unstaged option',
            configFile = path.resolve(__dirname, 'eslintrc_node.json');

        if (options.env && ENVS.indexOf(options.env) > -1 && options.env === 'browser'){
            configFile = path.resolve(__dirname, 'eslintrc_browser_legacy.json');
        }

        var cli = new CLIEngine({
            configFile: configFile,
            useEslintrc: false
        });

        if (fileGlob){
            filesThen = promiseify(glob)(fileGlob, {
                cwd: process.cwd()
            });
        }else if (options.unstaged){
            filesThen = promiseify(shell)(['git status --short'], {
                displayCmdItself: false,
                displayCmdResult: false
            })
                .then(function(data){
                    if (!data || !data.length || !data[0]){
                        return [];
                    }
                    return data[0].split('M')
                        .filter((file) => file && file.trim())
                        .map((file) => file.trim().replace('\n', ''))
                        .filter((file) => path.extname(file) === '.js');
                });
        }else {

            filesThen = Promise.reject(new Error(ERROR));
        }
        filesThen
            .then(function(files){
                if (!files || !files.length){
                    return log(chalk.yellow('no matched file found!'));
                }
                var report = cli.executeOnFiles(files);
                var formatter = CLIEngine.getFormatter('stylish');
                log(formatter(report.results) || chalk.green('The code looks all good!'));
            })
            .catch(cb);
    }
};

module.exports = cmd;
