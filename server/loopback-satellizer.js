var path = require('path');
var request = require('request');
var qs = require('querystring');
var jwt = require('jwt-simple');
var moment = require('moment');
var bodyParser = require('body-parser');

module.exports = function (app, config) {


  var User = app.models[config.USER_MODEL];

  var authHeader = config.AUTH_HEADER;

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));



  /*
   |--------------------------------------------------------------------------
   | Generate JSON Web Token
   |--------------------------------------------------------------------------
   */
  function createToken(user) {
    var payload = {
      sub: user._id,
      iat: moment().unix(),
      exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
  }



  function sendAccessToken (req, res) {
    var user = req.user;
    user.createAccessToken(User.settings.ttl, function (err, token) {
      if (err) {
        res.send(err);
        return;
      }
      token.token = createToken(user);
      res.send(token);
    });
  }

  app.post('/auth/login',
    function(req, res, next) {
      User.login({
        email: req.body.email,
        password: req.body.password
      }, function (err, user) {
        if (!user) {
          res.status(401).send({ message: 'Wrong email and/or password' });
          return;
        }
        req.user = user;
        next();
      });
    }, sendAccessToken);

  app.post('/auth/signup',
    function(req, res, next) {
      User.create({
        displayName: req.body.displayName,
        email: req.body.email,
        password: req.body.password
      }, function (err, user) {
        if (err) {
          res.status(409).send({ message: 'Email is already taken' });
          return;
        }
        req.user = user;
        next();
      });
    }, sendAccessToken);

  /*
   |--------------------------------------------------------------------------
   | Login with Facebook
   |--------------------------------------------------------------------------
   */

  // FACEBOOK
  app.post('/auth/facebook',
  // Step 1. Exchange authorization code for access token.
  function (req, res, next) {
    var accessTokenUrl = 'https://graph.facebook.com/oauth/access_token';
    var params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: config.FACEBOOK_SECRET,
      redirect_uri: req.body.redirectUri
    };


     request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
      if (response.statusCode !== 200) {
        res.status(500).send({ message: accessToken.error.message });
        return;
      }
      req.accessToken = qs.parse(accessToken);
      next();
    });
  },

  // Step 2. Retrieve profile information about the current user.
  function (req, res, next) {
    var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name', 'picture'];
    var graphApiUrl = 'https://graph.facebook.com/me?fields=' + fields.join(',');
    var accessToken = req.accessToken;

    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      if (response.statusCode !== 200) {
        res.status(500).send({ message: profile.error.message });
        return;
      }
      req.profile = profile;
      next();
    });
  },

  // Step 3a. Link user accounts.
  function (req, res, next) {
    if (!req.headers[authHeader]) {
      next();
      return;
    }
    var profile = req.profile;

    User.find({ where: { facebookId: profile.id }}, function(err, users) {
      var user = users[0];
      if (user) {
        res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
        return;
      }
      var token = req.headers[authHeader].split(' ')[1];
      var payload = jwt.decode(token, config.TOKEN_SECRET);
      User.findById(payload.sub, function(err, user) {
        if (!user) {
          res.status(400).send({ message: 'User not found' });
          return;
        }
        user.facebookId = profile.id;
        user.profilePicture = profile.picture;

        user.save(function() {
          res.send({
            token: createToken(user),
            user: user
          });
        });
      });
    });
  },

  // Step 3b. Create a new user account or return an existing one.
  function (req, res, next) {
    var profile = req.profile;
    var filter = { or: [{ facebookId: profile.id }, { email: profile.email }] };

    User.find({ where:  filter }, function(err, users) {
      var user = users[0];

      if (user) {
        if (!user.facebookId) {
          user.facebookId = profile.id;
          user.profilePicture = profile.picture;
          user.save(function () {
            req.user = user;
            next();
          });
          return;
        }

        req.user = user;
        next();
        return;
      }
      User.create({
        firstName: profile.first_name,
        lastName: profile.last_name,
        facebookId: profile.id,
        profilePicture: profile.picture,
        email: profile.email,
        password: profile.id,
        emailVerified: true
      }, function (err, user) {
        if (err) {
          res.send(err);
          return;
        }
        req.user = user;
        next();
      });
    });
  }, sendAccessToken);

 };




