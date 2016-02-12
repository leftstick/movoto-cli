'use strict';

var path = require('path');
var fs = require('fs');
var promiseify = require('just-promiseify');
var shell = require('../../lib/shell');
var chalk = require('chalk');

var cmd = {
    command: 'deps',
    description: 'check if there is any update available for current package.json',
    options: [],
    precheck: function() {
        return true;
    },
    action: function(options, cb) {

        promiseify(fs.stat)(path.resolve(process.cwd(), 'package.json'))
            .then(function(stat) {
                if (!stat.isFile()) {
                    throw new Error('package.json is not a file!!!');
                }

                return promiseify(shell)([
                    'npm outdated --loglevel=error'
                ], false);
            })
            .then(function(arr) {
                if (!arr[0]) {
                    console.log(chalk.green('Everything looks good!'));
                }
            })
            .catch(cb);
    }
};

module.exports = cmd;
