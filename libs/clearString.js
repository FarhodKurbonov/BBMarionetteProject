var _s = require('underscore.string');

exports.clearString = function(inputString, truncLength) {

  var clearString = _s.stripTags(inputString);//Strip all html tags
      clearString = _s.trim(clearString);//
      clearString = _s.clean(clearString);//Compress some whitespaces to one.
      clearString = _s.truncate(clearString, truncLength);
  return clearString
};