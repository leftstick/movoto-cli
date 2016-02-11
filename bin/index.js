#!/usr/bin/env node

'use strict';

var fs = require('fs');
var resolve = require('path').resolve;
var chalk = require('chalk');
var program = require('commander');
var updateNotifier = require('update-notifier');
var promiseify = require('just-promiseify');
var pkg = require('../package.json');

updateNotifier({pkg: pkg}).notify();

program
    .version(pkg.version)
    .description(pkg.description);

if (process.argv.length === 2) {
    require('./commands/default')();
} else {
    var readdir = promiseify(fs.readdir);

    readdir(resolve(__dirname, 'commands'))
        .then(function(files) {
            return files.filter((file) => file !== 'default');
        })
        .then(function(files) {
            return files.map((file) => resolve(__dirname, 'commands', file));
        })
        .then(function(files) {
            return files.map(function(file) {
                return require(file);
            });
        })
        .then(function(commands) {
            commands.forEach(function(cmd) {
                var c = program
                    .command(cmd.command)
                    .description(cmd.description);
                cmd.options.forEach((opt) => {
                    c.option(opt.flags, opt.description);
                });
                c.action(function(options) {
                    if (!cmd.precheck(options)) {
                        c.help();
                        return;
                    }
                    try {
                        cmd.action(options, function(err) {
                            if (err) {
                                console.log(chalk.red(err));
                            }
                        });
                    } catch (e) {
                        console.log(chalk.red(e));
                    }
                });
            });
        })
        .then(function() {
            program.parse(process.argv);
        });
}
