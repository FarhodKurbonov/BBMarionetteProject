define([
  'app',
  'libs/views/_base/ItemView',
  'tpl!apps/footer/show/templates/layout.tpl'
], function (App, ItemView, layoutTpl) {
  App.module('FooterApp.Show', function(Show, App, Backbone, Marionette, $, _) {
    Show.Footer = ItemView.extend({
      template: layoutTpl,
      id: 'footer'
    });
  });
  return App.FooterApp.Show;
});