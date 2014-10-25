define(['app'], function(App) {
  /**
   * LettersApp Этот модуль запускается RoutersLettersApp модулем. Делается это для того
   *            чтобы все модули не запускались автоматически при старте главного приложения "App"
   *            что позволяет гипко управлять модулями(выключая и или включая). Тем самым мы достигаем
   *            оптимизации используемой памяти освобождая ее от неизпользуемый данных которые модули
   *            загружают
   */
  App.module('ArtistsApp', function(ArtistsApp, App, Backbone, Marionette, $, _) {
    ArtistsApp.startWithParent = false;

    ArtistsApp.onStart = function() {
      console.info('Start ArtistsApp!');


    };
    ArtistsApp.addInitializer(function() {
      App.module('HeaderApp').start();
      App.module('FooterApp').start();
    });
    ArtistsApp.onStop = function () {
      console.info('Stop ArtistsApp')
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
    var lt;//<-- this variable save for using to page navigate

    var serializeParams = function (options) {
      options = _.pick(options, 'criterion', 'page');
      return ( _.map(_.filter(_.pairs(options), function (pair) {
        return pair[1];
      }),
        function (pair) {
          return pair.join(':');
        }) ).join('+')
    };

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
      App.startApp('ArtistsApp');
      action(args);
    };

    var API = {
      listArtists: function(letter, params) {
        lt = letter;
        //----------Unwrap wrapper---------
        var mainRegion = $('#main-region');
        if(mainRegion.parent().is('.wrap')){
          mainRegion.unwrap();
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
    this.listenTo(App, 'page:change', function (options) {
      App.navigate('artists/'+ lt +'/filter/' + serializeParams(options));
    });
    this.listenTo(App, 'artists:list', function (params) {
      console.log('Trigger->contacts:list');
      App.navigate('artists');
      API.listArtists(params);
    });
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