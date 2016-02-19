'use strict';

var browserSync = require('browser-sync');
var history = require('connect-history-api-fallback');

var cmd = {
    command: 'server',
    description: 'serve current repo as web server',
    options: [
        {
            flags: '-p, --port <port>',
            description: 'use a specific port for the server'
        },
        {
            flags: '-m, --html5',
            description: 'enable html5 mode, which respond with index.html for 404 request'
        }
    ],
    precheck: function(){
        return true;
    },
    action: function(options, cb){
        var bs = browserSync.create();
        var initOpts = {
            ui: false,
            server: {
                baseDir: process.cwd(),
                directory: false
            },
            files: [
                './**/*.*'
            ],
            port: options.port || 3000,
            open: 'local',
            reloadOnRestart: true,
            injectChanges: true
        };
        if (options.html5){
            initOpts.middleware = [history()];
        }

        bs.init(initOpts);
        bs.reload();
    }
};

module.exports = cmd;
