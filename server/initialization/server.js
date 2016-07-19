var server = require('server');

module.exports.listen = function(app) {
    // default port
    process.env.PORT = process.env.PORT || 3000;

    // default to the development environment
    process.env.NODE_ENV = 'development';

    app.express.set('port', process.env.PORT);

    var server = app.express.listen(app.express.get('port'), function() {
        console.log('~ Express server listening on port #: ' + server.address().port);
    });
}