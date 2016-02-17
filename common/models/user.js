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
      url: 'www.gardensyjardines.com',
      redirect: '/#/users/verified',
      user: user
    };
    verify2(options, user, function(err, response) {
      if (err) {
        next(err);
        return;
      }
    });

    next();
  });


  function verify2(options, user, fn) {

    var loopback = require('loopback');
    var path = require('path');
    var crypto = require('crypto');
    var userModel = user.constructor;
    var app = userModel.app;
    //dodgy should really use node_env
    var env = app.get('env');
    options.redirect = options.redirect || '/';
    options.template = path.resolve(options.template || path.join(__dirname, '..', '..', 'node_modules', 'loopback', 'templates', 'verify.ejs'));
    options.user = user;
    options.protocol = options.protocol || 'http';
    options.host = options.host || (app && app.get('host')) || 'localhost';
    options.port = options.port || (app && app.get('port')) || 3000;
    options.url = env==='development' ?  options.host + ':' + options.port : options.url;
    options.restApiRoot = options.restApiRoot || (app && app.get('restApiRoot')) || '/api';
    options.verifyHref = options.verifyHref ||
      options.protocol +
      '://' +
      options.url +
      options.restApiRoot +
      userModel.http.path +
      userModel.sharedClass.find('confirm', true).http.path +
      '?uid=' +
      options.user.id ;
    console.log('finished options');

    // Email model
    var Email = options.mailer || this.constructor.email || loopback.getModelByType(loopback.Email);


    crypto.randomBytes(64, function(err, buf) {
      if (err) {
        fn(err);
      } else {
        user.verificationToken = buf.toString('hex');
        user.save(function(err) {
          if (err) {
            fn(err);
          } else {
            sendEmail(user, options.redirect);
          }
        });
      }
    });


    // TODO - support more verification types
    function sendEmail(user, redirect) {
      options.verifyHref += '&token=' + user.verificationToken + '&redirect=' + redirect;

      options.text = options.text || 'Please verify your email by opening this link in a web browser:\n\t{href}';

      options.text = options.text.replace('{href}', options.verifyHref);

      var template = loopback.template(options.template);

      Email.send({
        to: options.to || user.email,
        from: options.from,
        subject: options.subject || 'Thanks for Registering',
        text: options.text,
        html: template(options),
        headers: options.headers || {}
      }, function(err, email) {
        if (err) {
          fn(err);
        } else {
          fn(null, {email: email, token: user.verificationToken, uid: user.id});
        }
      });
    }
  };

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



