define( ['app'] , function (App) {
  App.Behaviors = {
    Confirmable: Marionette.Behavior.extend({
      events: {
        'click .js-behavior-confirmable': 'confirmAction'
      },
      defaults: {
        message: 'Вы в этом уверены'
      },

      confirmAction: function () {
        var message = this.options.message;
        if (typeof (this.options.message) === 'function') {
          message = this.options.message(this.view);
        }
        if (confirm(message)) {

          this.view.trigger(this.options.event, {model: this.view.model});
        }
      }
    })
  };

  Marionette.Behaviors.behaviorsLookup = function () {
    return App.Behaviors;
  };
  return;
});