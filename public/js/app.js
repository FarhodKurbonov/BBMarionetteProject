define(['marionette'], function (Marionette) {
  var App = new Marionette.Application();
  App.addRegions({
    mainRegion: '#main-region'
  });
  /**
   * Кастомная функция для обновления url состояния адресной строки
   * @param {String} route Фрагмент url
   * @param {Object} options дополнительные опции
   */
  App.navigate = function(route, options) {
    options || (options = {});
    Backbone.history.navigate(route, options);
  };
  /**
   * Геттер для считывания текущего url
   * @returns {fragment}
   */
  App.getCurrenRouet = function () {
    return Backbone.history.fragment;
  };
  /**
   * Метод для запуска модулей.
   * @param {Object} appName Имя запускаемого модуля
   * @param {Object} args Аргументы модуля
   */
  App.startApp = function(appName, args) {
    var currentApp = App.module(appName);
    //если модуль уже запущет то ничего не делать
    if(App.currentApp === currentApp) return;
    //если запускается другой модуль то остановить текущий
    if(App.currentApp) App.currentApp.stop();
    //и запустить новый
    App.currentApp = currentApp;
    currentApp.start(args);
  };

  App.on('start', function() {
    if(Backbone.history){
      require(['apps/landing/lettersApp'], function() {
       Backbone.history.start();
       if(App.getCurrenRouet() === '') {
         App.trigger('letters:list');// Trigger landing page
       }
      });
    }
  });
  return App;
});