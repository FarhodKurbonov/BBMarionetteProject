define(['app', 'libs/views/regions/dialogView'], function(App, ViewsCommonDialog) {
  App.module('TracksApp.Edit', function (Edit, App, Backbone, Marionette, $, _) {
    Edit.Track = ViewsCommonDialog.Form.extend({
      onBeforeRender: function () {
        this.title = 'Редактирование ' + this.model.get('name');
      },
      onRender: function () {
        if (this.options && this.options.generateTitle) {
          var $title = $('<h1>', {text: this.title});
          this.$el.prepend($title);
        }
        //this.$('.js-submit').text('Обновить');

        this.$('.update-file').on('click', function(event) {
          if($(this).hasClass('clicked')) {
            $('.upload-wrapper').fadeOut();
            $(this).removeClass('clicked')
          } else {
            $('.upload-wrapper').fadeIn();
            $(this).addClass('clicked')
          }


        })
      }
    })
  });
  return App.TracksApp.Edit;
});