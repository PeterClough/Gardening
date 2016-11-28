var path = require('path');
var request = require('request');
var qs = require('querystring');
var jwt = require('jwt-simple');
var moment = require('moment');
var bodyParser = require('body-parser');

module.exports = function (app) {



  var userModel = app.get('USER_MODEL');
  var User = app.models[userModel];
  var authHeader = app.get('AUTH_HEADER');
  var facebookSecret= app.get('FACEBOOK_SECRET');
  var googleSecret= app.get('GOOGLE_SECRET');
  var tokenSecret= app.get('TOKEN_SECRET');


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
    return jwt.encode(payload, tokenSecret);
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

    console.log('Exchange authorization code for access token', facebookSecret);


    var accessTokenUrl = 'https://graph.facebook.com/oauth/access_token';
    var params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: facebookSecret,
      redirect_uri: req.body.redirectUri
    };


     request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
      if (response.statusCode !== 200) {
        res.status(500).send({ message: accessToken.error.message });
        return;
      }
      req.accessToken = qs.parse(accessToken);
       console.log('req.accessToken', req.accessToken);
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
      console.log('req.profile', req.profile);
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
        console.log('There is already a Facebook account that belongs to you');

        return;
      }
      var token = req.headers[authHeader].split(' ')[1];
      var payload = jwt.decode(token, tokenSecret);
      User.findById(payload.sub, function(err, user) {
        console.log('User.findById', user);

        if (!user) {
          res.status(400).send({ message: 'User not found' });
          return;
        }
        user.facebookId = profile.id;
        user.profilePicture = profile.picture.data.url;
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
          user.profilePicture = profile.picture.data.url;
          user.save(function () {
            console.log('user.save', user);

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
        profilePicture: profile.picture.data.url,
        email: profile.email,
        password: profile.id,
        emailVerified: true
      }, function (err, user) {
        if (err) {
          res.send(err);
          return;
        }
        console.log('User.create', user);
        req.user = user;
        next();
      });
    });
  }, sendAccessToken);




// GOOGLE
  app.post('/auth/google',
    // Step 1. Exchange authorization code for access token.
    function(req, res, next) {
      var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
      var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: googleSecret,
        redirect_uri: req.body.redirectUri,
        grant_type: 'authorization_code'
      };

      request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
        if (response.statusCode !== 200) {
          res.status(500).send(err);
          return;
        }
        var accessToken = token.access_token;
        req.accessToken = accessToken;
        next();
      });
    },

    // Step 2. Retrieve profile information about the current user.
    function (req, res, next) {

      var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
      var accessToken = req.accessToken;
      var headers = { Authorization: 'Bearer ' + accessToken };
      request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
        if (response.statusCode !== 200) {
          res.status(500).send(err);
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
      User.find({ where: { googleId: profile.sub } }, function(err, users) {
        var user = users[0];
        if (user) {
          res.status(409).send({ message: 'There is already a Google account that belongs to you' });
          return;
        }

        var token = req.headers[authHeader].split(' ')[1];
        var payload = jwt.decode(token, tokenSecret);
        User.findById(payload.sub, function(err, user) {
          if (!user) {
            res.status(400).send({ message: 'User not found' });
            return;
          }
          user.googleId = profile.sub;
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
      var filter = { or: [{ googleId: profile.sub }, { email: profile.email }] };

      User.find({ where: filter }, function(err, users) {
        var user = users[0];

        if (user) {
          if (!user.google) {
            user.googleId = profile.sub;
            user.profilePicture = profile.picture,
              user.save(function() {
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
          firstName: profile.given_name,
          lastName: profile.family_name,
          googleId: profile.sub,
          profilePicture: profile.picture,
          email: profile.email,
          password: profile.sub,
          emailVerified: true
        }, function (err, user) {
          if (err) {
            res.status(500).send(err);
            return;
          }
          req.user = user;
          next();
        });

      });
    }, sendAccessToken);

};




