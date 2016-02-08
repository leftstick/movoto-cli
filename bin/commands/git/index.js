'use strict';

var shell = require('../../lib/shell');
var isWin = /^win/.test(process.platform);

var cmd = {
    command: 'git',
    description: 'config git alias for the repo',
    options: [
        {
            flags: '-u, --username <username>',
            description: 'username you\'d like to set for the repo'
        },
        {
            flags: '-e, --email <email>',
            description: 'email you\'d like to set for the repo'
        }
    ],
    precheck: function(options) {
        return options.username && options.email;
    },
    action: function(options) {
        shell([
            `git config --local user.name ${options.username}`,
            `git config --local user.email ${options.email}`,
            'git config --local core.excludesfile $HOME/.gitignore',
            'git config --local core.autocrlf ' + (isWin ? 'true' : 'input'),
            'git config --local core.ignorecase false',
            'git config --local color.ui true',
            'git config --local gui.encoding utf-8',
            'git config --local push.default simple',
            'git config --local branch.autosetupmerge always',
            'git config --local branch.autosetuprebase always',
            'git config --local alias.co checkout',
            'git config --local alias.st status',
            'git config --local alias.br branch',
            'git config --local alias.ci commit',
            'git config --local alias.cp cherry-pick',
            'git config --local alias.df diff',
            'git config --local alias.lo log --oneline',
            'git config --local alias.pr pull --rebase',
            'git config --local alias.pl pull',
            'git config --local alias.ps push'
        ], true);
    }
};

module.exports = cmd;
