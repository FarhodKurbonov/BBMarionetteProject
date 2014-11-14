define([
  'app',
  'libs/controllers/ApplicationController',
  'apps/footer/list/listView'
], function (App, Controllers, View) {
  App.module('FooterApp.List', function(List, App, Backbone, Marionette, $, _) {

    var Controller = Controllers.extend( {
      listFooter: function () {
        var footerView = new View.Footer;
        App.footerRegion.show(footerView)
      },
      onDestroy: function() {
      console.info('Закрытие контроллера FooterApp.Controller');
      }

    });
    console.info('create FooterApp.List.Controller');
    List.Controller = new Controller;
  });
  return App.FooterApp.List.Controller;
});