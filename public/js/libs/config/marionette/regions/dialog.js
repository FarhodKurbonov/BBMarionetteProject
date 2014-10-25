define(['marionette', 'jquery-ui'], function(Marionette) {
  Marionette.Region.Dialog = Marionette.Region.extend({
    onShow: function (view) {
      this.listenTo(view, 'dialog:close', this.closeDialog);

      var self = this;
      var configureDialog = function () {
        self.$el.dialog({
          modal: true,
          title: view.title,
          width: 'auto',
          close: function (e, ui) {
            self.closeDialog();
          }
        });
      };
      configureDialog();
      this.listenTo(view, 'render', configureDialog);
    },
    closeDialog: function () {
      this.stopListening();
      this.empty();
      this.$el.dialog('destroy');
    }
  });
  return Marionette.Region.Dialog;

});