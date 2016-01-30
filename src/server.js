/**
 * Gibran website
 * =============
 * General-purpose website, about my knowledge,
 * skills, achievements and aspirations.
 */

// Load packages
var express = require('express');
var Promise = require('bluebird');
var debug = require('debug');
var path = require('path');
var jade = require('jade');
var fs = require('fs');

// Load configuration
var env = process.env.NODE_ENV || 'development';
var cfg = require(path.join(__dirname, 'config.json'))[env];

/**
 * Define the site.
 */
var Site = function() {

    //Scope
    var self = this;

    /* ======================================== */
    /* Helper functions.                        */
    /* ======================================== */

    /**
     * Set up server IP address and port # usgin env variables/defaults.
     */
    self.setupVariables = function () {
        // Node web server
        cfg.ip   = process.env[cfg.e_ip]     || '127.0.0.1';
        cfg.port = process.env[cfg.e_port]   || 3000;
        
        // MongoDB
        // TODO: Define the documents.
        /*
        cfg.db.host = process.env[cfg.db.e_host] || '127.0.0.1';
        cfg.db.port = process.env[cfg.db.e_port] || 27017;
        */

        // Redis
        // TODO: Incorporate session with redis.
    };

    /**
     * Populate the cache.
     */
    self.populateCache = function() {
        if(typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        // Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };

    /**
     * Retrieve entry {content} from cache.
     * @param {string} key indentifying content to retireve cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };

    /**
     * terminator === the terminator handler
     * Terminate server on receipt of the specified signal.
     * @param {string} sig signal to terminate on.
     */
    self.terminator = function(sig) {
        if(typeof sig === "string") {
            console.log('%s: Received %s - terminating sample app ...',
                        Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };
    
    /**
     * Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function() {
        // Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
        'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };

    /*  ================================================================  */
    /*  A[[ server functions (main app logic here).                       */
    /*  ================================================================  */
    
    /**
     *
     * Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        return new Promise(function(resolve, reject) {
            // Load routers
            require(path.join(__dirname, 'routers')).forEach(function(init) {
                var router = init(self.cfg);
                self.app.use(router.prefix, router.router);
            });

            return resolve();
        });
    };

    /**
     * Initialize the server (express) and create the routes and register
     * the handlers.
     */
    self.initializeServer = function() {
        self.app = express();
        self.app.set('views', path.join(__dirname, 'views'));
        self.app.set('view engine', 'jade');
        self.createRoutes();

        // Add handlers for the site (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
    };

    /**
     * Initialize the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        //self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };

    /**
     * Start the server (starts up the sample application).
     */
    self.start = function() {
        // Start the app on the specific interface (and port).
        //  self.app.listen(self.port, self.ipadress, function() {
        //    console.log('%s: [STATUS] website running! %s:%d ...',
        //                Date(Date.now() ), self.ipadress, self.port);
        self.app.listen(cfg.port, cfg.ip, function() {
            console.log('%s: [STATUS] Gibranv website running! %s:%d',
                        Date(Date.now() ), cfg.ip, cfg.port);
        });
    };
    
};


/**
 * --- Start-up ---
 */
var site = new Site();
site.initialize();
site.start();
