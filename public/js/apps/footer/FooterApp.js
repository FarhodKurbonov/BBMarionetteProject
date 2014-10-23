define(['app', 'apps/footer/show/showController'], function (App, Controllers) {
  App.module('FooterApp', function(FooterApp, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;

    var API = {
      showFooter: function() {
        Controllers.showFooter();
          console.log('headerApp');
      }
    };
    FooterApp.on('start', function () {
      API.showFooter()
    })

  });
  return App.FooterApp;
});