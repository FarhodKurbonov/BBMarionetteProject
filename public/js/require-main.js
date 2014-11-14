requirejs.config({
  baseUrl: 'js',
  paths  : {
    'socket.io' : 'vendor/socket.io',
    'backbone'  : 'vendor/backbone',

    'jquery'    : 'vendor/jquery',
    'jquery-ui' : 'vendor/jquery-ui',
    'json2'     : 'vendor/json2',
    'marionette': 'vendor/backbone.marionette',
    'text'      : 'vendor/text',
    'tpl'       : 'vendor/underscore-tpl',
    'underscore': 'vendor/underscore',
    'iosync'    : 'vendor/backbone.iosync',
    'validation': 'vendor/backbone.validation',
    'paginator' : 'vendor/backbone.paginator',
    'syphon'    : 'vendor/backbone.syphon',
    'spin'      : 'vendor/spin',
    'spin.jquery':'vendor/spin.jquery',
    'picky'     : 'vendor/backbone.picky',
    'affix'     : 'vendor/bootstrap/affix',
    'ss'        : 'vendor/socket.io-stream',
    'soundmanager2' : 'vendor/soundmanager2',
    'scroller'  : 'vendor/jscroller',
    'bootsrap-collapse': 'vendor/bootstrap/affix'


  },
  shim   : {
    'socket.io' : {
      exports: 'io'
    },
    'ss' : {
      exports: 'ss'
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

    'soundmanager2': {
      exports: 'soundManager'
    },

    'scroller': {
      exports: '$jScroller'
    },

    'iosync'     : ['backbone', 'socket.io'],
    'jquery-ui'  : ['jquery'],
    'validation' : ['backbone'],
    'paginator'  : ['backbone'],
    'tpl'        : ['text', 'underscore'],
    'syphon'     : ['backbone'],
    'spin.jquery': ['jquery','spin'],
    'picky'      : ['backbone'],
    'affix'      : ['jquery'],
    'bootsrap-collapse': ['jquery']
  }
});
var self = this;
require(['socket.io', 'app', 'apps/header/HeaderApp', 'apps/footer/FooterApp', 'apps/player/playerApp'], function(io, App) {
  window.socket = io.connect('');
  self.App = App;
  App.start();
  console.info('Start main App');
});
