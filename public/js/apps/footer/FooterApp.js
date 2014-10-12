define(['app'], function (App) {
  App.module('FooterApp', function(FooterApp, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;

    var API = {
      showFooter: function() {
        require(['apps/footer/show/showController'], function(FooterAppShow) {
          FooterAppShow.Controller.showFooter()
        });
      }
    };
    FooterApp.on('start', function () {
      API.showFooter()
    })

  });
  return App.FooterApp;
});