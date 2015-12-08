/**
 * Gibran website
 * =============
 * General-purpose website, about my knowledge,
 * skills, achievements and aspirations.
 */

// Load packages
var express = require('express');

/**
 * Site class
 *
 * @class Site
 * @constructor
 */
var app = express()
app.get('/home', function(req, res) {
    res.end('Hello Gibran Vargas');
})
app.listen(3000)
