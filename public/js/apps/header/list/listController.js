define([
  'app',
  'libs/controllers/ApplicationController',
  'apps/header/list/listView',
  'entities/header'

],
  function (App, Controllers, View) {
    App.module('HeaderApp.List', function (List, App, Backbone, Marionette, $, _) {
      var Controller = Controllers.extend({
        listHeader: function () {
          var links = App.request('header:entities');
          var headers = new View.Headers({collection: links});
          var self = List.Controller;
          self.listenTo(headers, 'brand:clicked', function () {
            App.trigger('letters:list')
          });

          self.listenTo(headers, 'childview:navigate', function (childView, model) {
            var trigger = model.get('navigationTrigger');
            App.trigger(trigger);

          });
          App.headerRegion.show(headers);

        },

        setActiveHeader: function (headerUrl) {

          var links = App.request('header:entities');
          var headerToSelect = links.find(function (header) {
            return header.get('url') === headerUrl;
          });
          headerToSelect.select();
          links.trigger('reset')
        }
      });

      List.Controller = new Controller();
    });
    return App.HeaderApp.List.Controller;
  })