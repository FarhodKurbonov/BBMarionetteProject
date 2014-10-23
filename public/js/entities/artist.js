define([
  'app',
  'entities/_base/model',
  'entities/_base/collection',
  'iosync',
  'validation',
  'paginator'
], function(App, Model, Collection) {
  App.module("Entities", function (Entities, App, Backbone, Marionette, $, _) {

      Entities.Artist = Model.extend({
        urlRoot: 'artists',
        initialize: function () {
        },
        defaults: {
          name       : '',
          letterId   : '',
          createdAt  : '',
          avatar     : '',
          changedOnServer: false
        }
      });

      _.extend(Entities.Artist.prototype, Backbone.Validation.mixin, {
        validation: {
          name: {
            required: true,
            pattern: 'Имя исполнителя',
            msg: 'обязательное поле'
          }
        }
      });

      Entities.Artists = Backbone.Paginator.clientPager.extend({
        model: Entities.Artist,

        initialize: function(options) {
          options || (options = {});
          var params = options.parameters || {page: 1};
          this.parameters = new Backbone.Model(params);

          this.paginator_ui = {
            firstPage: 1,
            currentPage: 1,
            perPage: 10,
            pagesInRange: 2
          };

          this.paginator_core = {
            url: 'artists'
          };

          var self = this;
          this.listenTo(this.parameters, 'change', function (model) {
            if (_.has(model.changed, 'criterion')) {
              self.setFilter(['name'], self.parameters.get('criterion'));
            }
            if (_.has(model.changed, 'page')) {
              self.goTo(parseInt(self.parameters.get('page'), 10));
            }
            //Изменение строки состояния браузера при изменении страницы paginator`а
            App.trigger('page:change', _.clone(model.attributes));
            //Инициируем рендеринг paginator`а
            self.trigger('page:change:after');
          })

        }
/*        comparator: function (a, b) {
          var aFirstName = a.get('firstName');
          var bFirstName = b.get('firstName');
          if (aFirstName === bFirstName) {
            var aLastName = a.get('lastName');
            var bLastName = b.get('lastName');
            return  ( aLastName === bLastName) ? 0 :
              (aLastName < bLastName) ? -1 : 1
          } else {
            return (aFirstName < bFirstName) ? -1 : 1
          }
        }*/
      });

      var API = {
        getArtistEntities: function (options) {

          var artists = new Entities.Artists();

          var defer = $.Deferred();

          options || (options = {});
          var artist = new Entities.Artist({id: options.firstLetter});
          artists.paginator_core.url = artist.url();
          options.reset = true;

          defer.then(options.success, options.error);

          var response = artists.fetch(_.omit(options, 'success', 'error'));
          response.done(function () {
            defer.resolveWith(response, [artists]);
          });

          response.fail(function () {
            defer.rejectWith(response, arguments);
          });
          return defer.promise();
        },
        getArtistEntity: function (contactId, options) {
          var contact = new Entities.Artist({id: contactId});
          var defer = $.Deferred();
          options || (options = {});
          defer.then(options.success, options.error);
          var response = contact.fetch(_.omit(options, 'success', 'error'));
          $.when(response).done(function () {

            defer.resolveWith(response, [contact]);

          }).fail(function () {
              defer.rejectWith(response, arguments);
            });

          return defer.promise();
        }
      };

      App.reqres.setHandler('artists:entities', function (options) {
        return API.getArtistEntities(options)
      });

      App.reqres.setHandler('artist:entity', function (id, options) {
        return API.getArtistEntity(id, options)
      });

      App.reqres.setHandler('artist:entity:new', function (id, options) {
        return new Entities.Contact();
      })
    });
    return;
  });