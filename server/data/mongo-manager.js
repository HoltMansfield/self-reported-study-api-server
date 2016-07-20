var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var Schema       = mongoose.Schema;

var configValues = require('../app/config/config-loader');
var dbConnection;
var models = {};
var schema = {};

var createCollection = function(file) {
  var modelName = file.replace('.js','');
  var modulePath = './collections/' +modelName;
  var rawJson = require(modulePath);

  // create schema
  var schema = mongoose.Schema(rawJson);
  // create model
  var model = mongoose.model(modelName, schema);

  Promise.promisifyAll(model);
  Promise.promisifyAll(model.prototype);

  //aggregate this schema
  schema[modelName] = schema;

  // aggregate this model
  models[modelName] = model;

  console.log('~ collection created for: ' +modelName);
};

var importModels = function() {
  var srcpath = __dirname +'/collections';

  fs.readdirSync(srcpath).filter(function(file) {
    createCollection(file);
  });
};

module.exports.schema = schema;
module.exports.models = models;

module.exports.connect = function() {
  var mongoose = require('mongoose');

  // the mocha tests use their own connection
  if(process.env.NODE_ENV !== 'test') {
    mongoose.connect(configValues.mongo.connection);
    dbConnection = mongoose.connection;

    // this is only called if we don't handle the error in the callback to an operation
    dbConnection.on('error', console.error.bind(console, 'connection error:'));

    dbConnection.once('open', function callback() {
        console.log('~ MongoDB Initialized');
    });
  }

  importModels();
};
