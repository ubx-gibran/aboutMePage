'use strict'

/**
 * Basic page router
 */

var Promise = require('bluebird'),
    express = require('express'),
    debug = require('debug');

module.exports = (function(site, cfg) {
    var prefix = '/';
    var router = express.Router();

    /**
     * Home (GET)
     */
    router.get('/', function(req, res) {
        return res.status(200).render('index');
    });

    return {
        prefix: prefix,
        router: router
    };
});
