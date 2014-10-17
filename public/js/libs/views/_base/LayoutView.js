/**
 * Base ItemView
 */
define(['app'], function (App) {
  App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
    /**
     * @constructor
     * @extends {Marionette.LayoutView}
     * @type {Object}
     */
    Views.LayoutView = Marionette.LayoutView.extend({});
  });
  return App.Views.ItemView;
});