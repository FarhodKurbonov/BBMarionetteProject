define([
  'app',
  'libs/controllers/ApplicationController',
  'apps/footer/show/showView'
], function (App, Controllers, View) {
  App.module('FooterApp.Show', function(Show, App, Backbone, Marionette, $, _) {

    var Controller = Controllers.extend( {
      showFooter: function () {
        var footerView = new View.Footer;
        App.footerRegion.show(footerView)
      }
    });
    Show.Controller = new Controller();
  });
  return App.FooterApp.Show.Controller;
});