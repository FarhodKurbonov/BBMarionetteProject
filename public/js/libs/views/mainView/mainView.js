define(['app',
        'libs/views/_base/ItemView',
        'libs/views/_base/LayoutView',
        'tpl!libs/views/mainView/templates/mainLayout.tpl',
        'tpl!libs/views/mainView/templates/leftbar.tpl',
        'tpl!libs/views/mainView/templates/content.tpl'

], function (App, /*Marionette Views->*/ItemView, LayoutView, /*Templates->*/MainLayoutTpl, left, main) {
  App.module("Views.Common", function (Common, ContactManager, Backbone, Marionette, $, _) {
  Common.Main = LayoutView.extend({
    template: MainLayoutTpl,

    regions: {
      leftbarRegion: "#leftbar-region",
      contentRegion: "#content-region"
    },

    initialize: function (options) {

      var content = ItemView.extend({
        template: main
      });
      var leftbar = ItemView.extend({
        template: left
      });

      this.on('show', function() {
        this.leftbarRegion.show(new leftbar.render());
        this.contentRegion.show(new content.render());
      })
    }
  })
  });
  return App.Views.Common;
});