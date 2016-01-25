/**
 * Created by peterclough on 29/11/14.
 */
module.exports = function(user) {



  user.afterRemote('create', function(context, user, next) {

    var options = {
      type: 'email',
      to: user.email,
      from: 'noreply@gardensyjardines.com',
      subject: 'Please verify your email address.',
      url: 'www.gardensyjardines.com/#/users/verified',
      user: user
    };
    user.verify(options, function(err, response) {
       if (err) {
        next(err);
        return;
      }
    });

    next();
  });


  //send password reset link when requested
  user.on('resetPasswordRequest', function(info) {
//hard coded openshift don't use host: port:
    var url = 'http://www.gardensyjardines.com/#/users/reset-password';
    var html = 'Click <a href="' + url + '/' + info.accessToken.id + '/' + info.accessToken.userId
      + '">here</a> to reset your password';

    user.app.models.Email.send({
      to: info.email,
      from: 'noreply@gardensyjardines.com',
      subject: 'Password reset',
      text: '',
      html: html
    }, function(err) {
    });
  });





  user.updatePassword = function(userId, password, cb) {
    user.findById(userId, function(err, usr) {
      usr.updateAttribute('password', password, function(err, cb2) {
        cb(null, cb2);
      });
    });
  };

  user.remoteMethod(
    'updatePassword',
    {
      accepts: [
        {arg: 'userId', type: 'string'},
        {arg: 'password', type: 'string'},
        ],
      returns: {arg: 'user', type: 'object'}
    }
  );


};



