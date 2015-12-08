/**
 * Gibran website
 * =============
 * General-purpose website, about my knowledge,
 * skills, achievements and aspirations.
 */

// Load packages
var express = require('express');
var path = require('path');

/**
 * Site class
 *
 * @class Site
 * @constructor
 */
var app = express()
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/' + 'index.html'));
});
app.listen(3000)

console.log('Server is Running on localhost:3000; press Ctrl-C to terminate...');
