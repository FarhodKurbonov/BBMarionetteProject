var _ = require("underscore");
/**
 * Create BaseController for extend it in future
 * @type {{name: string, extend: Function, run: Function}}
 */
module.exports = {
  name: "base",
  extend: function(child) {
    return _.extend({}, this, child);
  },
  run: function(req, res, next) {
    /**
     * Each controller must override this method
     */
  }
};