/**
 *
 * @param {}response
 * @param template
 */
module.exports = function(response, template) {
  this.response = response;
  this.template = template;
};
/**
 *
 * @type {{extend: Function, render: Function}}
 */
module.exports.prototype = {
  extend: function(properties) {
    var Child = module.exports;
    Child.prototype = module.exports.prototype;
    for(var key in properties) {
      Child.prototype[key] = properties[key];
    }
    return Child;
  },
  render: function(data) {
    if(this.response && this.template) {
      this.response.render(this.template, data);
    }
  }
};