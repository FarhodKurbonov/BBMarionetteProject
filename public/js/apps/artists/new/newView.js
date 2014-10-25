define(['app', 'libs/views/regions/dialogView'], function (App, ViewsCommonDialog) {
  App.module('ArtistsApp.New', function (New, App, Backbone, Marionette, $, _) {
    New.Artist = ViewsCommonDialog.Form.extend({
      title: 'Создание нового артиста',
      onRender: function () {
        this.$(".js-submit").text("Создать")
      }
    })
  });
  return App.ArtistsApp.New;
});