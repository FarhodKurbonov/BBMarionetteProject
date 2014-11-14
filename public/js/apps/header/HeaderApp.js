define(['app','apps/header/list/listController' ], function (App, Controllers) {
  App.module('HeaderApp', function(HeaderApp, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    HeaderApp.onStart = function() {
      API.listHeader();
      //console.info('Start HeaderApp!');
    };

    HeaderApp.onBeforeStop = function () {
      console.info('Stop HeaderApp');

      //Destroy HeaderApp.List.Controller and unbind all events
      Controllers.destroy();
      //Clear HeaderRegion
      App.headerRegion.empty()
    };
    var API = {
      listHeader: function() {
        Controllers.listHeader();
        //console.log('List headers');
      }
    };
    App.commands.setHandler('set:active:header', function (name) {
      Controllers.setActiveHeader(name);
    });

  });
  return App.HeaderApp;
});