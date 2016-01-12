var util = require('util');

function UnicityError(msg) {
    this.name = 'UnicityError';
    this.message = msg;

   Error.call(this);

   Error.captureStackTrace(this, this.constructor);
}

function PropertyError(msg) {
    this.name = 'PropertyError';
    this.message = msg;

    Error.call(this);

    Error.captureStackTrace(this, this.constructor);
}

function ConnectionError(msg) {
    this.name = 'ConnectionError';
    this.message = msg;

    Error.call(this);

    Error.captureStackTrace(this, this.constructor);
}

util.inherits(UnicityError, Error);
util.inherits(PropertyError, Error);
util.inherits(ConnectionError, Error);

exports.PropertyError = PropertyError;
exports.UnicityError = UnicityError;
exports.ConnectionError = ConnectionError;
