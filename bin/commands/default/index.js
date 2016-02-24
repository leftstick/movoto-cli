'use strict';

var cmd = function() {
    var pictureTube = require('picture-tube');
    var tube = pictureTube();
    tube.pipe(process.stdout);

    var createReadStream = require('fs').createReadStream;
    var resolve = require('path').resolve;
    createReadStream(resolve(__dirname, '..', '..', '..', 'img', 'movoto_white.png')).pipe(tube);
};

module.exports = cmd;
