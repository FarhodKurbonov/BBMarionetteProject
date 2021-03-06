var express      = require('express'),
  path         = require('path'),
  favicon      = require('serve-favicon'),
  log          =   require('libs/log')(module),
  cookieParser = require('cookie-parser'),
  bodyParser   = require('body-parser'),
  errorHandler = require('errorhandler'),
  config       = require('config');


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views/templates'));
app.set('view engine', 'jade');


app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('routes')(app);

//-----------------Uncomment for Grunt------------
//var server = require('http').createServer(app);
//var io = require('socket')(server);
//app.set('port', config.get('port'));
//server.listen(config.get('port'));
//------------------------------------------------
// Handle errors
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
//module.exports.io = io;
