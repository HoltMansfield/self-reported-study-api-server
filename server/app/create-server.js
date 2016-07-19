var rek = require('rekuire');
var Promise = require('bluebird');
var setupExpress = rek('setup-express');
var routeLoader = rek('../routes/load-routes');
// //var mongoManager = rek('../data/mongo-manager');


var doInitalization = function() {
  return setupExpress.initialize()
          .then(setupExpress.preRoutesInitalization)
          .then(routeLoader.createRoutes)
          // .then(mongoManager.connect)
          // .then(expressMaker.postRoutesInitalization)
          .then(setupExpress.listen)
          //.then(returnServer)
          .catch(handleServerCreationError);
}

var handleServerCreationError = function(err) {
  //email admins etc
  console.log('SOMETHING HORRIFIC HAS HAPPENED'); 
  console.log(err);
};

module.exports.createServer = doInitalization;

// function() {
//   // // check to see if a previous test has created this server
//   // if(server) {
//   //   // return the existing server instance
//   //   return Promise.resolve(server);
//   // } else {
//   //   // this is the first time this has been called, go ahead and create the server
//     return doInitalization;
//   //}
// };