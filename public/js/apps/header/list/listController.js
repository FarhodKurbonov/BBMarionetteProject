define(['app', 'apps/header/list/listView'], function (App, HeaderAppList) {
  App.module('HeaderApp.List', function(List, App, Backbone, Marionette, $, _) {
    List.Controller = {

      listHeader: function () {
        require(['entities/header'], function() {
          var links = App.request('header:entities');
          window.linkeds = links;
          var headerView = List.Controller.getHeaderVew(links);
          App.headerRegion.show(headerView);
         });

      },
      getHeaderVew: function(links) {
        return new HeaderAppList.Headers({
          collection: links
        })
      }
    }
  });
  return App.HeaderApp.List;
});