define([
        'app',
        'libs/views/_base/ItemView',
        'tpl!libs/views/regions/templates/form.tpl',
        'syphon'
], function(App, ItemView, formTpl) {
  App.module('Views.Common.Dialog', function (Dialog, App, Backbone, Marionette, $, _) {
    Dialog.Form = ItemView.extend({
      template: formTpl,

      events: {
        'click button.js-submit': 'submitClicked'
      }
    });

    _.extend(Dialog.Form.prototype, {

      submitClicked: function (e) {
        e.preventDefault();
        var data = Backbone.Syphon.serialize(this);
        this.trigger('form:submit', data)
      },

      onFormDataInvalid: function (errors) {
        var $view = this.$el;

        var clearFormErrors = function () {
          var $form = $view.find('form');
          $form.find('.help-block.has-error').each(function () {
            $(this).remove();
          });
          $form.find('.form-group.has-error').each(function () {
            $(this).removeClass('has-error');
          });
        };

        var markErrors = function (value, key) {

          var $controlGroup = $view.find('#artist-' + key).parent();
          var $errorElement = $('<span>', {class: 'help-block has-error', text: value});
          $controlGroup.append($errorElement).addClass('has-error');
        };
        clearFormErrors();
        _.each(errors, markErrors);
      }
    });
  });
  return App.Views.Common.Dialog;
});