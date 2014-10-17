/**
 * Base CollectionView
 */
define(['app'], function (App) {
  App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
    /**
     * @constructor
     * @extends {Marionette.CollectionView}
     * @type {Object}
     */
    Views.CollectionView = Marionette.CollectionView.extend({});
  });
  return App.Views.CollectionView;
});