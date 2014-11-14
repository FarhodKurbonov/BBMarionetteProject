define(['app'], function(App) {
  /**
   * ArtistsApp Этот модуль запускается Routers.ArtistsApp модулем. Делается это для того
   *            чтобы все модули не запускались автоматически при старте главного приложения "App"
   *            что позволяет гипко управлять модулями(выключая и или включая). Тем самым мы достигаем
   *            оптимизации используемой памяти освобождая ее от неизпользуемый данных которые модули
   *            загружают
   */
  App.module('ArtistsApp', function(ArtistsApp, App, Backbone, Marionette, $, _) {
    ArtistsApp.startWithParent = false;

    ArtistsApp.onBeforeStart = function() {
      console.info('Start ArtistsApp!');
      App.module('HeaderApp').start();
      App.module('FooterApp').start();
      //App.module('PlayerApp').start();

    };
    /**
     * Запускаем Модули Header and Footer
     */
/*    ArtistsApp.addInitializer(function() {

    });*/

    ArtistsApp.onBeforeStop = function () {
      console.info('Stop ArtistsApp');
      App.module('HeaderApp').stop();
      App.module('FooterApp').stop();
      //App.module('PlayerApp').stop();
    };

  });
  /**
   * RoutersArtistsApp  автоматически запускается при старте "App". В нем мы запускаем
   *                    модуль ArtistsApp
   */
  App.module('Routers.ArtistsApp', function(RoutersArtistsApp, App, Backbone, Marionette, $, _) {
    RoutersArtistsApp.Router = Marionette.AppRouter.extend({
      appRoutes: {
        'artists/:letter(/filter/:params)': 'listArtists'
      }
    });
    var lt;//<-- this variable save for using to page navigate. Need for change
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
     * Функция запускает необходимый модуль запускаем родительский модуль ArtistsApp
     * а затем методы родительского модуля
     * @param {Object} action
     * @param {Object} args
     * @private
     */
    var _executeAction = function(action, args) {
      App.startApp('ArtistsApp');
      action(args);
    };

    var API = {
      listArtists: function(letter, params) {
        lt = letter;
        //----------delete wrap class---------
        //Убираем обертку. Небоходимо для задуманной верстки макета
        var generalWrapper = $('.general');
        if( generalWrapper.hasClass('wrap') ) {
          generalWrapper.removeClass('wrap').end();
        }

        //---------------Start ArtistsApp---------------------
        require(['apps/artists/list/listController'], function(ListController) {
          var options = parseParams(params);
              options.firstLetter = letter;//<--- вставили чтобы был доступ из других модулей
          _executeAction(ListController.listArtists, options);
          //App.execute('set:active:header', 'artists');
        })
      }
    };
    /**
     * Обработчик события изменения номера страницы в pageControl
     */
    this.listenTo(App, 'page:change', function (options) {
      App.navigate('artists/'+ lt +'/filter/' + serializeParams(options));
    });
    /**
     * Обработчик вывода списка артистов
     */
    this.listenTo(App, 'artists:list', function (params) {
      console.log('Trigger->contacts:list');
      App.navigate('artists');
      API.listArtists(params);
    });
    /**
     * Обработчик события фильтрации
     */
    this.listenTo(App, 'artists:filter', function (options) {
      if (options) {
        App.navigate('artists/' + options.letter + '/filter/' + serializeParams(options));
      } else {
        App.navigate('artists/' + options.letter);
      }
    });

    /**
     * Привязываем роутер к API
     */
    App.addInitializer(function() {
      new RoutersArtistsApp.Router({
        controller: API
      })
    })
  });
  return App.ArtistsApp;
});