define(['app', 'libs/views/regions/dialogView'], function(App, ViewsCommonDialog) {
  App.module('ArtistsApp.Edit', function (Edit, App, Backbone, Marionette, $, _) {
    Edit.Artist = ViewsCommonDialog.Form.extend({
      onBeforeRender: function () {
        this.title = 'Редактирование ' + this.model.get('name');
      },
      onRender: function () {
        if (this.options && this.options.generateTitle) {
          var $title = $('<h1>', {text: this.title});
          this.$el.prepend($title);
        }
        this.$('.js-submit').text('Обновить');
      }
    })
  });
  return App.ArtistsApp.Edit;
});