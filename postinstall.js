'use strict';


var go = require('go-txt');
var resolve = require('path').resolve;

var lintPath = resolve(__dirname, 'bin', 'commands', 'lint');

var isWin = /^win/.test(process.platform);

go(resolve(lintPath, 'eslintrc_node.json'), resolve(lintPath, 'eslintrc_node'), function(content) {
    return content.replace(/LINEBREAK_OS/g, isWin ? 'windows' : 'unix');
});
