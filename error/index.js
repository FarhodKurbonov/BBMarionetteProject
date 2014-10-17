var path = require('path');
var util = require('util');
var http = require('http');
function SocketError(status, message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, SocketError);
  this.status = status;
  this.message = message || http.STATUS_CODES[status];

}

util.inherits(SocketError, Error);
SocketError.prototype.name = 'SocketError';
module.exports = SocketError;