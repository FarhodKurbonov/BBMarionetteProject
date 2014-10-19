/**
 * Base CompositeView
 */
define(['app'], function (App) {
  App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
    /**
     * @constructor
     * @extends {Marionette.CompositeView}
     * @type {Object}
     */
    Views.CompositeView = Marionette.CompositeView.extend({});
  });
  return App.Views.CompositeView;
});