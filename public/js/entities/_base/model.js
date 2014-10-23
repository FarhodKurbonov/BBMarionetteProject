/**
 * Base model
 */
define(['app'], function (App) {
  App.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {
    /**
     * @constructor
     * @extends {Backbone.Model}
     * @type {Object}
     */
    Entities.Model = Backbone.Model.extend({});
    _.extend(Entities.Model.prototype, {
      refresh: function (serverData, keys) {
        var previousAttributes = this.previousAttributes();
        var changed = this.changedAttributes();

        this.set(serverData);
        if (changed) {
          this.set(changed, {silent: true});
          keys = _.difference(keys, _.keys(changed));
        }
        var clientSide = _.pick(previousAttributes, keys);
        var serverSide = _.pick(serverData, keys);
        //Если аттрибуты пришедшие из сервера и атрибуты изменненые непосредственно пользователем
        //разные то вывести уведомление в диалоговом окне
        this.set({changedOnServer: !_.isEqual(clientSide, serverSide)}, {silent: true});
      }
    })
  });
  return App.Entities.Model;
});