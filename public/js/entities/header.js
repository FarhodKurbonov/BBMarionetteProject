define(['app'], function (App) {
  App.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {
    Entities.Header = Backbone.Model.extend({

    });
    Entities.Headers = Backbone.Collection.extend({
      model: Entities.Header
    });

    var API = {
      getHeaders: function () {
        return new Backbone.Collection([
          {name: 'Users'},
          {name: 'Leads'},
          {name: 'Appointments'}
        ]);
      }
    };
    App.reqres.setHandler('header:entities', function() {
      return API.getHeaders();
    })
  });
});