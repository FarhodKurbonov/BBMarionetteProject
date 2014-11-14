define(['app', 'apps/footer/list/listController'], function (App, Controllers) {
  App.module('FooterApp', function(FooterApp, App, Backbone, Marionette, $, _) {
    FooterApp.startWithParent = false;

    FooterApp.onStart = function() {
      API.listFooter();
      console.info('Start FooterApp!');
    };

    FooterApp.onBeforeStop = function () {
      console.info('Stop FooterApp');
      //Destroy FooterApp.List.Controller and unbind all events
      Controllers.destroy();
      //Clear FooterRegion
      App.footerRegion.empty();


    };

    var API = {
      listFooter: function() {
        Controllers.listFooter();
      }
    };

  });
  return App.FooterApp;
});