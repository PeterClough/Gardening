/**
 * Created by peterclough on 13/09/2014.
 */
module.exports = function(PlantFamilyVersion) {


  PlantFamilyVersion.observe('after save', function (ctx, next) {

    var loopback = require('loopback');
    var path = require('path');


    if (ctx.instance) {


      var needsEmail = [1, -1].indexOf(ctx.instance.state);
      //1 accepted -1 rejected
      if (needsEmail > -1) {
        if (!!ctx.instance.authorId) {

          var User = loopback.getModelByType(loopback.User);

          User.findById(ctx.instance.authorId, function (err, cb) {


            var options = {
              type: 'email',
              to: cb.email,
              from: 'noreply@gardensyjardines.com',
              subject: subject,
              url: 'www.gardensyjardines.com',
              text: text,
              template: path.resolve(path.join(__dirname, '..', 'templates', 'wikiReview.ejs')),
              reviewNotes:  ctx.instance.reviewNotes
            };

            var subject = '';
            var text = '';
            if (ctx.instance.state === 1) {
              subject = 'Your Wiki Entry has been accepted.';
              options.thankYouStatement = 'We are happy with all contributions to our Wiki and happy to inform you that your entry was reviewed and accepted today. Please find the reviewer\u0027s notes below. \r\n\r\n';
            }
            else {
              subject = 'Sorry your Wiki Entry has been rejected.';
              options.thankYouStatement = 'We are grateful with all contributions to our Wiki, unfortunately our reviewer rejected your entry. Please find the reviewer\u0027s notes below. \r\n\r\n';
            }


            verify2(options, function (err, response) {
              if (err) {
                next(err);
                return;
              }
            });

          });

        }
        else {
        }
      }
    } else {
    }
    next();
  });


  function verify2(options, fn) {

    var loopback = require('loopback');
    var Email = options.mailer || this.constructor.email || loopback.getModelByType(loopback.Email);


    sendEmail();


    function sendEmail() {
      var template = loopback.template(options.template);

      Email.send({
        to: options.to,
        from: options.from,
        subject: options.subject,
        html: template(options),
        headers: options.headers || {}
      }, function (err, email) {
        if (err) {
          fn(err);
        } else {
          fn(null, {email: email});
        }
      });
    }
  }





  PlantFamilyVersion.getCompanions = function (versionId, cb) {

    PlantFamilyVersion.find({
      where: {id: versionId},
      fields: ['id'],
      include: [
        {
          relation: 'helps',
          scope: {
            fields: ['plantFamilyId']
          }
        },
        {
          relation: 'helpedBy',
          scope: {
            fields: ['plantFamilyId']
          }
        },
        {
          relation: 'badFor',
          scope: {
            fields: ['plantFamilyId']
          }
        }
      ]
    }, function (err, cb2) {
      cb(null, cb2);
    });
  };


  PlantFamilyVersion.remoteMethod(
    'getCompanions',
    {
      accepts: {arg: 'versionId', type: 'string'},
      returns: {arg: 'companions', type: 'object'}
    }
  );


  PlantFamilyVersion.getPlantFamilyVersionReview = function (id, cb) {

    PlantFamilyVersion.find({
      where: {id: id},
      fields: ['plantingAdvice', 'created', 'state', 'id', 'plantFamilyId', 'authorId'],
      include: [
        {
          relation: 'author',
          scope: {
            fields: ['firstName', 'lastName']
          }
        },
        {
          relation: 'helps',
          scope: {
            fields: ['name']
          }
        },
        {
          relation: 'helpedBy',
          scope: {
            fields: ['name']
          }
        },
        {
          relation: 'badFor',
          scope: {
            fields: ['name']
          }
        },
        {
          relation: 'plantFamily',
          scope: {
            fields: ['name', 'id'],
            include: [
              {
                relation: 'plantFamilyVersion',
                scope: {
                  where : {state: 1},
                  fields: ['plantingAdvice', 'created', 'id', 'plantFamilyId', 'authorId'],
                  include: [
                    {
                      relation: 'author',
                      scope: {
                        fields: ['firstName', 'lastName']
                      }
                    },
                    {
                      relation: 'helps',
                      scope: {
                        fields: ['name']
                      }
                    },
                    {
                      relation: 'helpedBy',
                      scope: {
                        fields: ['name']
                      }
                    },
                    {
                      relation: 'badFor',
                      scope: {
                        fields: ['name']
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }, function (err, cb2) {
      cb(null, cb2);
    });
  };


  PlantFamilyVersion.remoteMethod(
    'getPlantFamilyVersionReview',
    {
      accepts: {arg: 'id', type: 'string'},
      returns: {arg: 'plantFamilyVersions', type: 'object'}
    }
  );


  PlantFamilyVersion.getPlantFamilyVersion = function (plantFamilyId, cb) {

    PlantFamilyVersion.find({
      where: {and :[{plantFamilyId: plantFamilyId}, {state:1}]},
      fields: ['plantingAdvice', 'created', 'state', 'id', 'authorId'],
      include: [
        {
          relation: 'author',
          scope: {
            fields: ['firstName', 'lastName']
          }
        },
        {
          relation: 'helps',
          scope: {
            fields: ['name']
          }
        },
        {
          relation: 'helpedBy',
          scope: {
            fields: ['name']
          }
        },
        {
          relation: 'badFor',
          scope: {
            fields: ['name']
          }
        }
      ]
    }, function (err, cb2) {
      cb(null, cb2);
    });
  };


  PlantFamilyVersion.remoteMethod(
    'getPlantFamilyVersion',
    {
      accepts: {arg: 'plantFamilyId', type: 'string'},
      returns: {arg: 'plantFamilyVersion', type: 'object'}
    }
  );


};
