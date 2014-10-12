requirejs.config({
  baseUrl: 'js',
  paths  : {
    'backbone'  : 'vendor/backbone',
    'jquery'    : 'vendor/jquery',
    'json2'     : 'vendor/json2',
    'marionette': 'vendor/backbone.marionette',
    'text'      : 'vendor/text',
    'tpl'       : 'vendor/underscore-tpl',
    'underscore': 'vendor/underscore'
  },
  shim   : {

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
require(['app'], function(App) {
  console.dir(App);
  self.App = App;
  App.start();
});
