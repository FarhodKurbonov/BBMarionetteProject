define([
  'app',
  'libs/views/_base/ItemView',
  'tpl!apps/footer/list/templates/footer.tpl'
], function (App, ItemView, footerTpl) {
  App.module('FooterApp.List', function(List, App, Backbone, Marionette, $, _) {
    List.Footer = ItemView.extend({
      template: footerTpl,
      id: 'footer'

    });
  });
  return App.FooterApp.List;
});