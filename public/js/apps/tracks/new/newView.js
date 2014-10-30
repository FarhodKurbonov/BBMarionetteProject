define(['app', 'libs/views/regions/dialogView'], function (App, ViewsCommonDialog) {
  App.module('TracksApp.New', function (New, App, Backbone, Marionette, $, _) {
    New.Track = ViewsCommonDialog.Form.extend({
      title: 'Добавление новой минусовки',
      onRender: function () {
        this.$(".js-submit").text("добавить")
      }
    })
  });
  return App.TracksApp.New;
});