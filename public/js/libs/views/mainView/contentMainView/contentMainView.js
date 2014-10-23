define(['app',
  'libs/views/_base/LayoutView',
  'tpl!libs/views/mainView/templates/mainLayout.tpl'
], function (App, /*Marionette Views->*/LayoutView,/*Templates->*/MainLayoutTpl) {
  App.module("Views.Common", function (Common, ContactManager, Backbone, Marionette, $, _) {
    Common.ContentMain = LayoutView.extend({
      template: MainLayoutTpl,

      regions: {
        contentHeaderRegion: "#content-header-region",
        contentMainRegion: "#content-main-region"
      },

      initialize: function (options) {

      }
    })
  });
  return App.Views.Common;
});