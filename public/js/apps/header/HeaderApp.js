define(['app','apps/header/list/listController' ], function (App, Controllers) {
  App.module('HeaderApp', function(HeaderApp, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    var API = {
      listHeader: function() {
        Controllers.listHeader();
        console.log('headerApp');
      }
    };
    App.commands.setHandler('set:active:header', function (name) {
      Controllers.setActiveHeader(name);
    });

    HeaderApp.on('start', function () {
      API.listHeader();
    });

  });
  return App.HeaderApp;
});