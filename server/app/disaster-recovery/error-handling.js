module.exports.errorHandler = function(err, req, res, next) {
  var validationErrors = null;

  if(err && err.errors) {
    validationErrors = err.errors;
  }

  res.status(422)
  .json(
  {
      success: false,
      name: err.name,
      message: err.message,
      stack: err.stack,
      validationErrors: validationErrors
  });

  if(!err.message || err.message.length === 0) {
    console.log('EMTPY ERROR FOUND');
    console.log('Need to investigate and refactor');
  }

  console.log(err.message);
};