var Promise = require('bluebird');
var expressMaker = require('../initalization/express');
var routeMaker = require('../routes/load-routes');
var mongoManager = require('../data/mongo-manager');
var serverMaker = require('../init/server');

// each supertest suite will attempt to create this express app
var server;

var returnServer = function(expressMakerResult) {
  // now that our promise chain has completed, capture the result to maintain state and return the new server
 server = expressMaker;

 return server;
};

var doInitalization = function() {
  return expressMaker.initialize()
          .then(expressMaker.preRoutesInitalization)
          .then(routeMaker.createRoutes)
          .then(mongoManager.connect)
          .then(expressMaker.postRoutesInitalization)
          .then(serverMaker.listen)
          .then(returnServer)
          .catch(handleServerCreationError);
}

var handleServerCreationError = function() {
  //email admins etc
  console.log('SOMETHING HORRIFIC HAS HAPPENED'); 
};

module.exports.createServer = function() {
  // check to see if a previous test has created this server
  if(server) {
    // return the existing server instance
    return Promise.resolve(server);
  } else {
    // this is the first time this has been called, go ahead and create the server
    return new Promise(doInitalization);
  }
};