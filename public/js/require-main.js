requirejs.config({
  baseUrl: 'js',
  paths  : {
    'socket.io' : 'vendor/socket.io',
    'backbone'  : 'vendor/backbone',
    'jquery'    : 'vendor/jquery',
    'json2'     : 'vendor/json2',
    'marionette': 'vendor/backbone.marionette',
    'text'      : 'vendor/text',
    'tpl'       : 'vendor/underscore-tpl',
    'underscore': 'vendor/underscore'
  },
  shim   : {
    'socket.io' : {
      exports: 'io'
    },
    'underscore': {
      exports: '_'
    },
    'backbone'  : {
      deps: ['jquery', 'underscore', 'json2'],
      exports: 'Backbone'
    },
    'marionette': {
      deps: ['backbone'],
      exports: 'Marionette'
    },
    'tpl'       : ['text', 'underscore']
  }
});
var self = this;
require(['socket.io', 'app'], function(io, App) {
  console.dir(App);
  window.socket = io.connect('');
  window.socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
  self.App = App;
  App.start();
});
