define(['app', 'apps/footer/show/showView'], function (App, FooterAppShow) {
  App.module('FooterApp.Show', function(Show, App, Backbone, Marionette, $, _) {
    Show.Controller = {
      showFooter: function () {
        var footerView = this.getFooterView();
        App.footerRegion.show(footerView)
      },
      getFooterView: function() {
        return new FooterAppShow.Footer
      }
    }
  });
  return App.FooterApp.Show;
});