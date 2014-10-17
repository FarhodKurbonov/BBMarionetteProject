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
    'underscore': 'vendor/underscore',
    'iosync'    : 'vendor/backbone.iosync',
    'spin'      : 'vendor/spin',
    'spin.jquery': 'vendor/spin.jquery'
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
    'iosync'     : ['backbone', 'socket.io'],
    'tpl'        : ['text', 'underscore'],
    'spin.jquery': ['jquery','spin']
  }
});
var self = this;
require(['socket.io', 'app'], function(io, App) {
  window.socket = io.connect('');
  self.App = App;
  App.start();
  console.dir('Start main App');
});
