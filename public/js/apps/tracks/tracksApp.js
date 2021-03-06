define(['app'], function(App) {
  /**
   * TracksApp Этот модуль запускается Routers.TracksApp модулем. Делается это для того
   *            чтобы все модули не запускались автоматически при старте главного приложения "App"
   *            что позволяет гипко управлять модулями(выключая и или включая). Тем самым мы достигаем
   *            оптимизации используемой памяти освобождая ее от неизпользуемый данных которые модули
   *            загружают
   */

  App.module('TracksApp', function(TracksApp, App, Backbone, Marionette, $, _) {
    TracksApp.startWithParent = false;

    TracksApp.onBeforeStart = function() {
      console.info('Start TracksApp!');
      App.module('HeaderApp').start();
      App.module('FooterApp').start();
      App.module('PlayerApp').start();

    };
    /**
     * Запускаем Модули Header and Footer
     */

    TracksApp.onBeforeStop = function () {
      console.info('Stop TracksApp');
      App.module('HeaderApp').stop();
      App.module('FooterApp').stop();
      App.module('PlayerApp').stop();
    };

  });
  /**
   * RoutersTracksApp  автоматически запускается при старте "App". В нем мы запускаем
   *                    модуль TracksApp
   */
  App.module('Routers.TracksApp', function(RoutersTracksApp, App, Backbone, Marionette, $, _) {
    RoutersTracksApp.Router = Marionette.AppRouter.extend({
      appRoutes: {
        'tracks/:artist/:id': 'listTracks'
      }
    });
    /**
     * Преобразует данные для обработки Backbone.Paginator
     * Необходимо для реализации функционала фильтрации
     * @param {String.<"../filter/...">} options
     * @returns {String.<"../filter/criterion:criteria + page:pageNum">}
     */
    var serializeParams = function (options) {
      options = _.pick(options, 'criterion', 'page');
      return ( _.map(_.filter(_.pairs(options), function (pair) {
        return pair[1];
      }),
        function (pair) {
          return pair.join(':');
        }) ).join('+')
    };
    /**
     * @param {String} params
     * @returns {Object}
     */
    var parseParams = function (params) {
      var options = {};
      if (params && params.trim() !== '') {
        params = params.split('+');
        _.each(params, function (param) {
          var values = param.split(':');
          if (values[1]) {
            if (values[0] === 'page') {
              options[values[0]] = parseInt(values[1], 10);
            } else {
              options[values[0]] = values[1];
            }
          }
        });
      }
      _.defaults(options, { page: 1 });
      return options;
    };

    /**
     * Функция запускает необходимый модуль запускаем родительский модуль ContactsApp
     * а затем методы родительского модуля
     * @param {Object} action
     * @param {Object} args
     * @private
     */
    var _executeAction = function(action, args) {
      App.startApp('TracksApp');
      console.info('start TracksApp');
      action(args);
    };

    var API = {
      listTracks: function(artist, id, params) {
        //----------delete wrap class---------
        //Убираем обертку. Небоходимо для задуманной верстки макета
        var generalWrapper = $('.general');
        if( generalWrapper.hasClass('wrap') ) {
          generalWrapper.removeClass('wrap').end();
        }

        //---------------Start TracksApp---------------------
        require(['apps/tracks/list/listController'], function(ListController) {
          var options = parseParams(params);
          options.id = id;
          options.artist = artist;
          _executeAction(ListController.listTracks, options);
          //App.execute('set:active:header', 'artists');
        })
      }

    };
    /**
     * Обработчик события изменения номера страницы в pageControl
     */
/*    this.listenTo(App, 'track:play', function (model) {
      API.play(model);
    });*/
    /**
     * Обработчик вывода списка артистов
     */
/*    this.listenTo(App, 'artists:list', function (params) {
      console.log('Trigger->contacts:list');
      App.navigate('artists');
      API.listArtists(params);
    });*/
    /**
     * Обработчик события фильтрации
     */
/*    this.listenTo(App, 'artists:filter', function (options) {
      if (options) {
        App.navigate('artists/' + options.letter + '/filter/' + serializeParams(options));
      } else {
        App.navigate('artists/' + options.letter);
      }
    });*/

    /**
     * Привязываем роутер к API
     */
    App.addInitializer(function() {
      new RoutersTracksApp.Router({
        controller: API
      })
    })
  });
  return App.TracksApp;
});