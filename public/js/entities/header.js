define([
  'app',
  'entities/_base/model',
  'entities/_base/collection',
  'picky'
], function (App, Model, Collection) {
  App.module('Entities', function (Entities, ContactManager, Backbone, Marionette, $, _) {
    Entities.Header = Model.extend({
      initialize: function () {
        var selectable = new Backbone.Picky.Selectable(this);
        _.extend(this, selectable);
      }
    });

    Entities.Headers = Collection.extend({
      model: Entities.Header,
      initialize: function () {
        var singleSelect = new Backbone.Picky.SingleSelect(this);
        _.extend(this, singleSelect)
      }
    });

    var initializeHeaders = function () {
      Entities.headers = new Entities.Headers([
        {name: 'Топ100',        url: 'top100', navigationTrigger: "top:list"},
        {name: 'Вход/Регистрация', url: 'auth',  navigationTrigger: "auth:show"}
      ])
    };

    var API = {
      getHeaders: function () {
        if (Entities.headers === undefined) {
          initializeHeaders();
        }
        return Entities.headers;
      }
    };

    ContactManager.reqres.setHandler('header:entities', function () {
      return API.getHeaders();
    })
  });
  return;
});