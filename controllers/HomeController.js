var BaseController = require("./BaseController"),
  View = require("../views/BaseView");

module.exports = BaseController.extend({
  name: "Home",
  content: null,
  run: function(req, res, next) {
    var self = this;
    //Отдаем идексную страницу
    self.getContent(function(content){
      var homeView = new View(res, 'home');
      homeView.render(content);
    })

  },
  getContent: function(callback) {
    var self = this;
    this.content = {};
    callback(this.content)

  }
});