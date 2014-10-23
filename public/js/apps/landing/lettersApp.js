define(['app'], function(App) {
  /**
   * LettersApp Этот модуль запускается RoutersLettersApp модулем. Делается это для того
   *            чтобы все модули не запускались автоматически при старте главного приложения "App"
   *            что позволяет гипко управлять модулями(выключая и или включая). Тем самым мы достигаем
   *            оптимизации используемой памяти освобождая ее от неизпользуемый данных которые модули
   *            загружают
   */
  App.module('LettersApp', function(LettersApp, App, Backbone, Marionette, $, _) {
    LettersApp.startWithParent = false;

    LettersApp.onStart = function() {
      console.info('Start LettersApp!');
    };

    LettersApp.onStop = function () {
      console.info('Stop LettersApp')
    };

  });
  /**
   * RoutersLettersApp  Этот автоматически запускается при старте "App". В нем мы запускаем
   *                    модуль LettersApp
   */
  App.module('Routers.LettersApp', function(RoutersLettersApp, App, Backbone, Marionette, $, _) {
    RoutersLettersApp.Router = Marionette.AppRouter.extend({
      appRoutes: {
        'letters': 'listLetters'
      }
    });
    /**
     * Функция запускает необходимый модуль запускаем родительский модуль ContactsApp
     * а затем методы родительского модуля
     * @param {Object} action
     * @param {Object} args
     * @private
     */
    var _executeAction = function(action, args) {
      App.startApp('LettersApp');
      action(args);
    };

    var API = {
      listLetters: function() {
        require(['apps/landing/list/listController'], function(ListController) {
          _executeAction(ListController.listLetters, {});
        })
      }
/*      listArtists: function(id) {
        require([], function(){

        });
       App.trigger('artists:list', model.get('id'));
      }*/
    };
    //Запускаем landingPage
    this.listenTo(App, 'letters:list', function() {
      App.navigate('letters');
      API.listLetters()
    });
    //Выводим список артистов выбранной буквы
/*    this.listenTo(App, 'letter:show', function(id) {
      App.navigate('letters/'+id);
      API.listArtists(id);
    });*/

    /**
     * Привязываем роутер к API
     */
    App.addInitializer(function() {
      new RoutersLettersApp.Router({
        controller: API
      })
    })
  });
  return App.LettersApp;
});