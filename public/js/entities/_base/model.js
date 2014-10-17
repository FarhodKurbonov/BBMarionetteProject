/**
 * Base model
 */
define(['app'], function (App) {
  App.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {
    /**
     * @constructor
     * @extends {Backbone.Model}
     * @type {Object}
     */
    Entities.Model = Backbone.Model.extend({});
  });
  return App.Entities.Model;
});