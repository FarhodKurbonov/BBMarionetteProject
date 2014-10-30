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
          count      : 0,
          changedOnServer: false
        }
      });

      _.extend(Entities.Artist.prototype, Backbone.Validation.mixin, {
        validation: {
          name: {
            required: true,
            minLength: 3,
            msg: 'Слишком короткий(мин. 3 символа)'
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

        },
        comparator: function (a, b) {
          var aName = a.get('name');
          var bName = b.get('name');
            return (aName < bName) ? -1 : 1
          }
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
        getArtistEntity: function (artistId, options) {
          var artist = new Entities.Artist({id: artistId});
          var defer = $.Deferred();
          options || (options = {});
          defer.then(options.success, options.error);
          var response = artist.fetch(_.omit(options, 'success', 'error'));
          $.when(response).done(function () {

            defer.resolveWith(response, [artist]);

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

      App.reqres.setHandler('artist:entity:new', function () {
        return new Entities.Artist();
      })
    });
    return;
  });