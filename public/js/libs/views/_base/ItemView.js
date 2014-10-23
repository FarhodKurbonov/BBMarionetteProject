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
    _.extend(Views.ItemView.prototype, {
      /**
       * Этот метод применяет фдэш эффект.
       * Применяется для анимации вставки или удаления элемента
       * @export
       * @param {String} cssClass
       */
      flash: function (cssClass) {
        var $view = this.$el;
        $view.hide().toggleClass(cssClass).fadeIn(800, function () {
          setTimeout(function () {
            $view.toggleClass(cssClass);
          }, 500)
        })
      },
      /**
       * @param {String.<info|warning|error|sucess>} toggleClassName
       * @this ItemView Элемент над котором производится действие
       */
      highlight: function (toggleClassName) {
        this.$el.toggleClass(toggleClassName);
        this.trigger('artist:data', this.model)
      }
    });
  });
  return App.Views.ItemView;
});