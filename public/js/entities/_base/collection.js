/**
 * Base collection
 */
define(['app'], function (App) {
App.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {
  /**
   * @constructor
   * @extends {Backbone.Collection}
   * @type {Object}
   */
    Entities.Collection = Backbone.Collection.extend({});
  });
  return App.Entities.Collection;
});