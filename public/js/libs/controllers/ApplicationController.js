define(['app'], function (App) {
  /**
   * Base Controller
   */
  App.module('Controllers', function(Controllers, App, Backbone, Marionette, $, _) {
    /**
     * @constructor
     * @extends {Marionette.Controller}
     * @type {Object}
     */
    Controllers.Application = Marionette.Controller.extend({});
  });
  return App.Controllers.Application;
});