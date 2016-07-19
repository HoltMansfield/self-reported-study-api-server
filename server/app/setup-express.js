var Promise = require('bluebird');
var express    = require('express');
var expressJwt = require('express-jwt');

var doInitialization = function(resolve, reject) {
    var app = express();

    resolve(app);
};

var doConnection = function(resolve, reject, app) {
     // default port
    process.env.PORT = process.env.PORT || 3000;

    // default to the development environment
    process.env.NODE_ENV = 'development';

    app.set('port', process.env.PORT);

    app.listen(app.get('port'), function() {
        console.log('~ Express server listening on port #: ' + app.get('port'));

        resolve(app);
    });   
};

var preRoutesInitalization = function(resolve, reject, app) {
  // parse all urls for JWT except route included in 'path' below
  app.use(expressJwt({ secret: 'toDo: use cert'})
                    .unless({
                      path:
                      [
                          { url: '/api/admins/login', methods: ['POST']  },
                          { url: '/api/users', methods: ['POST']  },
                          { url: '/', methods: ['GET']  },
                      ],
                    }));

  resolve(app);                    
};


// the first method called during startup takes no arguments
module.exports.initialize = function() {
    return new Promise(doInitialization);
};

// The actual http listener
module.exports.listen = function(app) {
    return new Promise(function(resolve, reject) {
        return doConnection(resolve, reject, app);
    });
};

// Middleware that needs to be configured before routes are created
module.exports.preRoutesInitalization = function(app) {
    return new Promise(function(resolve, reject) {
        return preRoutesInitalization(resolve, reject, app);
    });
};