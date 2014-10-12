define(['app', 'tpl!apps/footer/show/templates/layout.tpl'], function (App, layoutTpl) {
  App.module('FooterApp.Show', function(Show, App, Backbone, Marionette, $, _) {
    Show.Footer = Marionette.ItemView.extend({
      template: layoutTpl,
      id: 'footer'
    });
  });
  return App.FooterApp.Show;
});