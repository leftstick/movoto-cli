'use strict';

var esformatter = require('esformatter');
var path = require('path');
var fs = require('fs');
var promiseify = require('just-promiseify');
var chalk = require('chalk');
var glob = require('glob');
var shell = require('../../lib/shell');

var log = console.log;

var cmd = {
    command: 'fmt [fileGlob]',
    description: 'format specific JavaScript code',
    options: [
        {
            flags: '-u, --unstaged',
            description: 'format not staged files'
        }
    ],
    precheck: function(){
        return true;
    },
    action: function(fileGlob, options, cb){
        var filesThen,
            ERROR = 'Incorrect usage, you have to set either fileGlob or --unstaged option',
            configFile = require(path.resolve(__dirname, 'esformatter.json'));
        ;

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

                files.forEach(function(file){
                    var codeStr = fs.readFileSync(file, 'utf8');
                    var formattedCode = esformatter.format(codeStr, configFile);
                    fs.writeFileSync(file, formattedCode, 'utf8');
                    log('--' + chalk.yellow(file));
                });
                log(chalk.green('Above file' + (files.length > 1 ? 's' : '') + ' formatted!'));
            })
            .catch(cb);
    }
};

module.exports = cmd;
