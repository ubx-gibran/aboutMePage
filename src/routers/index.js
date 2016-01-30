'use stric'

/**
 * Router loader
 */

var fs   = require('fs'),
    path = require('path');

var routers = [];

fs.readdirSync(__dirname).filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function(file) {
    routers.push(require(path.join(__dirname, file)));
});

module.exports = routers;
