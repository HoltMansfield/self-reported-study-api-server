// this file is called directly to start the server // test instances directly call app.createServer
var app = require('./app');

// set the development environment
process.env.NODE_ENV = 'development';
process.env.PORT = process.env.PORT || 3000;

// needed this to make tests and server both happy...see if I need it
//process.env.nodeAppPath = process.env.PWD + '/server';

// start the app
app.createServer();