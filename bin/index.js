#!/usr/bin/env node

'use strict';

var program = require('commander');
var pkg = require('../package.json');

program
    .version(pkg.version)
    .description('Real Estate Made Easy')
    .parse(process.argv);


if (process.argv.length === 2) {
    require('./commands/default')();
}
