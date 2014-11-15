define([
        'app',
        'libs/views/_base/ItemView',
        'tpl!libs/views/regions/templates/form.tpl',
        'syphon'
], function(App, ItemView, formTpl) {
  App.module('Views.Common.Dialog', function (Dialog, App, Backbone, Marionette, $, _) {
    Dialog.Form = ItemView.extend({
      events: {
        'click button.js-submit': 'submitClicked'
      },
      initialize: function(options) {
       this.template = options.template
      }
    });
   
    _.extend(Dialog.Form.prototype, {

      submitClicked: function (e) {
        e.preventDefault();
        var data = Backbone.Syphon.serialize(this);
        this.trigger('form:submit', data)
      },

      onFormDataInvalid: function (options) {
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

          var $formControl = $view.find(options.field + key).parent();
          var $errorElement = $('<span>', {class: 'help-block has-error', text: value});
          $formControl.append($errorElement).addClass('has-error');
        };
        clearFormErrors();
        _.each(options.errors, markErrors);
        $('.update-file').hide();
      }
    });
  });
  return App.Views.Common.Dialog;
});
