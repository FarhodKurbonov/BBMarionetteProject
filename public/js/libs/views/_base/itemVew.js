/**
 * Base ItemView
 */
define(['app'], function (App) {
  App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
    /**
     * @constructor
     * @extends {Marionette.ItemView}
     * @type {Object}
     */
    Views.ItemView = Marionette.ItemView.extend({});
  });
  return App.Views.ItemView;
});