define(['marionette'], function (Marionette) {
  var App = new Marionette.Application();
  App.addRegions({
    headerRegion: '#header-region',
    mainRegion: '#main-region',
    footerRegion: '#footer-region'
  });


  App.on('start', function() {
    if(Backbone.history){ Backbone.history.start() }
  });

  require([
    'apps/footer/FooterApp',
    'apps/header/HeaderApp'
  ], function () {
    App.addInitializer(function() {
      App.module('HeaderApp').start();
      App.module('FooterApp').start();

    });

  });
  return App;
});