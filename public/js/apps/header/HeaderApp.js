define(['app'], function (App) {
  App.module('HeaderApp', function(HeaderApp, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;

    var API = {
      listHeader: function() {
        require(['apps/header/list/listController'], function(HeaderAppList) {
          HeaderAppList.Controller.listHeader()
        });
      }
    };
    HeaderApp.on('start', function () {
      API.listHeader()
    });

  });
  return App.HeaderApp;
});