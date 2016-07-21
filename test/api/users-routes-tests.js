var testSetup = require(process.env.PWD + '/tests/test-setup');

// create node environment & instance of expressApp
var nodeAppPath = testSetup.prepareNodeEnvironment();

var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var rek = require('rekuire');
var appMaker = require(nodeAppPath +'/app/app.js');
var chai = require('chai')
var expect = chai.expect;

// used for seed data
var usersApi = rek('users-api');

// used for getting a JWT for hitting secured API calls
var usersApi = rek('users-api');

describe('Express App', function() {
  it('should load without errors', function(done) {
    appMaker.initialize()
      .then(function(expressApp) {
        done();
        runTests(expressApp);
      });
  });
});

var runTests = function(expressApp) {
  describe('users-api', function() {
    var users;
    var jwt;
    var testDataIndex = 0;
    var lastUpdatedPropertyValue = null;

    var handleError = function(error) {
      console.log('HANDLE ERROR:');
      console.log(error);

      throw error;
    }

    beforeEach(function (done) {
      testSetup.clearDb(mongoose, done);
      users = [];
      testDataIndex = 0;
      lastUpdatedPropertyValue = null;
    });

    var createTestDocument = function() {
      var testDocument = {};

testDocument.dateCreated = new Date();
testDocument.email = 'email_'+testDataIndex;
testDocument.salt = 'salt_'+testDataIndex;
testDocument.password = 'password_'+testDataIndex;
testDocument.first = 'first_'+testDataIndex;
testDocument.last = 'last_'+testDataIndex;
testDocument.isAdmin = true,


      lastUpdatedPropertyValue = testDocument.email;

      testDataIndex++;

      return testDocument;
    };

    var updateTestDocument = function(testDocument) {
testDocument.dateCreated = new Date();
testDocument.email = 'email_'+testDataIndex;
testDocument.salt = 'salt_'+testDataIndex;
testDocument.password = 'password_'+testDataIndex;
testDocument.first = 'first_'+testDataIndex;
testDocument.last = 'last_'+testDataIndex;
testDocument.isAdmin = true,


      lastUpdatedPropertyValue = testDocument.email;

      testDataIndex++;

      return testDocument;
    }

    var createTestData = function(done) {
      // create a entity
      usersApi.post(createTestDocument())
      .then(function(newUser) {
        // capture data for asserts later
        users.push(newUser);

        // create second entity
        usersApi.post(createTestDocument())
          .then(function(newUser) {
            // capture new entity for asserts later
            users.push(newUser);
            done();
          })
          .catch(handleError);
      })
      .catch(handleError);
    }

    beforeEach(function(done) {
      // for all tests create a user to get a token
      usersApi.post({ email: 'h@h.com' , fullName: 'mama', password: '1234' })
        .then(function(newUserResponse) {
          jwt = newUserResponse.token;

          createTestData(done);
        })
        .catch(handleError);
    });

    afterEach(function (done) {
      testSetup.disconnect(mongoose, done);
    });

    it('should GET a user by id', function(done) {
      request(expressApp)
        .get('/api/users/' +users[0].id)
        .set('Authorization', 'Bearer ' +jwt)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          var userFromServer = res.body;

          expect(userFromServer._id).to.equal(users[0].id);

          if (err) {
            console.log(JSON.stringify(err));
            throw err;
          }
          done();
        });
    });

    it('should DELETE a user by _id', function(done) {
      request(expressApp)
        .delete('/api/users/' +users[0].id)
        .set('Authorization', 'Bearer ' +jwt)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          if (!err) {
            usersApi.get(users[0].id)
              .then(function(user) {
                expect(user).to.be.null;
                done();
              });
          } else {
            console.log(JSON.stringify(err));
            throw err;
          }
        });
    });

    it('should POST a user', function(done) {
      request(expressApp)
        .post('/api/users')
        .set('Authorization', 'Bearer ' +jwt)
        .send(createTestDocument())
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          var newUser = res.body;

          if (!err) {
            usersApi.get(newUser._id)
              .then(function(user) {
                expect(user).to.be.defined;
                done();
              });
          } else {
            console.log(JSON.stringify(err));
            throw err;
          }
        });
    });

    it('should PUT a user', function(done) {
      updateTestDocument(users[0]);

      request(expressApp)
        .put('/api/users/' +users[0].id)
        .set('Authorization', 'Bearer ' +jwt)
        .send(users[0])
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          if (!err) {
            usersApi.get(users[0].id)
              .then(function(user) {
                expect(user.email).to.equal(lastUpdatedPropertyValue);
                done();
              });
          } else {
            console.log(JSON.stringify(err));
            throw err;
          }
        });
    });

    it('should fetch  a user using a mongo query', function(done) {
      request(expressApp)
        .post('/api/users/query')
        .set('Authorization', 'Bearer ' +jwt)
        .send({
          email: users[0].email
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          var userFromServer = res.body[0];

          expect(userFromServer._id).to.equal(users[0].id);

          if (err) {
            console.log(JSON.stringify(err));
            throw err;
          }
          done();
        });
    });

  });
};
