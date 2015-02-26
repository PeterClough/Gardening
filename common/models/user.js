/**
 * Created by peterclough on 29/11/14.
 */
module.exports = function(User) {
  var uuid = require('uuid');

  User.beforeCreate = function (next, user) {
    User.id = uuid.v4();
    return next();
  }
}
