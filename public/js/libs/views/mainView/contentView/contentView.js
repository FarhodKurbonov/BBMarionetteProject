define(['app',
  'libs/views/_base/LayoutView',
  'libs/views/mainView/contentMainView/contentMainView',
  'tpl!libs/views/mainView/contentView/templates/contentLayout.tpl'
], function (App, /*Marionette Views->*/LayoutView, contentMainLayout,/*Templates->*/MainLayoutTpl) {
  App.module("Views.Common", function (Common, ContactManager, Backbone, Marionette, $, _) {
    Common.Content = LayoutView.extend({
      template: MainLayoutTpl,

      regions: {
        contentHeaderRegion: "#content-header-region",
        contentMainRegion: "#content-main-region"
      },

      initialize: function (options) {
        var contentMain = new contentMainLayout.ContentMain({

        })
      }
    })
  });
  return App.Views.Common;
});