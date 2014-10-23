define([
  'app',
  'entities/_base/model',
  'entities/_base/collection',
  'iosync'
], function (App, Model, Collection) {

  App.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {
    /**
     * @extends {App.Entities.Model}
     * @return {Object} Custom Model extends from Entities.Model;
     */
    Entities.Letter = Model.extend({
      urlRoot   : 'letters',
      initialize: function() {
      },
      defaults  : {
      }
    });

    /**
     * @extends {App.Entities.Collection}
     * @return {Object} Custom Model extends from Entities.Model;
     */
    Entities.LetterCollection = Collection.extend({
      model: Entities.Letter,
      url  : 'letters'
    });

    /**
     * API
     * @type {{getLetterEntities: Function}}
     * @protected
     */
    var API = {
      getLetterEntities: function () {
        var letters = new Entities.LetterCollection();
        var defer = $.Deferred();
        var response = letters.fetch();
        response.done(function() {
          defer.resolveWith(response, [letters]);
        });
        response.fail(function() {
          defer.rejectWith(response, arguments);
        });
        return defer.promise();
      }
    };
    App.reqres.setHandler('letters:entities', function() {
      return API.getLetterEntities();
    })
  });



  return;
});